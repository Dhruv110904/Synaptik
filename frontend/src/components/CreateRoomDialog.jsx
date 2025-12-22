import { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function CreateRoomDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError("Room name must be at least 3 characters");
      return;
    }

    setLoading(true);
    const result = await onCreate({
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      isPrivate,
    });
    setLoading(false);

    if (!result) {
      setError("Failed to create room");
      return;
    }

    setName("");
    setDescription("");
    setCategory("");
    setIsPrivate(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Card Container */}
      <div className="w-full max-w-[500px] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 transition-colors
        bg-white rounded-[2rem] 
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
        <div className="mb-8 pr-8">
          <h2 className="text-2xl font-bold mb-1 transition-colors
            text-gray-900 dark:text-white">
            Create a New Room
          </h2>
          <p className="text-[15px] transition-colors
            text-gray-500 dark:text-gray-400">
            Create a space for your community to chat and collaborate.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm border transition-colors
            bg-red-50 text-red-600 border-red-100
            dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">

          {/* ROOM NAME INPUT */}
          <div>
            <label className="block text-sm font-semibold mb-2 transition-colors
              text-gray-900 dark:text-gray-200">
              Room Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., General Discussion"
              className="w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-[15px]
                border-teal-400 text-gray-800 placeholder-gray-400 focus:border-teal-500
                dark:bg-gray-800 dark:border-teal-500 dark:text-white dark:placeholder-gray-500 dark:focus:border-teal-400"
            />
          </div>

          {/* CATEGORY INPUT (Hidden) */}
          <input
            type="hidden"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* DESCRIPTION INPUT */}
          <div>
            <label className="block text-sm font-semibold mb-2 transition-colors
              text-gray-900 dark:text-gray-200">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border transition-all resize-none text-[15px] outline-none
                bg-gray-50 border-transparent text-gray-800 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-100
                dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:bg-gray-800 dark:focus:ring-teal-900/30 dark:border-gray-700"
            />
          </div>

          {/* PRIVATE ROOM TOGGLE */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <label className="block text-sm font-semibold transition-colors
                text-gray-900 dark:text-gray-200">
                Private Room
              </label>
              <p className="text-sm mt-0.5 transition-colors
                text-gray-500 dark:text-gray-400">
                Only invited members can join
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <div className="w-12 h-7 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300
                bg-gray-200 after:border-gray-300 peer-checked:bg-teal-400 peer-checked:after:border-white
                dark:bg-gray-700 dark:after:border-gray-600 dark:peer-checked:bg-teal-500"></div>
            </label>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 pt-6 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border font-semibold text-sm transition-colors
                border-gray-200 text-gray-700 hover:bg-gray-50
                dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                bg-teal-400 hover:bg-teal-500 shadow-teal-200
                dark:bg-teal-500 dark:hover:bg-teal-600 dark:shadow-none"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Creating...
                </span>
              ) : (
                "Create Room"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}