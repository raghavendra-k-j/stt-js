export declare enum STTErrorCode {
    SPEECH_NOT_SUPPORTED = "SPEECH_NOT_SUPPORTED",
    GENERAL_ERROR = "GENERAL_ERROR",
    PERMISSION_DENIED = "PERMISSION_DENIED"
}
export declare class STTError extends Error {
    code: STTErrorCode;
    constructor(code: STTErrorCode, message: string);
}
/** Options accepted by `start()` */
export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}
/** Speech-to-Text wrapper with per-event listener sets */
export declare class STT {
    private recognition?;
    private recognizing;
    private finalTranscript;
    private readonly startListeners;
    private readonly endListeners;
    private readonly resultListeners;
    private readonly partialResultListeners;
    private readonly errorListeners;
    constructor();
    onStart(handler: () => void): void;
    onEnd(handler: () => void): void;
    onResult(handler: (text: string) => void): void;
    onPartialResult(handler: (text: string) => void): void;
    onError(handler: (error: STTError) => void): void;
    offStart(handler: () => void): void;
    offEnd(handler: () => void): void;
    offResult(handler: (text: string) => void): void;
    offPartialResult(handler: (text: string) => void): void;
    offError(handler: (error: STTError) => void): void;
    /** Clear listeners for a specific event or *all* events */
    removeAllListeners(event?: "start" | "end" | "result" | "partialResult" | "error"): void;
    private bindEvents;
    private emitStart;
    private emitEnd;
    private emitResult;
    private emitPartialResult;
    private emitError;
    /** Begin recognition (prompts for mic permission if needed) */
    start(options?: Partial<STTStartOptions>): Promise<void>;
    /** Gracefully stop after the current utterance */
    stop(): void;
    /** Immediately abort recognition */
    abort(): void;
    /** `true` while SpeechRecognition is active */
    isRecognizing(): boolean;
    /** Stop recognition and detach all listeners */
    dispose(): void;
}
