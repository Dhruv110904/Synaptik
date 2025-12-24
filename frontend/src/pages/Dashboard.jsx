import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import CreateRoomDialog from "../components/CreateRoomDialog";
import NewDMDialog from "../components/NewDMDialog";
import EditProfileDialog from "../components/EditProfileDialog";
import ChangeBackgroundDialog from "../components/ChangeBackgroundDialog"; 

import {
  Plus,
  LogOut,
  Settings,
  MessageCircle,
  Search,
  User,
  MoreVertical,      // Menu Icon
  Image as ImageIcon, // Background Icon
  PlusCircle,
  MessageSquarePlus
} from "lucide-react";
import RoomView from "./RoomView";
import DMView from "./DMView";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

export default function Dashboard() {
  const { user, logout, login } = useAuth();
  const [rooms, setRooms] = useState([]);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [openCreate, setOpenCreate] = useState(false);
  const [openNewDM, setOpenNewDM] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openBackground, setOpenBackground] = useState(false); // Background Dialog

  const [activeTab, setActiveTab] = useState("rooms");
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Menu Toggle
  const [dms, setDms] = useState([]);

  // --- BACKGROUND STATE ---
  const [currentBg, setCurrentBg] = useState(() => {
    return localStorage.getItem("chat_background") || "";
  });

  const handleApplyBackground = (bgUrl) => {
    setCurrentBg(bgUrl);
    localStorage.setItem("chat_background", bgUrl);
    setOpenBackground(false); 
  };
  // ------------------------

  useEffect(() => {
    if (activeTab === "dms") {
      API.get("/api/dms").then(res => setDms(res.data));
    }
  }, [activeTab]);

  const handleCreateRoom = async (roomData) => {
    try {
      const { data } = await API.post("/api/rooms", roomData);
      setRooms((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("Create room failed", err);
      return null;
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (updatedData) => {
    try {
      const { data: updatedUser } = await API.put("/api/users/profile", updatedData);
      const token = localStorage.getItem("token"); 
      login({ token, user: updatedUser });
      return true;
    } catch (err) {
      console.error("Failed to update profile", err);
      return false;
    }
  };

  useEffect(() => {
    API.get("/api/rooms")
      .then((res) => {
        const publicRooms = res.data.public || [];
        const privateRooms = res.data.private || [];
        setRooms([...publicRooms, ...privateRooms]);
      })
      .catch(() => setRooms([]));
  }, []);

  // --- FILTER LOGIC ---
  const filteredRooms = rooms.filter(room => 
    room.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDms = dms.filter(dm => {
    const currentUserId = user.id || user._id;
    const otherUser = dm.participants?.find(p => p._id !== currentUserId) || dm.participants?.[0];
    return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle Tab Switch (Clear search on switch)
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowProfileMenu(false);
    if(showProfileMenu) window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <div className="h-screen flex overflow-hidden font-sans transition-colors duration-500
      bg-linear-to-br from-teal-50 via-white to-teal-100 
      dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950">

      {/* SIDEBAR (Width increased from w-80 to w-96) */}
      <aside className="w-96 flex flex-col p-4 shadow-sm z-10 border-r transition-all duration-300
        bg-white/80 backdrop-blur-xl border-teal-100 
        dark:bg-gray-900/80 dark:border-gray-800">

        {/* USER PROFILE CARD WITH MENU */}
        <div 
          className="relative flex items-center gap-3 p-3 mb-6 rounded-2xl border transition-colors
          bg-teal-50/50 border-teal-100/50 
          dark:bg-teal-900/10 dark:border-teal-500/10"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Avatar & Info (Clickable for Profile) */}
          <div className="flex-1 flex items-center gap-3 cursor-pointer group" onClick={() => setOpenProfile(true)}>
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-teal-200 dark:shadow-teal-900/20 transition-transform group-hover:scale-105">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-[2.5px] rounded-full
                border-white dark:border-gray-900"></span>
            </div>
            
            <div className="overflow-hidden">
              <h3 className="font-bold truncate transition-colors text-gray-800 dark:text-gray-100">
                {user?.displayName || user?.username}
              </h3>
              <p className="text-xs font-medium truncate transition-colors text-teal-600 dark:text-teal-400">
                @{user?.username}
              </p>
            </div>
          </div>

          {/* MENU TRIGGER */}
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-100/50 dark:hover:bg-teal-900/30 transition-all"
          >
            <MoreVertical size={20} />
          </button>

          {/* DROPDOWN MENU */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="p-1.5 space-y-0.5">
                <button 
                  onClick={() => { setOpenCreate(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <PlusCircle size={16} /> Create Room
                </button>
                <button 
                  onClick={() => { setOpenNewDM(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <MessageSquarePlus size={16} /> New DM
                </button>
                <button 
                  onClick={() => { setOpenBackground(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ImageIcon size={16} /> Change Background
                </button>
                <button 
                  onClick={() => { setOpenProfile(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-700 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Settings size={16} /> Settings
                </button>
                
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2" />
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="flex p-1.5 rounded-xl mb-4 transition-colors
          bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => switchTab("rooms")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "rooms"
                ? "bg-white text-teal-600 shadow-sm dark:bg-gray-700 dark:text-teal-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => switchTab("dms")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "dms"
                ? "bg-white text-teal-600 shadow-sm dark:bg-gray-700 dark:text-teal-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            DMs
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
            text-gray-400 dark:text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === "rooms" ? "Search rooms..." : "Search messages..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all border
              bg-white border-gray-200 focus:border-teal-500 placeholder:text-gray-400 text-gray-900
              dark:bg-gray-900 dark:border-gray-700 dark:focus:border-teal-400 dark:placeholder:text-gray-600 dark:text-gray-100"
          />
        </div>

        {/* CREATE ACTION */}
        <div className="px-1 mb-2">
          {activeTab === "rooms" && (
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 text-sm font-bold transition-colors px-2 py-1 rounded-lg w-full
                text-teal-600 hover:text-teal-700 hover:bg-teal-50 
                dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900/20"
            >
              <Plus size={16} strokeWidth={3} />
              Create Room
            </button>
          )}
          {activeTab === "dms" && (
            <button
              onClick={() => setOpenNewDM(true)}
              className="flex items-center gap-2 text-sm font-bold transition-colors px-2 py-1 rounded-lg w-full
                text-teal-600 hover:text-teal-700 hover:bg-teal-50 
                dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-900/20"
            >
              <Plus size={16} strokeWidth={3} />
              New Message
            </button>
          )}
        </div>

        {/* LIST AREA */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          
          {/* ROOMS LIST */}
          {activeTab === "rooms" && (
            filteredRooms.length ? filteredRooms.map(room => (
              <Link
                key={room._id}
                to={`/app/rooms/${room._id}`}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors group
                  hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-teal-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:shadow-md transition-all">
                  {room.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate transition-colors
                    text-gray-700 group-hover:text-gray-900 
                    dark:text-gray-300 dark:group-hover:text-white">
                    {room.name}
                  </p>
                  <p className="text-xs truncate transition-colors
                    text-gray-400 dark:text-gray-500">
                    {room.members?.length || 0} members
                  </p>
                </div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-sm
                text-gray-400 dark:text-gray-600">
                <MessageCircle size={32} className="mb-2 opacity-20" />
                <p>{searchQuery ? "No matching rooms" : "No rooms found"}</p>
              </div>
            )
          )}

          {/* DMs LIST */}
          {activeTab === "dms" && (
            filteredDms.length ? filteredDms.map(dm => {
              const currentUserId = user.id || user._id;
              const otherUser = dm.participants?.find(p => p._id !== currentUserId) || dm.participants?.[0]; 
              
              if (!otherUser) return null;

              return (
                <Link
                  key={dm._id}
                  to={`/app/dms/${dm._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors group
                    hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors
                      bg-gray-200 text-gray-600 group-hover:bg-gray-300 
                      dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-gray-600">
                      {otherUser.username?.[0]?.toUpperCase()}
                    </div>
                    {otherUser.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full shadow-sm border-2
                        border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate transition-colors
                      text-gray-700 group-hover:text-gray-900 
                      dark:text-gray-300 dark:group-hover:text-white">
                      {otherUser.username}
                    </p>
                    <p className="text-xs truncate transition-colors
                      text-gray-400 dark:text-gray-500">
                      @{otherUser.username}
                    </p>
                  </div>
                </Link>
              );
            }) : (
              <div className="flex flex-col items-center justify-center h-40 text-sm
                text-gray-400 dark:text-gray-600">
                <User size={32} className="mb-2 opacity-20" />
                <p>{searchQuery ? "No matching users" : "No messages yet"}</p>
              </div>
            )
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="pt-4 mt-2 border-t flex justify-between items-center px-2 transition-colors
          border-gray-100 dark:border-gray-800">
          
          {/* Settings opens profile */}
          <button 
            onClick={() => setOpenProfile(true)}
            className="p-2.5 rounded-xl transition-all
            text-gray-400 hover:bg-gray-50 hover:text-gray-600 
            dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all
              text-red-500 hover:bg-red-50 
              dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-full flex items-center justify-center p-6">
                <div className="rounded-[2rem] p-12 md:p-16 text-center shadow-xl max-w-lg w-full transform transition-all hover:scale-[1.01] border
                  bg-white shadow-teal-900/5 border-transparent
                  dark:bg-gray-900/80 dark:backdrop-blur-md dark:shadow-teal-900/20 dark:border-gray-800">
                  <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                    <MessageCircle size={40} fill="currentColor" className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 tracking-tight transition-colors
                    text-gray-800 dark:text-white">
                    Select a conversation
                  </h2>
                  <p className="text-lg leading-relaxed transition-colors
                    text-gray-500 dark:text-gray-400">
                    Choose a room from the sidebar or start a new
                    direct message to begin chatting with your community.
                  </p>
                </div>
              </div>
            }
          />
          {/* PASS THE BACKGROUND PROP */}
          <Route path="rooms/:roomId" element={<RoomView background={currentBg} />} />
          <Route path="dms/:dmId" element={<DMView background={currentBg} />} />
        </Routes>
      </main>

      {/* DIALOGS */}
      <CreateRoomDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreateRoom}
      />
      <NewDMDialog
        open={openNewDM}
        onClose={() => setOpenNewDM(false)}
      />
      <EditProfileDialog 
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={user}
        onUpdate={handleUpdateProfile}
      />
      <ChangeBackgroundDialog
        open={openBackground}
        onClose={() => setOpenBackground(false)}
        currentBg={currentBg}
        onApply={handleApplyBackground}
      />

    </div>
  );
}