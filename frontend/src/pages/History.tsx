import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import api from "../utils/api";

import { useToast } from "../context/ToastContext";

import { LoadingSpinner } from "../components/LoadingSpinner";

import { motion, AnimatePresence } from "framer-motion";

import ReactMarkdown from "react-markdown";

import {
  History,
  Search,
  Clipboard,
  Trash2,
  Sparkles,
  FileText,
  BookOpen,
  X,
  Eye,
  Pin,
  RotateCcw,
  Download,
} from "lucide-react";

interface Generation {
  _id: string;

  toolType: "caption" | "blog" | "notes";

  prompt: any;

  output: string;

  createdAt: string;

  pinned?: boolean;
}

export const HistoryPage: React.FC = () => {
  const { showToast } = useToast();

  const [generations, setGenerations] =
    useState<Generation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState<Generation | null>(null);

  const [filterType, setFilterType] =
    useState<
      "all" | "caption" | "blog" | "notes"
    >("all");

  const [sortBy, setSortBy] =
    useState<
      "newest" | "oldest" | "longest"
    >("newest");

  const [selectedItems, setSelectedItems] =
    useState<string[]>([]);

  // FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await api.get("/generations");

      setGenerations(res.data);
    } catch (err) {
      console.error(err);

      showToast(
        "Failed to load history",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // COPY
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);

    showToast(
      "Copied successfully",
      "success"
    );
  };

 // DELETE MODAL STATE
const [deleteModal, setDeleteModal] =
  useState<{
    open: boolean;
    id: string | null;
    type: 'single' | 'all';
  }>({
    open: false,
    id: null,
    type: 'single',
  });

// DELETE SINGLE
const handleDelete = async (
  id: string
) => {

  setDeleteModal({
    open: true,
    id,
    type: 'single',
  });
};

// DELETE ALL
const handleDeleteAll = async () => {

  setDeleteModal({
    open: true,
    id: null,
    type: 'all',
  });
};

