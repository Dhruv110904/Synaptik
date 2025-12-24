import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Info, 
  MoreVertical, 
  ArrowLeft, 
  Phone, 
  Video, 
  FileText, 
  Music,
  Trash2,      // New
  XCircle,     // New
  Users,       // New
  X,           // New
  AlertTriangle // New
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

export default function DMView() {
  const { dmId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [dm, setDm] = useState(null);
  
  // --- NEW UI STATES ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [confirmation, setConfirmation] = useState({ 
    isOpen: false, 
    title: "", 
    message: "", 
    action: null, 
    type: "danger"
  });

  const bottomRef = useRef(null);
  const chatBackground = "/chat-bg.png";

  /* JOIN DM + LOAD DATA */
  useEffect(() => {
    if (!socket || !dmId) return;

    socket.emit("join_dm", { dmId });

    API.get(`/api/dms`)
      .then(res => {
        const convo = res.data.find(d => d._id === dmId);
        setDm(convo);
      })
      .catch(() => {});

    API.get(`/api/dms/${dmId}/messages`)
      .then(res => setMessages(res.data || []))
      .catch(() => {});

    return () => socket.emit("leave_dm", { dmId });
  }, [socket, dmId]);

  /* SOCKET RECEIVE */
  useEffect(() => {
    if (!socket) return;
    
    // 1. Receive new message
    const msgHandler = (msg) => setMessages(m => [...m, msg]);

    // 2. Handle Clear Chat (Syncs with other user)
    const clearHandler = () => setMessages([]);

    socket.on("dm_message_receive", msgHandler);
    socket.on("dm_chat_cleared", clearHandler); // <--- New Listener

    return () => {
      socket.off("dm_message_receive", msgHandler);
      socket.off("dm_chat_cleared", clearHandler);
    };
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Updated sendMessage to support file types
  const sendMessage = (content, type = "text", fileName = null) => {
    if (!content) return;
    socket.emit("dm_message_send", {
      dmId,
      senderId: user.id,
      text: content,
      type,
      fileName, 
    });
  };

  // Handle Reactions (Local State Update)
  const handleAddReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      const msgId = msg._id || msg.createdAt;
      if (msgId === messageId) {
        const existing = msg.reactions || [];
        if (existing.includes(emoji)) return msg; 
        return { ...msg, reactions: [...existing, emoji] };
      }
      return msg;
    }));
  };

  /* --- MENU ACTIONS --- */

  const requestClearChat = () => {
    setMenuOpen(false);
    setConfirmation({
      isOpen: true,
      title: "Clear Chat History",
      message: "Are you sure you want to delete all messages? This cannot be undone.",
      type: "danger",
      action: executeClearChat
    });
  };

  const executeClearChat = async () => {
    try {
      // Ensure you have this route in backend/routes/dms.js similar to rooms
      await API.delete(`/api/dms/${dmId}/messages`);
      
      // Notify other user to clear screen
      socket.emit("dm_clear_chat", { dmId }); 

      setMessages([]); 
      setConfirmation({ ...confirmation, isOpen: false });
    } catch (err) {
      console.error(err);
      alert("Failed to clear chat (Backend route might be missing)");
    }
  };

  const handleCloseChat = () => {
    navigate("/app");
  };

  /* HELPER: Render Message Content */
  const renderMessageContent = (m) => {
    switch (m.type) {
      case "image":
        return (
          <div className="mt-1">
            <img 
              src={m.text} 
              alt="shared" 
              className="rounded-lg max-w-full sm:max-w-[250px] max-h-[300px] object-cover border border-black/10 dark:border-white/10" 
            />
          </div>
        );
      case "audio":
        return (
          <div className="flex items-center gap-2 min-w-50">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
              <Music size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <audio controls src={m.text} className="h-8 max-w-50" />
          </div>
        );
      case "file":
        return (
          <a 
            href={m.text} 
            download={m.fileName || "download"} 
            className="flex items-center gap-3 bg-black/5 dark:bg-white/10 p-3 rounded-xl hover:bg-black/10 transition-colors"
          >
            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
              <FileText size={24} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-medium text-sm truncate max-w-[150px]">{m.fileName || "Attachment"}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Click to download</span>
            </div>
          </a>
        );
      default:
        return <p className="whitespace-pre-wrap">{m.text}</p>;
    }
  };

  const otherUser = dm?.participants?.find(p => p._id !== user.id);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden relative font-sans">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold">
              {otherUser?.username?.[0]?.toUpperCase()}
            </div>
            {otherUser?.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
            )}
          </div>
          
          <div onClick={() => setShowInfo(true)} className="cursor-pointer hover:opacity-80 transition">
            <h2 className="font-bold text-gray-800 dark:text-white leading-tight">
              {otherUser?.username || "Loading..."}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {otherUser?.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 relative">
          <button className="hidden sm:block p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Phone size={20} />
          </button>
          <button className="hidden sm:block p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Video size={20} />
          </button>
          
          {/* INFO BUTTON */}
          <button 
            onClick={() => setShowInfo(true)}
            className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Info size={20} />
          </button>

          {/* MORE VERTICAL DROPDOWN */}
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    <button 
                      onClick={() => { setShowInfo(true); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
                    >
                      <Users size={16} /> Chat Info
                    </button>
                    <button 
                      onClick={requestClearChat}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
                    >
                      <Trash2 size={16} /> Clear Chat
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    <button 
                      onClick={handleCloseChat}
                      className="flex items-center gap-2 w-full p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-left"
                    >
                      <XCircle size={16} /> Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="relative flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900">
        
        {/* Fixed Background Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none"
          style={{ 
            backgroundImage: `url('${chatBackground}')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px'
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 px-4 py-6 space-y-6 min-h-full flex flex-col">
          
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{animationFillMode: 'forwards'}}>
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <div className="text-4xl">👋</div>
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">
                Say hello to {otherUser?.username}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Start the conversation with a message below.
              </p>
            </div>
          )}

          {messages.map((m, i) => {
            const isMe = m.senderId?._id === user.id || m.senderId === user.id;
            const msgId = m._id || m.createdAt;

            return (
              <div
                key={i}
                className={`group flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[75%] md:max-w-[60%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Message Bubble Container */}
                  <div className="relative">
                    <div
                      className={`px-5 py-3 shadow-sm relative text-[15px] leading-relaxed break-words
                        ${isMe 
                          ? "bg-teal-500 text-white rounded-2xl rounded-br-none" 
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700"
                        }`}
                    >
                      {renderMessageContent(m)}

                      {/* Timestamp */}
                      <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end
                        ${isMe ? "text-teal-100" : "text-gray-400"}`}>
                        {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Reactions Display */}
                    {m.reactions && m.reactions.length > 0 && (
                      <div className={`absolute -bottom-4 ${isMe ? "right-0" : "left-0"} flex items-center gap-1`}>
                        {m.reactions.map((r, idx) => (
                          <span key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs px-1.5 py-0.5 rounded-full shadow-sm animate-in zoom-in">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* REACTION BUTTON (Visible on Hover) */}
                    <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
                      ${isMe ? "-left-10" : "-right-10"}`}>
                      <ReactionPopup onReact={(emoji) => handleAddReaction(msgId, emoji)} />
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} />

      {/* --- MODALS --- */}

      {/* 1. CUSTOM CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
        onConfirm={confirmation.action}
        title={confirmation.title}
        message={confirmation.message}
        type={confirmation.type}
      />

      {/* 2. CHAT INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInfo(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-teal-500 text-white text-center relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition">
                <X size={18} />
              </button>
              <div className="w-20 h-20 mx-auto bg-white text-teal-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mb-3">
                {otherUser?.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-xl font-bold">{otherUser?.username}</h2>
              <p className="text-teal-100 text-sm mt-1">{dm?.participants?.length} Participants</p>
            </div>

            {/* Modal Content - List Participants */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Participants</h3>
              <div className="space-y-3">
                {dm?.participants?.map((participant) => (
                  <div key={participant._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                      {participant.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{participant.username}</p>
                      <p className="text-xs text-gray-500">{participant._id === user.id ? "You" : (participant.online ? "Online" : "Offline")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-center">
              <button onClick={() => setShowInfo(false)} className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* --- SUB-COMPONENTS --- */

// NEW: Custom Confirmation Modal (Same as RoomView)
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = "neutral" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800">
        <div className="p-6 flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 
            ${type === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-xl font-medium text-white shadow-lg transition-transform active:scale-95
                ${type === 'danger' 
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                  : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/20'}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReactionPopup({ onReact }) {
  return (
    <div className="group/menu relative">
      <button className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-teal-500 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
        <Smile size={16} />
      </button>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden group-hover/menu:flex bg-white dark:bg-gray-800 shadow-xl rounded-full border border-gray-200 dark:border-gray-700 p-1 gap-1 animate-in zoom-in-95 duration-200 z-30">
        {["👍", "❤️", "😂", "😮", "😢", "🔥"].map((emoji) => (
          <button 
            key={emoji}
            onClick={() => onReact(emoji)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-lg transition-transform hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text, "text");
    setText("");
    setShowEmoji(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      let type = "file";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("audio/")) type = "audio";
      onSend(result, type, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = null; 
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 z-20 relative">
      
      {showEmoji && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowEmoji(false)} />
          <div className="absolute bottom-20 right-4 z-40 shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <EmojiPicker 
              onEmojiClick={(e) => setText(prev => prev + e.emoji)}
              theme="auto"
              width={320}
              height={400}
            />
          </div>
        </>
      )}

      <form
        onSubmit={submit}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-2xl transition-colors focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:bg-white dark:focus-within:bg-gray-800 border border-transparent focus-within:border-teal-100 dark:focus-within:border-gray-700"
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()}
          className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Paperclip size={20} />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent px-2 py-2 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
        />

        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 
              ${showEmoji ? "text-teal-500 bg-gray-200 dark:bg-gray-800" : "text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"}`}
          >
            <Smile size={20} />
          </button>

          <button 
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-md shadow-teal-500/20 transition-all disabled:opacity-50 disabled:shadow-none hover:scale-105 active:scale-95"
          >
            <Send size={18} className={text.trim() ? "ml-0.5" : ""} />
          </button>
        </div>
      </form>
    </div>
  );
}