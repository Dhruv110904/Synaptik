import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import CreateRoomDialog from "../components/CreateRoomDialog";
import NewDMDialog from "../components/NewDMDialog";

import {
  Plus,
  LogOut,
  Settings,
  MessageCircle,
  Search,
  User
} from "lucide-react";
import RoomView from "./RoomView";
import DMView from "./DMView";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");
  const [dms, setDms] = useState([]);
  const [openNewDM, setOpenNewDM] = useState(false);

  useEffect(() => {
    if (activeTab === "dms") {
      API.get("/api/dms").then(res => setDms(res.data));
    }
  }, [activeTab]);


  const handleCreateRoom = async (roomData) => {
    try {
      const { data } = await API.post("/api/rooms", roomData);

      // Add new room instantly to sidebar
      setRooms((prev) => [data, ...prev]);

      return data;
    } catch (err) {
      console.error("Create room failed", err);
      return null;
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

  return (
    // Main Container - Soft Gradient Background + Dark Mode Support
    <div className="h-screen flex overflow-hidden font-sans transition-colors duration-500
      bg-linear-to-br from-teal-50 via-white to-teal-100 
      dark:from-gray-950 dark:via-[#051e24] dark:to-gray-950">

      {/* SIDEBAR */}
      <aside className="w-80 flex flex-col p-4 shadow-sm z-10 border-r transition-all duration-300
        bg-white/80 backdrop-blur-xl border-teal-100 
        dark:bg-gray-900/80 dark:border-gray-800">

        {/* USER PROFILE CARD */}
        <div className="flex items-center gap-4 p-4 mb-6 rounded-2xl border transition-colors
          bg-teal-50/50 border-teal-100/50 
          dark:bg-teal-900/10 dark:border-teal-500/10">
          
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-teal-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-teal-200 dark:shadow-teal-900/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-[2.5px] rounded-full
              border-white dark:border-gray-900"></span>
          </div>
          
          <div className="overflow-hidden">
            <h3 className="font-bold truncate transition-colors
              text-gray-800 dark:text-gray-100">
              {user?.displayName || user?.username}
            </h3>
            <p className="text-xs font-medium truncate transition-colors
              text-teal-600 dark:text-teal-400">
              @{user?.username}
            </p>
          </div>
        </div>

        {/* PILL TABS - Rooms / DMs */}
        <div className="flex p-1.5 rounded-xl mb-4 transition-colors
          bg-gray-100 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "rooms"
                ? "bg-white text-teal-600 shadow-sm dark:bg-gray-700 dark:text-teal-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab("dms")}
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
          {activeTab === "rooms" && (
            rooms.length ? rooms.map(room => (
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
                <p>No rooms found</p>
              </div>
            )
          )}

          {activeTab === "dms" && (
            dms.length ? dms.map(dm => {
              const otherUser = dm.participants.find(p => p._id !== user._id);
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
                      {otherUser.username[0].toUpperCase()}
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
                <p>No messages yet</p>
              </div>
            )
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="pt-4 mt-2 border-t flex justify-between items-center px-2 transition-colors
          border-gray-100 dark:border-gray-800">
          <button className="p-2.5 rounded-xl transition-all
            text-gray-400 hover:bg-gray-50 hover:text-gray-600 
            dark:hover:bg-gray-800 dark:hover:text-gray-300">
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
                {/* Empty State Card */}
                <div className="rounded-4xl p-12 md:p-16 text-center shadow-xl max-w-lg w-full transform transition-all hover:scale-[1.01] border
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
          <Route path="rooms/:roomId" element={<RoomView />} />
          <Route path="dms/:dmId" element={<DMView />} />
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

    </div>
  );
}