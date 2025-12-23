import React, { useEffect, useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function NewDMDialog({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    API.get(`/api/users/search?q=${query}`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [query, open]);

  const startDM = async (userId) => {
    try {
      const res = await API.post(`/api/dms/start/${userId}`);

      if (!res.data?._id) {
        console.error("DM not created");
        return;
      }

      onClose();

      // IMPORTANT: delay to allow dialog unmount
      setTimeout(() => {
        navigate(`/app/dms/${res.data._id}`);
      }, 100);

    } catch (err) {
      console.error("Failed to start DM", err.response?.data || err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Card Container */}
      <div className="w-full max-w-125 p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 transition-colors
        bg-white rounded-4xl
        dark:bg-gray-900 dark:border dark:border-gray-800">

        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 transition-colors
            text-gray-400 hover:text-gray-600 
            dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-bold mb-1 transition-colors
            text-gray-900 dark:text-white">
            New Message
          </h2>
          <p className="text-[15px] transition-colors
            text-gray-500 dark:text-gray-400">
            Find people to chat with privately.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
            text-gray-400 dark:text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or @username..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-colors text-[15px]
              border-teal-400 text-gray-800 placeholder-gray-400 focus:border-teal-500
              dark:bg-gray-800 dark:border-teal-500 dark:text-white dark:placeholder-gray-500 dark:focus:border-teal-400"
          />
        </div>

        {/* USER LIST */}
        <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar -mr-2 pr-2">
          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <UserPlus className="w-12 h-12 mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {query ? "No users found" : "Type to search people"}
              </p>
            </div>
          )}

          {users.map(user => (
            <button
              key={user._id}
              onClick={() => startDM(user._id)}
              className="w-full flex items-center gap-4 p-3 rounded-xl transition-all group
                hover:bg-gray-50 dark:hover:bg-gray-800/60"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-colors
                bg-teal-100 text-teal-700 
                dark:bg-teal-900/30 dark:text-teal-400">
                {user.username[0].toUpperCase()}
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-[15px] transition-colors
                  text-gray-900 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  {user.username}
                </p>
                <p className="text-xs transition-colors
                  text-gray-500 dark:text-gray-500">
                  @{user.username}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400">
                  Message
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}