import React from "react";
import { X, Check, Image as ImageIcon } from "lucide-react";

export default function ChangeBackgroundDialog({ open, onClose, onApply, currentBg }) {
  if (!open) return null;

  // Define your public folder images here
  const backgrounds = [
    { id: "bg1", src: "/chat-bg.png", name: "Abstract" },
    { id: "bg2", src: "/chat-bg-2.png", name: "Sage Green" },
    { id: "bg3", src: "/chat-bg-3.png", name: "Navy Blue" },
    { id: "bg4", src: "/chat-bg-4.png", name: "Taupe" },
    { id: "bg5", src: "/chat-bg-5.png", name: "Antique Gold" },
    { id: "bg6", src: "/chat-bg-6.png", name: "Dusty Rose" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
              <ImageIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chat Background
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Default Option */}
            <button
              onClick={() => onApply("")}
              className={`relative aspect-video rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                ${currentBg === "" 
                  ? "border-teal-500 bg-teal-50/50 dark:bg-teal-900/10" 
                  : "border-dashed border-gray-300 dark:border-gray-700 hover:border-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <X size={14} className="text-gray-500 dark:text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Default Theme</span>
              
              {currentBg === "" && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-sm">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </button>

            {/* Image Options */}
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => onApply(bg.src)}
                className={`group relative aspect-video rounded-xl border-2 overflow-hidden transition-all
                  ${currentBg === bg.src 
                    ? "border-teal-500 ring-2 ring-teal-500/20" 
                    : "border-transparent hover:border-teal-300"}`}
              >
                <img 
                  src={bg.src} 
                  alt={bg.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Label */}
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-xs font-medium text-white pl-1">{bg.name}</span>
                </div>

                {/* Selected Check */}
                {currentBg === bg.src && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-sm z-10">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}