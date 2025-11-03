import { create } from "zustand";

const CHAT_STORAGE_KEY = "smart-ag-chat-history";

// Load initial messages from localStorage
const getInitialMessages = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.messages || [];
      } catch (e) {
        console.error("Failed to load chat history:", e);
        return [];
      }
    }
  }
  return [];
};

const useChatStore = create((set, get) => ({
  messages: getInitialMessages(),
  isOpen: false,
  loading: false,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (role, content) => {
    set((state) => {
      const newMessages = [
        ...state.messages,
        { role, content, timestamp: new Date().toISOString() },
      ];
      
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages: newMessages }));
      }
      
      return { messages: newMessages };
    });
  },

  setLoading: (loading) => set({ loading }),

  clearHistory: () => {
    set({ messages: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  },
}));

export default useChatStore;

