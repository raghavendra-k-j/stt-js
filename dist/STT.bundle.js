// src/STTError.ts
var STTError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "SpeechError";
  }
};

// src/STT.ts
var STT = class {
  constructor() {
    this.recognition = void 0;
    this.recognizing = false;
    this.finalTranscript = "";
    if (typeof window === "undefined") {
      return;
    }
    const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Impl) {
      return;
    }
    this.recognition = new Impl();
    if (!this.recognition) {
      return;
    }
    this.bindEvents();
  }
  bindEvents() {
    if (!this.recognition) {
      return;
    }
    this.recognition.onstart = () => {
      var _a;
      this.recognizing = true;
      (_a = this.onStart) == null ? void 0 : _a.call(this);
    };
    this.recognition.onend = () => {
      var _a;
      this.recognizing = false;
      (_a = this.onEnd) == null ? void 0 : _a.call(this);
    };
    this.recognition.onerror = (event) => {
      var _a;
      (_a = this.onError) == null ? void 0 : _a.call(this, event.error);
    };
    this.recognition.onresult = (event) => {
      var _a;
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.finalTranscript += transcript;
          (_a = this.onResult) == null ? void 0 : _a.call(this, this.finalTranscript.trim());
        } else {
          interim += transcript;
        }
      }
      if (interim && this.onPartialResult) {
        this.onPartialResult(interim.trim());
      }
    };
  }
  start(options) {
    var _a;
    if (!this.recognition) {
      throw new STTError("SPEECH_NOT_SUPPORTED" /* SPEECH_NOT_SUPPORTED */, "Speech recognition not supported");
    }
    this.recognition.lang = options.lang;
    this.recognition.continuous = options.continuous;
    this.recognition.interimResults = options.interimResults;
    this.finalTranscript = "";
    (_a = this.recognition) == null ? void 0 : _a.start();
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
    if (!this.recognition) {
      return;
    }
  }
};
export {
  STT
};
//# sourceMappingURL=STT.bundle.js.map
