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
  constructor() {
    this.recognizing = false;
    this.finalTranscript = "";
    this.listeners = /* @__PURE__ */ new Map();
    if (typeof window === "undefined") return;
    const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Impl) return;
    this.recognition = new Impl();
    this.bindEvents();
  }
  addListener(event, handler) {
    var _a;
    if (!this.listeners.has(event)) {
      this.listeners.set(event, /* @__PURE__ */ new Set());
    }
    (_a = this.listeners.get(event)) == null ? void 0 : _a.add(handler);
  }
  removeListener(event, handler) {
    var _a;
    (_a = this.listeners.get(event)) == null ? void 0 : _a.delete(handler);
  }
  removeAllListeners(event) {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
  emit(event, data) {
    var _a;
    (_a = this.listeners.get(event)) == null ? void 0 : _a.forEach((handler) => handler(data));
  }
  bindEvents() {
    if (!this.recognition) return;
    this.recognition.onstart = () => {
      this.recognizing = true;
      this.emit("start");
    };
    this.recognition.onend = () => {
      this.recognizing = false;
      this.emit("end");
    };
    this.recognition.onerror = (event) => {
      const code = event.error === "not-allowed" || event.error === "permission-denied" ? "PERMISSION_DENIED" /* PERMISSION_DENIED */ : "GENERAL_ERROR" /* GENERAL_ERROR */;
      this.emit("error", new STTError(code, event.error));
    };
    this.recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
          this.emit("result", this.finalTranscript.trim());
        } else {
          interim += transcript;
        }
      }
      if (interim) {
        this.emit("partialResult", interim.trim());
      }
    };
  }
  start() {
    return __async(this, arguments, function* (options = {}) {
      if (!this.recognition) {
        throw new STTError(
          "SPEECH_NOT_SUPPORTED" /* SPEECH_NOT_SUPPORTED */,
          "Speech recognition is not supported in this browser."
        );
      }
      try {
        if (navigator.permissions) {
          const status = yield navigator.permissions.query({
            name: "microphone"
          });
          if (status.state === "denied") {
            throw new STTError(
              "PERMISSION_DENIED" /* PERMISSION_DENIED */,
              "Microphone permission was denied."
            );
          }
        }
        const {
          lang = "en-US",
          continuous = true,
          interimResults = true
        } = options;
        this.recognition.lang = lang;
        this.recognition.continuous = continuous;
        this.recognition.interimResults = interimResults;
        this.finalTranscript = "";
        this.recognition.start();
      } catch (err) {
        const error = err instanceof STTError ? err : new STTError("GENERAL_ERROR" /* GENERAL_ERROR */, err.message);
        this.emit("error", error);
        throw error;
      }
    });
  }
  stop() {
    var _a;
    (_a = this.recognition) == null ? void 0 : _a.stop();
  }
  abort() {
    var _a;
    (_a = this.recognition) == null ? void 0 : _a.abort();
  }
  isRecognizing() {
    return this.recognizing;
  }
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
