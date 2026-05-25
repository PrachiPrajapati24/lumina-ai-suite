import React from "react";
import {
  ArrowRight,
  Star,
  BarChart3,
} from "lucide-react";

interface TemplateCardProps {
  tpl: any;

  usageCount: number;

  isFavorite: boolean;

  onFavorite: (id: number) => void;

  onLaunch: () => void;
}

const TemplateCard: React.FC<
  TemplateCardProps
> = ({
  tpl,
  usageCount,
  isFavorite,
  onFavorite,
  onLaunch,
}) => {

  const Icon = tpl.icon;

  return (
    <div
      onClick={onLaunch}
      className={`
        glass-card
        p-6
        border
        flex
        flex-col
        justify-between
        min-h-[300px]
        cursor-pointer
        transition-all
        duration-200
        group
        relative
        hover:scale-[1.02]
        ${tpl.color}
      `}
    >

      {/* TOP SECTION */}
      <div className="space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          {/* ICON */}
          <span
            className="
              p-2
              rounded-lg
              bg-dark-950/40
              border
              border-dark-700/50
            "
          >
            <Icon className="w-4 h-4" />
          </span>

          {/* BADGES */}
          <div className="flex items-center gap-2">

            {/* TRENDING */}
            {tpl.popular && (
              <span
                className="
                  text-[9px]
                  px-2
                  py-1
                  rounded-full
                  bg-orange-500/20
                  text-orange-300
                  uppercase
                  font-bold
                "
              >
                Trending
              </span>
            )}

            {/* FAVORITE */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                onFavorite(tpl.id);
              }}
              className="
                text-slate-500
                hover:text-yellow-300
                transition-colors
              "
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite
                    ? "fill-yellow-300 text-yellow-300"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex items-center gap-2">
          <span
            className="
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            {tpl.category}
          </span>
        </div>

        {/* TITLE */}
        <h4
          className="
            text-base
            font-extrabold
            Outfit
            text-slate-200
            group-hover:text-white
            transition-colors
          "
        >
          {tpl.title}
        </h4>

        {/* DESCRIPTION */}
        <p
          className="
            text-xs
            text-slate-400
            leading-relaxed
            line-clamp-3
          "
        >
          {tpl.desc}
        </p>

        {/* USAGE COUNT */}
        <div
          className="
            flex
            items-center
            gap-2
            text-[11px]
            text-slate-500
            font-medium
          "
        >
          <BarChart3 className="w-3.5 h-3.5" />

          <span>
            Used {usageCount} time
            {usageCount !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      {/* BOTTOM */}
      <div
        className="
          flex
          items-center
          gap-1
          text-[11px]
          font-bold
          uppercase
          tracking-wider
          text-slate-400
          group-hover:text-slate-100
          transition-colors
          mt-4
        "
      >
        <span>Launch Template</span>

        <ArrowRight
          className="
            w-3.5
            h-3.5
            group-hover:translate-x-1
            transition-transform
          "
        />
      </div>

    </div>
  );
};

export default TemplateCard;