// CONFIRM DELETE
const confirmDelete = async () => {

  try {

    // SINGLE DELETE
    if (
      deleteModal.type ===
        'single' &&
      deleteModal.id
    ) {

      await api.delete(
        `/generations/${deleteModal.id}`
      );

      setGenerations((prev) =>
        prev.filter(
          (g) =>
            g._id !==
            deleteModal.id
        )
      );

      showToast(
        'Deleted successfully',
        'success'
      );

      if (
        selectedItem?._id ===
        deleteModal.id
      ) {
        setSelectedItem(null);
      }

    } else {

      // DELETE ALL
      await api.delete(
        '/generations/delete-all'
      );

      setGenerations([]);

      showToast(
        'All history deleted',
        'success'
      );
    }

  } catch (err) {

    showToast(
      'Delete failed',
      'error'
    );

  } finally {

    setDeleteModal({
      open: false,
      id: null,
      type: 'single',
    });
  }
};
  // PIN
  const handlePin = async (
    id: string
  ) => {
    try {
      const res = await api.put(
        `/generations/${id}/pin`
      );

      setGenerations((prev) =>
        prev.map((g) =>
          g._id === id ? res.data : g
        )
      );
    } catch (err) {
      showToast("Pin failed", "error");
    }
  };

  // REGENERATE
  const handleRegenerate = async (
    item: Generation
  ) => {
    try {
      const endpointMap = {
        caption: "/ai/caption",
        blog: "/ai/blog",
        notes: "/ai/notes",
      };

      const endpoint =
        endpointMap[item.toolType];

      const res = await api.post(
        endpoint,
        item.prompt
      );

      showToast(
        "Regenerated successfully",
        "success"
      );

      fetchHistory();

      setSelectedItem({
        ...item,
        output: res.data.output,
      });
    } catch (err) {
      showToast(
        "Regeneration failed",
        "error"
      );
    }
  };

  // EXPORT TXT
  const exportTXT = (
    item: Generation
  ) => {
    const blob = new Blob([item.output], {
      type: "text/plain",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "lumina-output.txt";

    a.click();
  };

  // EXPORT MD
  const exportMD = (
    item: Generation
  ) => {
    const blob = new Blob([item.output], {
      type: "text/markdown",
    });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = "lumina-output.md";

    a.click();
  };

  // MULTI SELECT
  const toggleSelection = (
    id: string
  ) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // DELETE SELECTED
  const deleteSelected = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          api.delete(`/generations/${id}`)
        )
      );

      setGenerations((prev) =>
        prev.filter(
          (g) =>
            !selectedItems.includes(g._id)
        )
      );

      setSelectedItems([]);

      showToast(
        "Selected items deleted",
        "success"
      );
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  // FILTER + SORT
  const filteredGenerations =
    useMemo(() => {
      let data = [...generations];

      data = data.filter((item) => {
        const matchesType =
          filterType === "all" ||
          item.toolType === filterType;

        const text = (
          JSON.stringify(item.prompt) +
          item.output
        ).toLowerCase();

        return (
          matchesType &&
          text.includes(
            searchQuery.toLowerCase()
          )
        );
      });

      data.sort((a, b) => {
        if (a.pinned && !b.pinned)
          return -1;

        if (!a.pinned && b.pinned)
          return 1;

        if (sortBy === "newest") {
          return (
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
          );
        }

        if (sortBy === "oldest") {
          return (
            new Date(
              a.createdAt
            ).getTime() -
            new Date(
              b.createdAt
            ).getTime()
          );
        }

        return (
          b.output.length -
          a.output.length
        );
      });

      return data;
    }, [
      generations,
      filterType,
      searchQuery,
      sortBy,
    ]);

  // ANALYTICS
  const analytics = {
    captions: generations.filter(
      (g) => g.toolType === "caption"
    ).length,

    blogs: generations.filter(
      (g) => g.toolType === "blog"
    ).length,

    notes: generations.filter(
      (g) => g.toolType === "notes"
    ).length,
  };

  // TOOL META
  const getToolMetadata = (
    type: string
  ) => {
    switch (type) {
      case "caption":
        return {
          label: "Caption",
          icon: Sparkles,
          color:
            "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5",
        };

      case "blog":
        return {
          label: "Blog",
          icon: FileText,
          color:
            "text-neon-blue border-neon-blue/20 bg-neon-blue/5",
        };

      default:
        return {
          label: "Notes",
          icon: BookOpen,
          color:
            "text-neon-violet border-neon-violet/20 bg-neon-violet/5",
        };
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="glass-card p-5 border border-dark-700/50">
          <p className="text-sm text-slate-400">
            Captions
          </p>

          <h2 className="text-3xl font-bold text-white">
            {analytics.captions}
          </h2>
        </div>

        <div className="glass-card p-5 border border-dark-700/50">
          <p className="text-sm text-slate-400">
            Blogs
          </p>

          <h2 className="text-3xl font-bold text-white">
            {analytics.blogs}
          </h2>
        </div>

        <div className="glass-card p-5 border border-dark-700/50">
          <p className="text-sm text-slate-400">
            Notes
          </p>

          <h2 className="text-3xl font-bold text-white">
            {analytics.notes}
          </h2>
        </div>

      </div>

      {/* CONTROLS */}
      <div className="glass-card p-4 border border-dark-700/50 flex flex-wrap gap-4 items-center">

        <input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search history..."
          className="glass-input px-4 py-2 text-sm flex-1"
        />

       <select
  value={filterType}
  onChange={(e) =>
    setFilterType(
      e.target.value as
        | "all"
        | "caption"
        | "blog"
        | "notes"
    )
  }
  className="
    glass-input
    px-4
    py-2
    text-sm
    bg-[#0F172A]
    text-slate-200
    border
    border-dark-700
    rounded-xl
    outline-none
    transition-all
    duration-300
    hover:border-cyan-500/40
    focus:border-cyan-400
    focus:ring-2
    focus:ring-cyan-500/20
  "
>
  <option value="all">
    All
  </option>

  <option value="caption">
    Captions
  </option>

  <option value="blog">
    Blogs
  </option>

  <option value="notes">
    Notes
  </option>
</select>
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-sm"
        >
          Delete All
        </button>

        {selectedItems.length > 0 && (
          <button
            onClick={deleteSelected}
            className="px-4 py-2 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 text-sm"
          >
            Delete Selected (
            {selectedItems.length})
          </button>
        )}

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredGenerations.map(
          (item) => {
            const meta =
              getToolMetadata(
                item.toolType
              );

            const Icon = meta.icon;

            return (
              <motion.div
                key={item._id}
                layout
                className="glass-card p-5 border border-dark-700/50 min-h-[330px] flex flex-col justify-between"
              >

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <input
                        type="checkbox"
                        checked={selectedItems.includes(
                          item._id
                        )}
                        onChange={() =>
                          toggleSelection(
                            item._id
                          )
                        }
                      />

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${meta.color}`}
                      >
                        <Icon className="w-3 h-3" />

                        {meta.label}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        handlePin(item._id)
                      }
                      className={`p-2 rounded-lg ${
                        item.pinned
                          ? "text-yellow-400"
                          : "text-slate-500"
                      }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-1">
                    {item.prompt.topic ||
                      item.prompt.title ||
                      item.prompt.subject}
                  </h3>

                  <p className="text-sm text-slate-400 line-clamp-5">
                    {item.output}
                  </p>

                </div>

                <div className="space-y-3 pt-4 border-t border-dark-700/50">

                  <div className="flex items-center justify-between text-xs text-slate-500">

                    <span>
                      {
                        item.output.split(
                          " "
                        ).length
                      }{" "}
                      words
                    </span>

                    <span>
                      {
                        item.output.length
                      }{" "}
                      chars
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <button
                      onClick={() =>
                        setSelectedItem(item)
                      }
                      className="text-xs text-slate-300 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />

                      Inspect
                    </button>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          handleRegenerate(
                            item
                          )
                        }
                        className="p-2 rounded-lg hover:bg-dark-700/50 text-slate-400"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleCopy(
                            item.output
                          )
                        }
                        className="p-2 rounded-lg hover:bg-dark-700/50 text-slate-400"
                      >
                        <Clipboard className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          exportTXT(item)
                        }
                        className="p-2 rounded-lg hover:bg-dark-700/50 text-slate-400"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="p-2 rounded-lg hover:bg-red-950/30 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>

              </motion.div>
            );
          }
        )}

      </div>

      {/* MODAL */}
      <AnimatePresence>

        {selectedItem && (
          <>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() =>
                setSelectedItem(null)
              }
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-3xl glass-card p-6 z-50 border border-dark-700/50"
            >

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold text-white">
                  {selectedItem.prompt.topic ||
                    selectedItem.prompt
                      .title ||
                    selectedItem.prompt
                      .subject}
                </h2>

                <button
                  onClick={() =>
                    setSelectedItem(null)
                  }
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>

              </div>

              <div className="bg-dark-950/40 rounded-xl border border-dark-700/50 p-5 max-h-[60vh] overflow-y-auto prose prose-invert max-w-none">

                <ReactMarkdown>
                  {selectedItem.output}
                </ReactMarkdown>

              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">

                <button
                  onClick={() =>
                    handleCopy(
                      selectedItem.output
                    )
                  }
                  className="btn-premium-cyan py-2 px-4 text-xs font-bold"
                >
                  Copy
                </button>

                <button
                  onClick={() =>
                    exportTXT(selectedItem)
                  }
                  className="btn-premium-cyan py-2 px-4 text-xs font-bold"
                >
                  TXT
                </button>

                <button
                  onClick={() =>
                    exportMD(selectedItem)
                  }
                  className="btn-premium-cyan py-2 px-4 text-xs font-bold"
                >
                  Markdown
                </button>

                <button
                  onClick={() =>
                    handleRegenerate(
                      selectedItem
                    )
                  }
                  className="btn-premium-cyan py-2 px-4 text-xs font-bold"
                >
                  Regenerate
                </button>

              </div>

            </motion.div>

          </>
        )}

      </AnimatePresence>
