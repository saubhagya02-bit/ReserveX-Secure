import React, { useState, useEffect } from "react";
import { getAllGenres } from "../services/genre.service";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const GenreModal = ({ isOpen, onClose, onSave, reservation, isSaving }) => {
  const [availableGenres, setAvailableGenres] = useState([]);
  // Keeps track of genres per stall: { 1: ["Sci-Fi", "Fantasy"], 2: ["Educational"] }
  const [stallGenres, setStallGenres] = useState({});
  const [isLoadingGenres, setIsLoadingGenres] = useState(true);

  useEffect(() => {
    if (isOpen && reservation) {
      loadGenres();
      const initialState = {};
      reservation.stalls?.forEach((stall) => {
        initialState[stall.id] = stall.genres || [];
      });
      setStallGenres(initialState);
    }
  }, [isOpen, reservation]);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const genres = await getAllGenres();
      setAvailableGenres(genres);
    } catch (error) {
      toast.error(error || "Could not load genre list");
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const toggleGenre = (stallId, genreName) => {
    setStallGenres((prev) => {
      const currentSelected = prev[stallId] || [];
      if (currentSelected.includes(genreName)) {
        return {
          ...prev,
          [stallId]: currentSelected.filter((g) => g !== genreName),
        };
      } else {
        return { ...prev, [stallId]: [...currentSelected, genreName] };
      }
    });
  };

  const handleSaveClick = () => {
    // Converts state into the exact StallGenreRequest DTO array the backend expects
    const payload = Object.keys(stallGenres).map((stallId) => ({
      stallId: parseInt(stallId),
      genres: stallGenres[stallId],
    }));
    onSave(reservation.id, payload);
  };

  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-slate-800">Manage Genres</h3>
            <p className="text-xs text-slate-500">
              Reservation #{reservation.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoadingGenres ? (
            <p className="text-slate-500 text-sm">Loading genres...</p>
          ) : (
            <div className="space-y-6">
              {reservation.stalls?.map((stall) => (
                <div
                  key={stall.id}
                  className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                >
                  <h4 className="font-semibold text-blue-700 mb-2 border-b border-blue-100 pb-2">
                    Stall: {stall.name}{" "}
                    <span className="text-xs text-slate-400 font-normal ml-2">
                      ({stall.size})
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {availableGenres.map((g) => {
                      const isSelected = stallGenres[stall.id]?.includes(
                        g.name,
                      );
                      return (
                        <button
                          key={`${stall.id}-${g.id}`}
                          onClick={() => toggleGenre(stall.id, g.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50"}`}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg shadow-sm disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreModal;
