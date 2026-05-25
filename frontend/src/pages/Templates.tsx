import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import TemplateCard from "../components/TemplateCard";
import { templatesList } from "../data/templates";

const filters = [
  "All",
  "Favorites",
  "Captions",
  "Blogs",
  "Notes",
];

const Templates: React.FC = () => {
  const navigate = useNavigate();

  // ACTIVE FILTER
  const [activeFilter, setActiveFilter] =
    useState("All");

  // SEARCH
  const [searchTerm, setSearchTerm] =
    useState("");

  // FAVORITES
  const [favorites, setFavorites] = useState<number[]>(
    JSON.parse(
      localStorage.getItem("favoriteTemplates") ||
        "[]"
    )
  );

  // USAGE COUNTS
  const [usageCounts, setUsageCounts] =
    useState<Record<number, number>>(
      JSON.parse(
        localStorage.getItem(
          "templateUsageCounts"
        ) || "{}"
      )
    );

  // FILTERED TEMPLATES
  const filteredTemplates = useMemo(() => {
    let filtered = templatesList;

    // FAVORITES FILTER
    if (activeFilter === "Favorites") {
      filtered = filtered.filter((tpl) =>
        favorites.includes(tpl.id)
      );
    }

    // CATEGORY FILTER
    else if (activeFilter !== "All") {
      filtered = filtered.filter(
        (tpl) => tpl.category === activeFilter
      );
    }

    // SEARCH FILTER
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (tpl) =>
          tpl.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          tpl.desc
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, favorites, searchTerm]);

  // TEMPLATE LAUNCH
  const handleLaunch = (
    id: number,
    tool: string,
    params: string
  ) => {

    // UPDATE USAGE COUNTS
    const updatedUsage = {
      ...usageCounts,
      [id]: (usageCounts[id] || 0) + 1,
    };

    setUsageCounts(updatedUsage);

    localStorage.setItem(
      "templateUsageCounts",
      JSON.stringify(updatedUsage)
    );

    // NAVIGATE
    navigate(`/${tool}?${params}`);
  };

  // FAVORITE TOGGLE
  const toggleFavorite = (id: number) => {
    let updated = [...favorites];

    if (updated.includes(id)) {
      updated = updated.filter(
        (fav) => fav !== id
      );
    } else {
      updated.push(id);
    }

    setFavorites(updated);

    localStorage.setItem(
      "favoriteTemplates",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold Outfit text-slate-200">
          Creative Templates
        </h3>

        <p className="text-sm text-slate-500">
          Launch premium presets to instantly
          populate generator forms
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            w-4
            h-4
            text-slate-500
          "
        />

        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="
            w-full
            pl-11
            pr-4
            py-3
            rounded-2xl
            bg-dark-900
            border
            border-dark-700
            text-slate-200
            placeholder:text-slate-500
            focus:outline-none
            focus:border-cyan-400
            transition-all
          "
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setActiveFilter(filter)
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeFilter === filter
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-dark-900 border-dark-700 text-slate-400 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredTemplates.length === 0 && (
        <div
          className="
            glass-card
            border
            border-dark-700
            rounded-3xl
            p-10
            text-center
          "
        >
          <h4 className="text-lg font-bold text-slate-300 mb-2">
            No Templates Found
          </h4>

          <p className="text-sm text-slate-500">
            Try changing filters or search terms.
          </p>
        </div>
      )}

      {/* GRID */}
      {filteredTemplates.length > 0 && (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {filteredTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              tpl={tpl}
              usageCount={
                usageCounts[tpl.id] || 0
              }
              isFavorite={favorites.includes(
                tpl.id
              )}
              onFavorite={toggleFavorite}
              onLaunch={() =>
                handleLaunch(
                  tpl.id,
                  tpl.tool,
                  tpl.params
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;