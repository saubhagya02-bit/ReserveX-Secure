import React from "react";

const StallGrid = ({
  stalls,
  isLoading,
  totalRows,
  selectedStalls,
  handleStallClick,
  handleMouseEnter,
  handleMouseMove,
  handleMouseLeave,
  setHoveredStall,
  activeFilter
}) => {

  //LOADING STATE
  if (isLoading) {
    return (
      <div className="h-full min-h-100 flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium">Loading map...</p>
      </div>
    );
  }



  //EMPTY STATE
  if (!stalls || stalls.length === 0) {
    return (
      <div className="h-full min-h-100 flex flex-col items-center justify-center text-center">
        <p className="text-4xl mb-2">🛖</p>
        <h3 className="text-slate-600 font-bold text-lg">No Stalls Found</h3>
        <p className="text-slate-400 text-sm">Please check back later.</p>
      </div>
    );
  }

  // 3. YOUR EXACT GRID UI
  return (
    <div className="grid gap-2 min-w-max lg:gap-5 
        bg-slate-50 
        bg-[image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] 
        bg-[size:58px_58px] 
        lg:bg-[size:70px_70px] 
        border-t border-l border-slate-200"
      style={{
        gridAutoColumns: "50px",  // Width of 1 small block
        gridAutoRows: "50px",     // Height of 1 small block
        width: "max-content"      // Ensures the grid doesn't shrink
      }}
    >
      {/* ROW LABELS */}
      {Array.from({ length: totalRows }).map((_, index) => {
        const rowLetter = String.fromCharCode(65 + index);
        return (
          <div
            key={`row-label-${index}`}
            style={{
              gridColumnStart: 1,
              gridRowStart: index + 1,
            }}
            className="flex items-center justify-center font-bold text-slate-400 lg:text-lg"
          >
            {rowLetter}
          </div>
        );
      })}

      {/* STALL CARDS */}
      {stalls.map((stall) => {
        const isReserved = stall?.Confirmed === true;
        const isSelected = selectedStalls.some((s) => s.id === stall.id);

        let isDimmed = false;
        if (activeFilter === "AVAILABLE" && isReserved) isDimmed = true;
        if (activeFilter === "SMALL" && stall.size?.toUpperCase() !== "SMALL") isDimmed = true;
        if (activeFilter === "MEDIUM" && stall.size?.toUpperCase() !== "MEDIUM") isDimmed = true;
        if (activeFilter === "LARGE" && stall.size?.toUpperCase() !== "LARGE") isDimmed = true;

        return (
          <div
            key={stall.id}
            onClick={() => handleStallClick(stall)}
            onMouseEnter={(e) => handleMouseEnter(stall, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => setHoveredStall(stall)}
            style={{
              // Your exact mapping
              gridColumnStart: stall?.gridRow + 1,
              gridRowStart: stall?.gridCol
            }}
            className={`
              ${isReserved
                ? "bg-slate-200 text-slate-400 border-slate-500 border "
                : isSelected
                  ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-105 z-10"
                  : "bg-green-100 text-green-800 border border-green-400 hover:bg-green-500 hover:text-white cursor-pointer hover:shadow-md hover:scale-105"
              }
              ${isDimmed && !isSelected ? "opacity-20 grayscale pointer-events-none" : "opacity-100"}
              w-full h-full rounded-lg
              flex flex-col items-center justify-center text-xs font-bold transition-all shadow-sm duration-300`
            }
          >
            <span className="font-bold text-sm md:text-base leading-none mb-1">{stall.name}</span>
            <span className="opacity-80 uppercase font-normal">{stall.size}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StallGrid;