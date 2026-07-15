import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  MapPinIcon,
  CheckBadgeIcon,
  BookOpenIcon
} from "@heroicons/react/24/outline";
import BookingSummary from "../components/BookingSummary";
import StallTooltip from "../components/StallTooltip";
import StallGrid from "../components/StallGrid";
import { getAllStalls } from "../services/stall.service";
import toast from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import ReservationModal from "../components/ReservationModal";
import { createReservation } from "../services/reservation.service";
import { useNavigate } from "react-router-dom";

const StallMap = () => {

  const { user, login } = useContext(AuthContext);
  const [stalls, setStalls] = useState([]);
  const [selectedStalls, setSelectedStalls] = useState([]);
  const [hoveredStall, setHoveredStall] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL"); // "ALL", "AVAILABLE", "SMALL", "MEDIUM", "LARGE"
  const navigate = useNavigate()

  const existingBookings = user?.noOfCurrentBookings || 0;
  const REMAINING_QUOTA = 3 - existingBookings;

  const fetchStalls = async () => {
    try {
      setIsLoading(true);
      const data = await getAllStalls();
      setStalls(data);

    } catch (errorMessage) {
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const handleConfirmReservation = async () => {
    setIsReserving(true);
    try {

      const response = await createReservation(selectedStalls);

      toast.success(response.message || "Reservation Confirmed! QR Code sent to email.");

      setSelectedStalls([]);
      setIsModalOpen(false);
      fetchStalls();

      //increment it manually in the frontend context to be fast
      const updatedUser = {
        ...user,
        noOfCurrentBookings: (user.noOfCurrentBookings || 0) + selectedStalls.length
      };
      login(updatedUser, localStorage.getItem("token"));
      navigate("/home")

    } catch (error) {
      toast.error(error || "Reservation Failed. Please try again.");
    } finally {
      setIsReserving(false);
    }

  }



  // const loadData=()=>{
  //   setStalls(mockStalls)
  //   console.log(mockStalls)
  //   setIsLoading(false);
  // }

  useEffect(() => {
    fetchStalls()
  }, [])

  const totalRows = useMemo(() => {
    if (stalls.length === 0) return 10; // Default minimum
    const maxY = Math.max(...stalls.map((s) => s.gridCol));
    return maxY + 1;
  }, [stalls]);

  const stats = useMemo(() => {
    const total = stalls.length
    const reserved = stalls.filter(s => s.Confirmed === true).length;
    const available = total - reserved;
    return { total, available, reserved };
  }, [stalls]);



  //SELECTION LOGIC
  const handleStallClick = (stall) => {

    if (stall.Confirmed === true) return;

    const isSelected = selectedStalls.some((s) => s.id === stall.id);

    if (isSelected) {
      setSelectedStalls(selectedStalls.filter((s) => s.id !== stall.id));

    } else {
      // Check stall limits (3 per one user)
      if (selectedStalls.length >= 3) {
        toast.error("You can only select up to 3 stalls per reservation.");
        return;
      }

      if (selectedStalls.length >= REMAINING_QUOTA) {
        if (REMAINING_QUOTA <= 0) {
          toast.error("You have reached the maximum limit of 3 active reservations.");
        } else {
          toast.error(`You have ${existingBookings} active reservations. You can only select ${REMAINING_QUOTA} more stalls.`);
        }
        return;
      }
      setSelectedStalls([...selectedStalls, stall]);
    }
  };


  // Desktop Mouse Handlers-----------
  const handleMouseEnter = (stall, e) => {
    setHoveredStall(stall);
    moveCursor(e);
  };

  const handleMouseMove = (e) => { if (hoveredStall) moveCursor(e); };

  const handleMouseLeave = () => { setHoveredStall(null); };

  const moveCursor = (e) => {
    // Offset by 15px - the tooltip doesn't block the mouse
    setCursorPos({ x: e.clientX + 15, y: e.clientY + 15 });
  };
  //-------------------------------------------


  const handleReserve = () => {
    setIsModalOpen(true); //open pop up
  };



  return (
    <div className="flex flex-col item-center min-h-screen bg-gray-10 p-10 lg:py-5">


      {/* --- COMPACT, LIGHT HEADER --- */}
      <div className="w-full max-w-5xl mx-auto mb-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        {/* Title & Subtitle */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-blue-600" />
            Stall Reservation Map
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Tap up to 3 green stalls to secure your spots for the book fair.
          </p>
        </div>

        {/* Compact Stats Badges */}
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">

          <div className="flex-1 md:flex-none flex flex-col items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Total</span>
            <span className="font-bold text-slate-700 leading-none mt-1">{stats.total}</span>
          </div>

          <div className="flex-1 md:flex-none flex flex-col items-center px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
            <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">Available</span>
            <span className="font-bold text-emerald-700 leading-none mt-1">{stats.available}</span>
          </div>

          <div className="flex-1 md:flex-none flex flex-col items-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">Reserved</span>
            <span className="font-bold text-slate-500 leading-none mt-1">{stats.reserved}</span>
          </div>

        </div>
      </div>

      {/* map */}

      <div className="lg:flex lg:flex-col lg:justify-center items-center h-full">
        <div className="overflow-auto mb-6 p-5 max-w-5xl w-full max-h-[70vh] h-full border border-slate-200 rounded-lg bg-white">

          {/* --- QUICK FILTERS --- */}
          <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-50 border border-slate-100 rounded-lg">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center px-2">Filter</span>
            <button onClick={() => setActiveFilter("ALL")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === "ALL" ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>All</button>
            <button onClick={() => setActiveFilter("AVAILABLE")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === "AVAILABLE" ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200" : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50"}`}>Available</button>
            <button onClick={() => setActiveFilter("SMALL")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === "SMALL" ? "bg-blue-600 text-white shadow-sm shadow-blue-200" : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"}`}>Small</button>
            <button onClick={() => setActiveFilter("MEDIUM")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === "MEDIUM" ? "bg-purple-600 text-white shadow-sm shadow-purple-200" : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"}`}>Medium</button>
            <button onClick={() => setActiveFilter("LARGE")} className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${activeFilter === "LARGE" ? "bg-orange-600 text-white shadow-sm shadow-orange-200" : "bg-white text-orange-700 border border-orange-200 hover:bg-orange-50"}`}>Large</button>
          </div>

          {/* --- NEW COMPONENT: STALL GRID --- */}
          <StallGrid
            stalls={stalls}
            isLoading={isLoading}
            totalRows={totalRows}
            selectedStalls={selectedStalls}
            handleStallClick={handleStallClick}
            handleMouseEnter={handleMouseEnter}
            handleMouseMove={handleMouseMove}
            handleMouseLeave={handleMouseLeave}
            setHoveredStall={setHoveredStall}
            activeFilter={activeFilter}
          />

        </div>
      </div>


      {/* legend */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 p-4 bg-gray-50 rounded-lg">

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-100 border border-emerald-300"></div>
          <span className="text-slate-600 text-sm">Available</span>
        </div>


        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-100 border border-slate-200"></div>
          <span className="text-slate-600 text-sm">Reserved</span>
        </div>


        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500 border border-blue-600 shadow-sm"></div>
          <span className="text-slate-600 text-sm">Selected</span>
        </div>
      </div>


      {/*Instructions*/}

      <div className="max-w-5xl mx-auto w-full mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <h4 className="text-slate-800 font-extrabold text-lg text-center mb-8 relative z-10">
          How to Setup Your Book Fair Presence
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <MapPinIcon className="w-7 h-7" />
            </div>
            <h5 className="font-bold text-slate-800 mb-2">1. Pick Your Spots</h5>
            <p className="text-sm text-slate-500 leading-relaxed px-4">
              Tap the <span className="text-emerald-600 font-semibold">green available stalls</span> on the map. You can select up to a maximum of 3 stalls for your business.
            </p>
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-slate-200"></div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <CheckBadgeIcon className="w-7 h-7" />
            </div>
            <h5 className="font-bold text-slate-800 mb-2">2. Secure Reservation</h5>
            <p className="text-sm text-slate-500 leading-relaxed px-4">
              Review your total cost and click reserve. You will receive an official QR code receipt via email.
            </p>
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] border-t-2 border-dashed border-slate-200"></div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <BookOpenIcon className="w-7 h-7" />
            </div>
            <h5 className="font-bold text-slate-800 mb-2">3. Assign Genres</h5>
            <p className="text-sm text-slate-500 leading-relaxed px-4">
              Head over to your <span className="text-blue-600 font-semibold">Vendor Dashboard</span> to assign specific book genres (like Sci-Fi or Romance) to each individual stall!
            </p>
          </div>

        </div>
      </div>

      {/* summery */}
      <BookingSummary
        selectedStalls={selectedStalls}
        onReserve={handleReserve}
        quota={REMAINING_QUOTA}
      />

      {/* description- float when hover */}
      <StallTooltip stall={hoveredStall} position={cursorPos} />


      {/* {confirmation box when reserve} */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReservation}
        selectedStalls={selectedStalls}
        isLoading={isReserving}
      />



    </div>
  );
};

export default StallMap;