<AnimatePresence>

  {deleteModal.open && (

    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="
        fixed
        inset-0
        z-[100]
        bg-black/70
        backdrop-blur-md
        flex
        items-center
        justify-center
        p-4
      "
    >

      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0,
          y: 30,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
        }}
        exit={{
          scale: 0.8,
          opacity: 0,
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 200,
        }}
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          border
          border-red-500/20
          bg-[#071120]/95
          backdrop-blur-2xl
          p-8
          shadow-2xl
          shadow-red-500/10
          overflow-hidden
        "
      >

        {/* GLOW */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-red-500/5
            to-transparent
            pointer-events-none
          "
        />

        {/* ICON */}
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-red-500/10
            border
            border-red-500/20
            flex
            items-center
            justify-center
            mb-6
          "
        >
          <Trash2
            className="
              w-8
              h-8
              text-red-400
            "
          />
        </div>

        {/* TITLE */}
        <h2
          className="
            text-2xl
            font-bold
            text-white
            mb-3
          "
        >
          Confirm Delete
        </h2>

        {/* TEXT */}
        <p
          className="
            text-slate-400
            leading-relaxed
            mb-8
          "
        >
          {deleteModal.type === 'single'
            ? 'Are you sure you want to permanently delete this history item?'
            : 'Are you sure you want to permanently delete ALL history items?'}
        </p>

        {/* BUTTONS */}
        <div
          className="
            flex
            items-center
            justify-end
            gap-4
          "
        >

          <button
            onClick={() =>
              setDeleteModal({
                open: false,
                id: null,
                type: 'single',
              })
            }
            className="
              px-5
              py-3
              rounded-xl
              border
              border-dark-700
              bg-dark-900/80
              text-slate-300
              hover:bg-dark-800
              transition-all
            "
          >
            Cancel
          </button>

          <button
            onClick={confirmDelete}
            className="
              px-5
              py-3
              rounded-xl
              bg-gradient-to-r
              from-red-500
              to-red-600
              text-white
              font-semibold
              shadow-lg
              shadow-red-500/20
              hover:scale-105
              transition-all
            "
          >
            Delete
          </button>

        </div>

      </motion.div>

    </motion.div>
  )}

</AnimatePresence>
    </div>
  );
};

export default HistoryPage;