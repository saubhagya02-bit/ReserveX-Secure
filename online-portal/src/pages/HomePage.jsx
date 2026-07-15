import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TicketIcon,
  BuildingStorefrontIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  PlusIcon,
  UserIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import { getMyReservations, updateReservationGenres } from "../services/reservation.service"
import toast from "react-hot-toast";
import GenreModal from "../components/GenreModal";

const HomePage = () => {
  const navigate = useNavigate();

  const { user, refreshUser } = useContext(AuthContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState(null); // Which reservation are we editing?
  const [saving, setSaving] = useState(false);



  useEffect(() => {
    loadDashboard()
    console.log(user)
  }, [])

  const loadDashboard = async () => {
    try {
      // Refresh user data to get latest booking count
      await refreshUser();
      
      const data = await getMyReservations();
      setReservations(data);
      console.log(data)
    } catch (error) {
      console.log(error)
      toast.error(error || "Failed to load reservations");
    } finally {
      setLoadingData(false);
    }
  };

  const handleEditClick = (reservation, stall) => {
    setEditingRes({ ...reservation, currentStall: stall });
    setModalOpen(true);
  };

  const handleSaveGenres = async (reservationId, payloadArray) => {
    setSaving(true);
    try {
      // Send the structured array to the backend
      const response = await updateReservationGenres(payloadArray);


      const flatGenres = [...new Set(payloadArray.flatMap(p => p.genres))];

      setReservations(prev => prev.map(res =>
        res.id === reservationId
          ? {
            ...res,
            stalls: res.stalls.map(s => ({
              ...s,
              genres: payloadArray.find(p => p.stallId === s.id)?.genres || []
            }))
          }
          : res
      ));

      toast.success(response.message || "Genres updated successfully!");
      setModalOpen(false);

    } catch (error) {
      console.error(error);
      toast.error(error || "Failed to save genres");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO SECTION START */}
      <div className="relative bg-slate-900 text-white overflow-hidden">

        <div
          className="absolute inset-0 z-0 opacity-100 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-blue-900/80"></div>


        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">


          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-700/50 pb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 border border-blue-500/30">
                Official Vendor Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                Colombo International Book Fair
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Organized by the <span className="text-white font-medium">Sri Lanka Book Publishers’ Association</span>.
                The largest exhibition in Sri Lanka, connecting millions of readers with publishers like you.
              </p>
            </div>


            {/* <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition border border-white/10">
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  Floor Plan.pdf
               </button>
            </div> */}
          </div>


          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Signed in as</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-none">{user?.businessName}</h2>
                  <p className="text-xs text-blue-300 mt-1 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                    Account Active
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/stallMap")}
              className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95"
            >
              <PlusIcon className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              New Reservation
            </button>
          </div>

        </div>
      </div>

      {/* 2. DASHBOARD CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Stalls Booked</p>
                <h3 className="text-3xl font-bold text-slate-800">
                  {user?.noOfCurrentBookings ?? 0} <span className="text-lg text-slate-400 font-medium">/ 3</span>
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <TicketIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2 overflow-hidden border border-slate-200/50">
              <div
                className={`h-2.5 rounded-full transition-all duration-700 ${(user?.noOfCurrentBookings ?? 0) >= 3 ? 'bg-amber-500' : 'bg-blue-600'}`}
                style={{ width: `${Math.min(((user?.noOfCurrentBookings ?? 0) / 3) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {(user?.noOfCurrentBookings ?? 0) >= 3
                ? <span className="text-amber-600">Maximum quota reached</span>
                : `${3 - (user?.noOfCurrentBookings ?? 0)} more slots available`}
            </p>
          </div>
          <StatCard
            title="Total Stalls (Lifetime)"
            value="3"
            icon={<BuildingStorefrontIcon className="w-6 h-6 text-emerald-600" />}
            bg="bg-emerald-50"
          />
          <StatCard
            title="Approved Reservations"
            value={reservations.filter(res => res.status?.toUpperCase() === "APPROVED").length}
            icon={<BookOpenIcon className="w-6 h-6 text-purple-600" />}
            bg="bg-purple-50"
          />
        </div>



        <div className="max-w-7xl mx-auto px-6 py-8 -mt-8 relative z-20">

          {/* Reservation Table Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-6">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-lg">Your Reservations & Genres</h3>
            </div>

            {reservations.length === 0 && !loadingData ? (
              //EMPTY STATE UI
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                  <TicketIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No reservations yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  You haven't booked any stalls for the upcoming book fair. Secure your spot now!
                </p>
                <button
                  onClick={() => navigate("/stallMap")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  Book a Stall
                </button>
              </div>)
              : (<div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-8 py-4 font-semibold text-slate-600">Res ID</th>
                      <th className="px-8 py-4 font-semibold text-slate-600">Stall</th>
                      <th className="px-8 py-4 font-semibold text-slate-600">Status</th>
                      <th className="px-8 py-4 font-semibold text-slate-600">Genres Displayed</th>
                      <th className="px-8 py-4 font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reservations.flatMap((res) =>
                      res.stalls?.map((stall) => (
                        <tr key={`${res.id}-${stall.id}`} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-6 font-mono text-slate-900 font-bold text-base">#{res.id}</td>

                          <td className="px-8 py-6">
                            <span className="font-semibold text-slate-800 text-base">{stall.name}</span>
                            <span className="text-sm text-slate-400 ml-2 font-medium">({stall.size})</span>
                          </td>

                          <td className="px-8 py-6">
                            <span className={`px-2 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider border ${res.status?.toUpperCase() === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : res.status?.toUpperCase() === 'REJECTED'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                              {res.status}
                            </span>
                          </td>

                          <td className="px-8 py-6">
                            <div className="flex flex-wrap gap-2">
                              {(() => {
                                const allGenres = [...new Set((stall.genres || []))];
                                return allGenres.length > 0 ? (
                                  <>
                                    {allGenres.slice(0, 3).map(g => (
                                      <span key={g} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100 shadow-sm">
                                        {g}
                                      </span>
                                    ))}
                                    {allGenres.length > 3 && (
                                      <span className="text-slate-400 pl-1">+{allGenres.length - 3} more</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-slate-400 italic text-sm">No genres added</span>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => handleEditClick(res, stall)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all ml-auto focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                              Select Genres
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>)}
          </div>

        </div>

      </div>

      <GenreModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveGenres}
        reservation={editingRes}
        isLoading={saving}
      />

    </div>
  );
};

//SUB-COMPONENTS

const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg} bg-opacity-50`}>
      {icon}
    </div>
  </div>
);




export default HomePage;