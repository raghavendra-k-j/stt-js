export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}
export declare class STT {
    private recognition;
    private recognizing;
    private finalTranscript;
    onStart?: () => void;
    onEnd?: () => void;
    onResult?: (finalTranscript: string) => void;
    onPartialResult?: (interimTranscript: string) => void;
    onError?: (error: string) => void;
    constructor();
    private bindEvents;
    start(options: STTStartOptions): void;
    stop(): void;
    abort(): void;
    isRecognizing(): boolean;
    dispose(): void;
}
