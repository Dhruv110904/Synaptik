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
    <div className="h-screen flex bg-linear-to-br from-teal-100 via-white to-teal-200">

      {/* SIDEBAR */}
      <aside className="w-120 bg-white border-r border-gray-200 flex flex-col">

        {/* USER */}
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="font-semibold leading-tight">
                {user?.displayName || user?.username}
              </p>
              <p className="text-sm text-gray-500">
                @{user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="px-4 mt-4 flex gap-2">
  <button
    onClick={() => setActiveTab("rooms")}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      activeTab === "rooms"
        ? "bg-teal-500 text-white"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    Rooms
  </button>

  <button
    onClick={() => setActiveTab("dms")}
    className={`flex-1 py-2 rounded-xl text-sm font-medium ${
      activeTab === "dms"
        ? "bg-teal-500 text-white"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    DMs
  </button>
</div>



        {/* SEARCH */}
        <div className="px-4 mt-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      placeholder={
        activeTab === "rooms"
          ? "Search rooms..."
          : "Search messages..."
      }
      className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 focus:outline-none"
    />
  </div>
</div>


        {/* CREATE ROOM */}
        {activeTab === "rooms" && (
  <button
    onClick={() => setOpenCreate(true)}
    className="mx-4 mt-4 flex items-center gap-2 text-teal-600 font-medium"
  >
    <Plus size={18} />
    Create Room
  </button>
)}
{activeTab === "dms" && (
  <button
    onClick={() => setOpenNewDM(true)}
    className="mx-4 mt-4 flex items-center gap-2 text-teal-600 font-medium"
  >
    <Plus size={18} />
    New Message
  </button>
)}



        {/* ROOMS LIST */}
        <div className="flex-1 overflow-auto px-4 mt-4 space-y-2">

  {activeTab === "rooms" && (
    rooms.length ? rooms.map(room => (
      <Link
      key={room._id}
      to={`/app/rooms/${room._id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50"
    >
      <div className="w-10 h-10 rounded-xl bg-teal-200 text-teal-700 flex items-center justify-center font-semibold">
        {room.name[0].toUpperCase()}
      </div>
      <div>
        <p className="font-medium">{room.name}</p>
        <p className="text-xs text-gray-500">
          {room.members?.length || 0} members
        </p>
      </div>
    </Link>
    )) : <p className="text-md text-gray-500">No rooms</p>
  )}

  {activeTab === "dms" && (
    dms.length ? dms.map(dm => {
      const otherUser = dm.participants.find(p => p._id !== user._id);
      return (
            <Link
      key={dm._id}
      to={`/app/dms/${dm._id}`}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center">
          {otherUser.username[0].toUpperCase()}
        </div>
        {otherUser.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      <div>
        <p className="font-medium">{otherUser.username}</p>
        <p className="text-xs text-gray-500">@{otherUser.username}</p>
      </div>
    </Link>
      );
    }) : <p className="text-sm text-gray-500">No DMs</p>
  )}

</div>


        {/* FOOTER ICONS */}
        <div className="p-4 border-t border-black/5 flex justify-between">
          <button className="p-2 rounded-xl hover:bg-gray-100">
            <Settings size={18} />
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-xl hover:bg-red-100 text-red-500"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative">

        <Routes>
          <Route
            path="/"
            element={
              <div className="h-full flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 text-center shadow-lg max-w-md">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                    <MessageCircle size={28} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Select a conversation
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Choose a room from the sidebar or start a new
                    direct message to begin chatting.
                  </p>
                </div>
              </div>
            }
          />

          <Route path="rooms/:roomId" element={<RoomView />} />
          <Route path="dms/:dmId" element={<DMView />} />

        </Routes>
      </main>
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
