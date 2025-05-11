export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}
export type STTEvent = "start" | "end" | "result" | "partialResult" | "error";
export type STTEventHandler = (data?: any) => void;
export declare class STT {
    private recognition?;
    private recognizing;
    private finalTranscript;
    private listeners;
    constructor();
    addListener(event: STTEvent, handler: STTEventHandler): void;
    removeListener(event: STTEvent, handler: STTEventHandler): void;
    removeAllListeners(event?: STTEvent): void;
    private emit;
    private bindEvents;
    start(options?: Partial<STTStartOptions>): Promise<void>;
    stop(): void;
    abort(): void;
    isRecognizing(): boolean;
    dispose(): void;
}
