import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Smile, Paperclip, Info, MoreVertical, ArrowLeft, Phone, Video } from "lucide-react";
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

  // Background Image (Replace with your actual image path)
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

  const sendMessage = (text) => {
    if (!text.trim()) return;
    socket.emit("dm_message_send", {
      dmId,
      senderId: user.id,
      text,
      type: "text",
    });
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
        
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-5 dark:opacity-[0.03]"
          style={{ 
            backgroundImage: `url(${chatBackground})`,
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

            return (
              <div
                key={i}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[75%] md:max-w-[60%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-3 shadow-sm relative text-[15px] leading-relaxed break-words
                      ${isMe 
                        ? "bg-teal-500 text-white rounded-2xl rounded-br-none" 
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700"
                      }`}
                  >
                    {m.text}

                    {/* Timestamp */}
                    <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end
                      ${isMe ? "text-teal-100" : "text-gray-400"}`}>
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 z-20">
        <ChatInput onSend={sendMessage} />
      </div>

    </div>
  );
}

/* INPUT COMPONENT */
function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-2xl transition-colors focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:bg-white dark:focus-within:bg-gray-800 border border-transparent focus-within:border-teal-100 dark:focus-within:border-gray-700"
    >
      <button type="button" className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
        <Paperclip size={20} />
      </button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-transparent px-2 py-2 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
      />

      <div className="flex items-center gap-1">
        <button type="button" className="p-2 text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
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
  );
}