import { create } from "zustand";
import AudioRecorder from "../utils/audioRecorder";
import { api } from "../utils/axiosInstances";
import useLanguageStore from "./useLanguageStore";

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
  isRecording: false,
  recordingDuration: 0,
  audioRecorder: null,
  recordingTimer: null,

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
        localStorage.setItem(
          CHAT_STORAGE_KEY,
          JSON.stringify({ messages: newMessages })
        );
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

  startRecording: async () => {
    const state = get();

    // Don't start if already recording
    if (state.isRecording) return;

    // Create new recorder instance
    const recorder = new AudioRecorder();

    try {
      await recorder.start(
        // onDataAvailable callback
        (audioBlob, mimeType) => {
          const currentState = get();
          const currentLanguage = useLanguageStore.getState().language;
          currentState.sendVoiceMessage(audioBlob, mimeType, currentLanguage);
        },
        // onError callback
        (error) => {
          console.error("Recording error:", error);
          get().stopRecording();

          // Add error message to chat
          get().addMessage(
            "assistant",
            "Sorry, I couldn't access your microphone. Please check your browser permissions."
          );
        }
      );

      // Start duration timer (count up from 0 to 90)
      const timer = setInterval(() => {
        const current = get();
        const newDuration = current.recordingDuration + 1;

        if (newDuration >= 90) {
          current.stopRecording();
        } else {
          set({ recordingDuration: newDuration });
        }
      }, 1000);

      set({
        isRecording: true,
        audioRecorder: recorder,
        recordingTimer: timer,
        recordingDuration: 0,
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      recorder.cleanup();

      get().addMessage(
        "assistant",
        "Sorry, I couldn't access your microphone. Please enable microphone permissions in your browser settings."
      );
    }
  },

  stopRecording: () => {
    const state = get();

    if (state.recordingTimer) {
      clearInterval(state.recordingTimer);
    }

    if (state.audioRecorder) {
      state.audioRecorder.stop();
    }

    set({
      isRecording: false,
      recordingDuration: 0,
      recordingTimer: null,
      audioRecorder: null,
    });
  },

  sendVoiceMessage: async (audioBlob, mimeType, currentLanguage = "en") => {
    const state = get();

    try {
      set({ loading: true });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      await new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result.split(",")[1]; // Remove data:audio/webm;base64, prefix

            // Add user message indicator
            state.addMessage("user", "🎤 Voice message");

            // Send to backend
            const { data } = await api.post("/chat/message", {
              audio: base64Audio,
              mimeType: mimeType,
              language: currentLanguage,
              history: state.messages.slice(-10),
            });

            state.addMessage("assistant", data.message);
            resolve();
          } catch (error) {
            console.error("Voice message error:", error);

            // Show backend error message if available
            const errorMessage =
              error.response?.data?.error ||
              "Sorry, I couldn't process your voice message. Please try again in a moment.";

            state.addMessage("assistant", errorMessage);
            reject(error);
          } finally {
            set({ loading: false });
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read audio file"));
        };
      });
    } catch (error) {
      console.error("Failed to send voice message:", error);
      set({ loading: false });
    }
  },
}));

export default useChatStore;
