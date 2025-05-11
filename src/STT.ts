// STT.ts
import { STTError, STTErrorCode } from "./STTError";

/** Options accepted by `start()` */
export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}

/** Speech-to-Text wrapper with per-event listener sets */
export class STT {
    // ────────────────────────────────────────────
    //  Internals
    // ────────────────────────────────────────────
    private recognition?: SpeechRecognition;
    private recognizing = false;
    private finalTranscript = "";

    // One Set per event ➜ maximum type safety
    private readonly startListeners = new Set<() => void>();
    private readonly endListeners = new Set<() => void>();
    private readonly resultListeners = new Set<(text: string) => void>();
    private readonly partialResultListeners = new Set<(text: string) => void>();
    private readonly errorListeners = new Set<(err: STTError) => void>();

    // ────────────────────────────────────────────
    //  Construction & binding
    // ────────────────────────────────────────────
    constructor() {
        if (typeof window === "undefined") return;                 // server-side guard

        const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Impl) return;                                         // feature not available

        this.recognition = new Impl();
        this.bindEvents();
    }

    // ────────────────────────────────────────────
    //  Public listener helpers
    // ────────────────────────────────────────────
    /* ADDERS */
    public onStart(handler: () => void) { this.startListeners.add(handler); }
    public onEnd(handler: () => void) { this.endListeners.add(handler); }
    public onResult(handler: (text: string) => void) { this.resultListeners.add(handler); }
    public onPartialResult(handler: (text: string) => void) { this.partialResultListeners.add(handler); }
    public onError(handler: (error: STTError) => void) { this.errorListeners.add(handler); }

    /* REMOVERS */
    public offStart(handler: () => void) { this.startListeners.delete(handler); }
    public offEnd(handler: () => void) { this.endListeners.delete(handler); }
    public offResult(handler: (text: string) => void) { this.resultListeners.delete(handler); }
    public offPartialResult(handler: (text: string) => void) { this.partialResultListeners.delete(handler); }
    public offError(handler: (error: STTError) => void) { this.errorListeners.delete(handler); }

    /** Clear listeners for a specific event or *all* events */
    public removeAllListeners(event?: "start" | "end" | "result" | "partialResult" | "error"): void {
        switch (event) {
            case "start": this.startListeners.clear(); break;
            case "end": this.endListeners.clear(); break;
            case "result": this.resultListeners.clear(); break;
            case "partialResult": this.partialResultListeners.clear(); break;
            case "error": this.errorListeners.clear(); break;
            default:               // clear everything
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
    private bindEvents(): void {
        const r = this.recognition!;
        /* start / end -------------------------------------------------------- */
        r.onstart = () => { this.recognizing = true; this.emitStart(); };
        r.onend = () => { this.recognizing = false; this.emitEnd(); };

        /* error -------------------------------------------------------------- */
        r.onerror = (event) => {
            const code = (event.error === "not-allowed" || event.error === "permission-denied") ? STTErrorCode.PERMISSION_DENIED : STTErrorCode.GENERAL_ERROR;
            this.emitError(new STTError(code, event.error));
        };

        /* results ------------------------------------------------------------ */
        r.onresult = (event: SpeechRecognitionEvent) => {
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
    private emitStart() { this.startListeners.forEach(fn => fn()); }
    private emitEnd() { this.endListeners.forEach(fn => fn()); }
    private emitResult(text: string) { this.resultListeners.forEach(fn => fn(text)); }
    private emitPartialResult(text: string) { this.partialResultListeners.forEach(fn => fn(text)); }
    private emitError(err: STTError) { this.errorListeners.forEach(fn => fn(err)); }

    // ────────────────────────────────────────────
    //  Public API
    // ────────────────────────────────────────────
    /** Begin recognition (prompts for mic permission if needed) */
    public async start(options: Partial<STTStartOptions> = {}): Promise<void> {
        if (!this.recognition) {
            throw new STTError(
                STTErrorCode.SPEECH_NOT_SUPPORTED,
                "Speech recognition is not supported in this browser."
            );
        }

        // optional permission pre-check
        if (navigator.permissions) {
            const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
            if (status.state === "denied") {
                throw new STTError(STTErrorCode.PERMISSION_DENIED, "Microphone permission was denied.");
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
            const error = err instanceof STTError ? err : new STTError(STTErrorCode.GENERAL_ERROR, (err as Error).message);
            this.emitError(error);
            throw error;
        }
    }

    /** Gracefully stop after the current utterance */
    public stop(): void { this.recognition?.stop(); }

    /** Immediately abort recognition */
    public abort(): void { this.recognition?.abort(); }

    /** `true` while SpeechRecognition is active */
    public isRecognizing(): boolean { return this.recognizing; }

    /** Stop recognition and detach all listeners */
    public dispose(): void {
        this.stop();
        this.removeAllListeners();
        this.recognition = undefined;
    }
}
