import * as React from "react";
import TableViewIcon from "@/assets/TableViewIcon";
import GridViewIcon from "@/assets/GridViewIcon";

interface ViewSwitchProps {
  view: "table" | "grid";
  onChange: (view: "table" | "grid") => void;
}

const ICON_SIZE = 24;
const HIGHLIGHT_SIZE = 40;
const SWITCH_WIDTH = 96;
const SWITCH_HEIGHT = 44;

const ViewSwitch: React.FC<ViewSwitchProps> = ({ view, onChange }) => {
  // Calculate the left position for the highlight
  const highlightLeft = view === "table" ? 4 : SWITCH_WIDTH / 2 + 4;

  return (
    <div
      className="relative flex items-center bg-gray-100 rounded-full"
      style={{ width: SWITCH_WIDTH, height: SWITCH_HEIGHT }}
    >
      {/* Highlight circle */}
      <div
        className="absolute top-1/2 transition-all duration-100"
        style={{
          width: HIGHLIGHT_SIZE,
          height: HIGHLIGHT_SIZE,
          borderRadius: "50%",
          border: "3px solid #e5e7eb",
          background: "#fff",
          left: highlightLeft,
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      />
      {/* Table icon button */}
      {/* accessibility: aria-label for screen readers, button is focusable with tabIndex */}
      <button
        type="button"
        aria-label="Table view"
        onClick={() => onChange("table")}
        className="flex items-center justify-center relative z-10 cursor-pointer"
        style={{ width: SWITCH_WIDTH / 2, height: SWITCH_HEIGHT }}
        tabIndex={0}
      >
        <span className="flex items-center justify-center w-full h-full">
          <TableViewIcon width={ICON_SIZE} height={ICON_SIZE} />
        </span>
      </button>
      {/* Grid icon button */}
      {/* accessibility: aria-label for screen readers, button is focusable with tabIndex */}
      <button
        type="button"
        aria-label="Grid view"
        onClick={() => onChange("grid")}
        className="flex items-center justify-center relative z-10 cursor-pointer"
        style={{ width: SWITCH_WIDTH / 2, height: SWITCH_HEIGHT }}
        tabIndex={0}
      >
        <span className="flex items-center justify-center w-full h-full">
          <GridViewIcon width={ICON_SIZE} height={ICON_SIZE} />
        </span>
      </button>
    </div>
  );
};

export default ViewSwitch;
