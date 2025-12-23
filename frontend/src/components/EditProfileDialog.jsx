import React, { useState } from "react";
import { X, User, Loader2, Camera } from "lucide-react";

export default function EditProfileDialog({ open, onClose, user, onUpdate }) {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    status: user?.status || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onUpdate(formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-125 p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 transition-colors rounded-4xl
        bg-white dark:bg-gray-900 dark:border dark:border-gray-800">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-xl font-bold transition-colors text-gray-900 dark:text-white">
            <User className="text-teal-500 w-6 h-6" />
            Edit Profile
          </div>
          <button 
            onClick={onClose} 
            className="transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-medium mb-2 border-4 shadow-sm transition-colors
                bg-teal-100 text-teal-600 border-white group-hover:bg-teal-200
                dark:bg-teal-900/30 dark:text-teal-400 dark:border-gray-800 dark:group-hover:bg-teal-900/50">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
            <p className="font-medium transition-colors text-gray-500 dark:text-gray-400">@{user?.username}</p>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-semibold mb-2 transition-colors text-gray-700 dark:text-gray-300">
              Display Name
            </label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 rounded-xl border border-transparent outline-none transition-all
                bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400
                dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold mb-2 transition-colors text-gray-700 dark:text-gray-300">
              Status
            </label>
            <input
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="e.g. At work"
              className="w-full px-4 py-3 rounded-xl border border-transparent outline-none transition-all
                bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400
                dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold mb-2 transition-colors text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-transparent outline-none transition-all resize-none
                bg-gray-50 text-gray-800 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400
                dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900 dark:focus:border-teal-500 dark:focus:ring-teal-500/20"
            />
            <div className="text-right text-xs mt-1 transition-colors text-gray-400 dark:text-gray-500">
              {formData.bio.length}/500
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border font-semibold transition-colors
                border-gray-200 text-gray-700 hover:bg-gray-50
                dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2
                bg-teal-500 hover:bg-teal-600 shadow-teal-500/30
                dark:bg-teal-600 dark:hover:bg-teal-500"
            >
              {loading && <Loader2 className="animate-spin w-4 h-4" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}