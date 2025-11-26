/**
 * Audio Recorder Utility
 * Handles microphone recording with WebM format and 90-second time limit
 */

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.maxDuration = 90000; // 90 seconds in milliseconds
    this.stopTimer = null;
  }

  /**
   * Initialize and start recording
   * @param {Function} onDataAvailable - Callback when recording completes with (audioBlob, mimeType)
   * @param {Function} onError - Callback for errors
   * @returns {Promise<void>}
   */
  async start(onDataAvailable, onError) {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Determine supported MIME type
      const mimeType = this.getSupportedMimeType();

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType,
      });

      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });

      // Handle recording stop
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanup();

        if (onDataAvailable) {
          onDataAvailable(audioBlob, mimeType);
        }
      });

      // Handle errors
      this.mediaRecorder.addEventListener("error", (event) => {
        console.error("MediaRecorder error:", event.error);
        this.cleanup();

        if (onError) {
          onError(event.error);
        }
      });

      // Start recording
      this.mediaRecorder.start();

      // Auto-stop after max duration
      this.stopTimer = setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
          this.stop();
        }
      }, this.maxDuration);
    } catch (error) {
      console.error("Failed to start recording:", error);
      this.cleanup();

      if (onError) {
        onError(error);
      }
    }
  }

  /**
   * Stop recording
   */
  stop() {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Get the best supported MIME type for audio recording
   * @returns {string}
   */
  getSupportedMimeType() {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return ""; // Browser will use default
  }

  /**
   * Check if audio recording is supported
   * @returns {boolean}
   */
  static isSupported() {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );
  }
}

export default AudioRecorder;
