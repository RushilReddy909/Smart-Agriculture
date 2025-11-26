import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TbMessageCircle,
  TbX,
  TbSend,
  TbLoader,
  TbMicrophone,
} from "react-icons/tb";
import { api } from "../utils/axiosInstances";
import useChatStore from "../store/useChatStore";
import useLanguageStore from "../store/useLanguageStore";

const renderContentWithLinks = (content) => {
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Regex to find [text](url)
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }

    const linkText = match[1];
    const url = match[2];

    // Use React Router's Link component for internal navigation
    parts.push(
      <Link
        key={match.index}
        to={url}
        className="text-green-600 underline hover:text-green-700 font-medium"
        onClick={() => useChatStore.getState().closeChat()} // Optional: Close chat on link click
      >
        {linkText}
      </Link>
    );

    lastIndex = regex.lastIndex;
  }

  const textAfter = content.substring(lastIndex);
  if (textAfter) {
    parts.push(textAfter);
  }

  return <>{parts}</>;
};

const ChatWidget = () => {
  const {
    messages,
    isOpen,
    loading,
    isRecording,
    recordingDuration,
    openChat,
    closeChat,
    addMessage,
    setLoading,
    startRecording,
    stopRecording,
  } = useChatStore();
  const { language } = useLanguageStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setLoading(true);

    try {
      const { data } = await api.post("/chat/message", {
        message: userMessage,
        history: messages.slice(-10), // Last 10 messages for context
      });

      addMessage("assistant", data.message);
    } catch (error) {
      console.error("Chat error:", error);
      addMessage(
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const formatRecordingTime = (seconds) => {
    const remaining = 90 - seconds;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Open chat"
        >
          <TbMessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <TbMessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Agri Assistant</h3>
            </div>
            <button
              onClick={closeChat}
              className="p-1 hover:bg-green-700 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <TbMessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Hello! I'm your AI farming assistant.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {msg.role === "user"
                        ? msg.content
                        : renderContentWithLinks(msg.content)}
                    </p>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-2 border border-gray-200">
                  <TbLoader className="w-5 h-5 animate-spin text-green-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-gray-200 bg-white rounded-b-2xl"
          >
            {isRecording && (
              <div className="flex items-center justify-center gap-2 mb-3 text-sm text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  Recording: {formatRecordingTime(recordingDuration)}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming..."
                className="flex-1 input-field text-sm"
                disabled={loading || isRecording}
              />

              {!input.trim() ? (
                <button
                  type="button"
                  onClick={handleMicClick}
                  disabled={loading}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    isRecording
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={
                    isRecording ? "Stop recording" : "Start recording"
                  }
                >
                  <TbMicrophone className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || isRecording}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <TbSend className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
