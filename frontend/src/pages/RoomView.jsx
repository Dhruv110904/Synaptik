import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Info, 
  MoreVertical, 
  ArrowLeft, 
  FileText, 
  Music
} from "lucide-react";
import EmojiPicker from "emoji-picker-react"; 
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

export default function RoomView() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const bottomRef = useRef(null);

  // Points to your local image in the public folder
  const chatBackground = "/chat-bg.png"; 

  /* JOIN ROOM + LOAD DATA */
  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit("join_room", { roomId });

    API.get(`/api/rooms/${roomId}`).then(res => setRoom(res.data)).catch(() => {});
    API.get(`/api/rooms/${roomId}/messages?limit=50`)
      .then(res => setMessages(res.data || []))
      .catch(() => {});

    return () => socket.emit("leave_room", { roomId });
  }, [socket, roomId]);

  /* SOCKET RECEIVE */
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => setMessages(m => [...m, msg]);
    socket.on("room_message_receive", handler);
    return () => socket.off("room_message_receive", handler);
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (content, type = "text", fileName = null) => {
    if (!content) return;
    socket.emit("room_message_send", {
      roomId,
      senderId: user.id,
      text: content,
      type,
      fileName, 
    });
  };

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
          <div className="flex items-center gap-2 min-w-[200px]">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
              <Music size={20} className="text-teal-600 dark:text-teal-400" />
            </div>
            <audio controls src={m.text} className="h-8 max-w-[200px]" />
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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden relative font-sans">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={20} />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            {room?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white leading-tight">
              {room?.name || "Loading..."}
            </h2>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              {room?.members?.length || 1} member{room?.members?.length !== 1 && 's'} online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Info size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* CHAT AREA CONTAINER (Fixed BG + Scrolling Content) */}
      <div className="relative flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        
        {/* 1. FIXED BACKGROUND LAYER (Stationary Wallpaper) */}
        <div 
          className="absolute inset-0 z-0 opacity-10 dark:opacity-5 pointer-events-none"
          style={{ 
            backgroundImage: `url('${chatBackground}')`,
            backgroundRepeat: 'repeat',
            backgroundSize: '400px' // Adjust scale as needed
          }}
        />

        {/* 2. SCROLLABLE MESSAGES LAYER */}
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar z-10 px-4 py-6 space-y-6">
          
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-fade-in" style={{animationFillMode: 'forwards'}}>
              <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center mb-4">
                <Smile size={32} className="text-teal-500" />
              </div>
              <p className="text-gray-900 dark:text-white font-semibold text-lg">No messages yet</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Send a message to start the conversation!</p>
            </div>
          )}

          {messages.map((m, i) => {
            const isMe = m.senderId?._id === user.id || m.senderId === user.id;
            const showAvatar = !isMe && (i === 0 || messages[i-1].senderId?._id !== m.senderId?._id);
            const msgId = m._id || m.createdAt;

            return (
              <div
                key={i}
                className={`group flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[70%] gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {!isMe && (
                    <div className="shrink-0 w-8 flex flex-col justify-end">
                      {showAvatar ? (
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300">
                          {m.senderId?.username?.[0]?.toUpperCase()}
                        </div>
                      ) : <div className="w-8" />}
                    </div>
                  )}

                  <div className="relative">
                    <div
                      className={`px-4 py-3 shadow-sm relative text-[15px] leading-relaxed break-words
                        ${isMe 
                          ? "bg-teal-500 text-white rounded-2xl rounded-br-none" 
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700"
                        }`}
                    >
                      {!isMe && showAvatar && (
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mb-1 opacity-90">
                          {m.senderId?.username}
                        </p>
                      )}
                      
                      {renderMessageContent(m)}

                      <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end opacity-80
                        ${isMe ? "text-white" : "text-gray-400"}`}>
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
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

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