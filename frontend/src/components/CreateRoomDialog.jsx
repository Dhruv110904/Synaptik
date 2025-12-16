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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Room</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
            className="w-full p-3 rounded-xl border"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (optional)"
            className="w-full p-3 rounded-xl border"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full p-3 rounded-xl border resize-none"
            rows={3}
          />

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Private room (invite only)
          </label>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </span>
            ) : (
              "Create Room"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
