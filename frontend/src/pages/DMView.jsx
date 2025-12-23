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
  Music 
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
  const bottomRef = useRef(null);

  // Points to your local image in the public folder
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
    const handler = (msg) => setMessages(m => [...m, msg]);
    socket.on("dm_message_receive", handler);
    return () => socket.off("dm_message_receive", handler);
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
          
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white leading-tight">
              {otherUser?.username || "Loading..."}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {otherUser?.online ? "Active now" : "Offline"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800">
            <Info size={20} />
          </button>
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
      
      {/* Emoji Picker Popup */}
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
        {/* Hidden File Input */}
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