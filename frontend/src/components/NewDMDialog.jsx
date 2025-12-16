import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-160 p-6 shadow-xl relative">

        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Start a Conversation
        </h2>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-teal-400 outline-none"
          />
        </div>

        {/* USER LIST */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {users.length === 0 && (
            <p className="text-sm text-gray-400 text-center">
              No users found
            </p>
          )}

          {users.map(user => (
            <button
              key={user._id}
              onClick={() => startDM(user._id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 transition"
            >
              <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-gray-500">
                  @{user.username}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
