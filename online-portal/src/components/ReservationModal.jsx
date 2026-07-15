import React from "react";
import {
  ShieldCheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const ReservationModal = ({ isOpen, onClose, onConfirm, selectedStalls, isLoading }) => {
  if (!isOpen) return null;

  // Calculate Total
  const totalPrice = selectedStalls.reduce((sum, stall) => sum + stall.price, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">

      {/* 1. Backdrop (Blurry & Dark) */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>


      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up">


        {/* Close Button (Top Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="w-7 h-7 font-bold" />
        </button>

        <div className="p-8">

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Review Your Reservation</h2>
            <p className="text-slate-500 text-sm mt-1">
              Please double-check your selected stalls before confirming.
            </p>
          </div>

          {/* Stall List Container */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 mb-8">

            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
              <span>Stall Details</span>
              <span>Amount</span>
            </div>

            <div className="space-y-3 mb-5">
              {selectedStalls.map((stall) => (
                <div key={stall.id} className="flex justify-between items-start bg-white p-4 rounded-xl border border-slate-200/60 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
                  <div className="flex items-start gap-4">
                    {/* ID Badge */}
                    <div className="w-10 h-10 rounded-lg bg-blue-50/80 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0 border border-blue-100/50">
                      {stall?.name}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-none mb-1.5">{stall.name} <span className="font-normal text-slate-400">({stall.size})</span></p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed max-w-[200px]">{stall?.description || "Standard exhibition space."}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 mt-0.5">
                    <span className="font-bold text-slate-800 text-sm">
                      Rs. {stall.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Line */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 border-dashed">
              <span className="font-bold text-slate-700">Total Investment</span>
              <span className="font-bold text-blue-600 text-xl">
                Rs. {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>


          {/* Footer Note */}
          <div className="flex gap-2 text-sm text-slate-400 mb-8 bg-blue-50/50 p-3 rounded-lg">
            <InformationCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
            <p>
              By confirming, you agree to the Exhibitor Terms & Conditions. An invoice with QR Code will be sent to your email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition text-sm"
            >
              Modify Selection
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2 text-sm"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>Confirm & Reserve</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationModal;