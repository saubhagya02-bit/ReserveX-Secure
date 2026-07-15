import React from "react";

const StallTooltip = ({ stall, position }) => {
  if (!stall) return null;

  return (
    <div
      className="fixed z-50 animate-fade-in pointer-events-none"
      style={{
        // Desktop - Use cursor coordinates
        left: position.x,
        top: position.y,
      }}
    >

      <div className="
        fixed top-24 left-4 right-4 md:static md:w-64
        bg-white/95 backdrop-blur-md text-slate-800 p-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/80
        flex flex-col gap-3
      ">

        {/* Header Section */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-bold text-blue-600 flex items-center gap-2">
              Stall {stall.id}
            </h4>
            <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase tracking-wide border border-slate-200 mt-1 inline-block">
              {stall.size} Size
            </span>
          </div>
          <div className="text-right">
            <span className="block font-black text-slate-900 text-lg">
              Rs.{stall.price}
            </span>
            {stall.Confirmed === true ? (
              <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase border border-red-100 inline-block mt-1">Reserved</span>
            ) : (
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-100 inline-block mt-1">Available</span>
            )}
          </div>
        </div>

        {/* Body Section */}
        <div className="text-sm">
          <p className="text-sm leading-relaxed text-slate-600 font-medium">
            "{stall?.description || "Standard exhibition stall space with standard amenities."}"
          </p>
        </div>

        {/* Footer (Mobile Only) */}
        <div className="md:hidden pt-2 mt-1 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center font-medium">
            Tap to select this stall
          </p>
        </div>

      </div>
    </div>
  );
};

export default StallTooltip;