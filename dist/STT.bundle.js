var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/STTError.ts
var STTError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "STTError";
  }
};

// src/STT.ts
var STT = class {
  // ────────────────────────────────────────────
  //  Construction & binding
  // ────────────────────────────────────────────
  constructor() {
    this.recognizing = false;
    this.finalTranscript = "";
    // One Set per event ➜ maximum type safety
    this.startListeners = /* @__PURE__ */ new Set();
    this.endListeners = /* @__PURE__ */ new Set();
    this.resultListeners = /* @__PURE__ */ new Set();
    this.partialResultListeners = /* @__PURE__ */ new Set();
    this.errorListeners = /* @__PURE__ */ new Set();
    if (typeof window === "undefined") return;
    const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Impl) return;
    this.recognition = new Impl();
    this.bindEvents();
  }
  // ────────────────────────────────────────────
  //  Public listener helpers
  // ────────────────────────────────────────────
  /* ADDERS */
  onStart(handler) {
    this.startListeners.add(handler);
  }
  onEnd(handler) {
    this.endListeners.add(handler);
  }
  onResult(handler) {
    this.resultListeners.add(handler);
  }
  onPartialResult(handler) {
    this.partialResultListeners.add(handler);
  }
  onError(handler) {
    this.errorListeners.add(handler);
  }
  /* REMOVERS */
  offStart(handler) {
    this.startListeners.delete(handler);
  }
  offEnd(handler) {
    this.endListeners.delete(handler);
  }
  offResult(handler) {
    this.resultListeners.delete(handler);
  }
  offPartialResult(handler) {
    this.partialResultListeners.delete(handler);
  }
  offError(handler) {
    this.errorListeners.delete(handler);
  }
  /** Clear listeners for a specific event or *all* events */
  removeAllListeners(event) {
    switch (event) {
      case "start":
        this.startListeners.clear();
        break;
      case "end":
        this.endListeners.clear();
        break;
      case "result":
        this.resultListeners.clear();
        break;
      case "partialResult":
        this.partialResultListeners.clear();
        break;
      case "error":
        this.errorListeners.clear();
        break;
      default:
        this.startListeners.clear();
        this.endListeners.clear();
        this.resultListeners.clear();
        this.partialResultListeners.clear();
        this.errorListeners.clear();
    }
  }
  // ────────────────────────────────────────────
  //  SpeechRecognition wiring
  // ────────────────────────────────────────────
  bindEvents() {
    const r = this.recognition;
    r.onstart = () => {
      this.recognizing = true;
      this.emitStart();
    };
    r.onend = () => {
      this.recognizing = false;
      this.emitEnd();
    };
    r.onerror = (event) => {
      const code = event.error === "not-allowed" || event.error === "permission-denied" ? "PERMISSION_DENIED" /* PERMISSION_DENIED */ : "GENERAL_ERROR" /* GENERAL_ERROR */;
      this.emitError(new STTError(code, event.error));
    };
    r.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
          this.emitResult(this.finalTranscript.trim());
        } else {
          interim += transcript;
        }
      }
      if (interim) {
        this.emitPartialResult(interim.trim());
      }
    };
  }
  // ────────────────────────────────────────────
  //  Emit helpers (private)
  // ────────────────────────────────────────────
  emitStart() {
    this.startListeners.forEach((fn) => fn());
  }
  emitEnd() {
    this.endListeners.forEach((fn) => fn());
  }
  emitResult(text) {
    this.resultListeners.forEach((fn) => fn(text));
  }
  emitPartialResult(text) {
    this.partialResultListeners.forEach((fn) => fn(text));
  }
  emitError(err) {
    this.errorListeners.forEach((fn) => fn(err));
  }
  // ────────────────────────────────────────────
  //  Public API
  // ────────────────────────────────────────────
  /** Begin recognition (prompts for mic permission if needed) */
  start() {
    return __async(this, arguments, function* (options = {}) {
      if (!this.recognition) {
        throw new STTError(
          "SPEECH_NOT_SUPPORTED" /* SPEECH_NOT_SUPPORTED */,
          "Speech recognition is not supported in this browser."
        );
      }
      if (navigator.permissions) {
        const status = yield navigator.permissions.query({ name: "microphone" });
        if (status.state === "denied") {
          throw new STTError("PERMISSION_DENIED" /* PERMISSION_DENIED */, "Microphone permission was denied.");
        }
      }
      const { lang = "en-US", continuous = true, interimResults = true } = options;
      this.recognition.lang = lang;
      this.recognition.continuous = continuous;
      this.recognition.interimResults = interimResults;
      this.finalTranscript = "";
      try {
        this.recognition.start();
      } catch (err) {
        const error = err instanceof STTError ? err : new STTError("GENERAL_ERROR" /* GENERAL_ERROR */, err.message);
        this.emitError(error);
        throw error;
      }
    });
  }
  /** Gracefully stop after the current utterance */
  stop() {
    var _a;
    (_a = this.recognition) == null ? void 0 : _a.stop();
  }
  /** Immediately abort recognition */
  abort() {
    var _a;
    (_a = this.recognition) == null ? void 0 : _a.abort();
  }
  /** `true` while SpeechRecognition is active */
  isRecognizing() {
    return this.recognizing;
  }
  /** Stop recognition and detach all listeners */
  dispose() {
    this.stop();
    this.removeAllListeners();
    this.recognition = void 0;
  }
};
export {
  STT
};
//# sourceMappingURL=STT.bundle.js.map
