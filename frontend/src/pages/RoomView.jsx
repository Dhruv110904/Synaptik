import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Smile, Paperclip, Info } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

export default function RoomView() {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const bottomRef = useRef(null);

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

  const sendMessage = (text) => {
    if (!text.trim()) return;
    socket.emit("room_message_send", {
      roomId,
      senderId: user.id,
      text,
      type: "text",
    });
  };

  return (
    <div className="h-full flex flex-col rounded-2xl  bg-white overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 rounded-t-2xl bg-amber-400 shadow-lg z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
            {room?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold leading-tight">{room?.name}</p>
            <p className="text-sm text-gray-500">
              {room?.members?.length || 1} member online
            </p>
          </div>
        </div>
        <Info className="text-gray-400" />
      </div>

      {/* MESSAGES */}
      <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-linear-to-br from-teal-50 via-white to-emerald-50">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-blob" />
    <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
  </div>

        <div className="relative z-10">
        {messages.length === 0 && (
      <div className="h-full flex items-center justify-center text-center min-h-[60vh]">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl px-10 py-8 shadow-xl">
          <p className="text-gray-600 font-semibold text-xl mb-2">
            No messages yet
          </p>
          <p className="text-gray-400 text-lg">
            Be the first to say hello! 👋
          </p>
        </div>
      </div>
    )}
    </div>

        {messages.map((m, i) => {
          const isMe = m.senderId?._id === user.id || m.senderId === user.id;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-teal-500 text-white rounded-br-md"
                    : "bg-white border rounded-bl-md"
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-semibold text-teal-600 mb-1">
                    {m.senderId?.username || "User"}
                  </p>
                )}
                {m.text}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}

/* INPUT BAR */
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
      className="p-4 z-10 flex items-center gap-3  bg-white"
    >
      <Paperclip className="text-teal-500" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-xl focus:outline-none"
      />
      <Smile className="text-teal-500" />
      <button className="w-10 h-10 rounded-xl text-teal-500 flex items-center justify-center">
        <Send size={18} />
      </button>
    </form>
  );
}
