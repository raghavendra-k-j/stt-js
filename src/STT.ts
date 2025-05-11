import { STTError, STTErrorCode } from "./STTError";

export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}

export type STTEvent = "start" | "end" | "result" | "partialResult" | "error";
export type STTEventHandler = (data?: any) => void;

export class STT {
    private recognition?: SpeechRecognition;
    private recognizing = false;
    private finalTranscript = "";
    private listeners: Map<STTEvent, Set<STTEventHandler>> = new Map();

    constructor() {
        if (typeof window === "undefined") return;

        const Impl = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Impl) return;

        this.recognition = new Impl();
        this.bindEvents();
    }

    public addListener(event: STTEvent, handler: STTEventHandler): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(handler);
    }

    public removeListener(event: STTEvent, handler: STTEventHandler): void {
        this.listeners.get(event)?.delete(handler);
    }

    public removeAllListeners(event?: STTEvent): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    private emit(event: STTEvent, data?: any): void {
        this.listeners.get(event)?.forEach((handler) => handler(data));
    }

    private bindEvents(): void {
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
            const code =
                event.error === "not-allowed" || event.error === "permission-denied"
                    ? STTErrorCode.PERMISSION_DENIED
                    : STTErrorCode.GENERAL_ERROR;

            this.emit("error", new STTError(code, event.error));
        };

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
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


    public async start(options: Partial<STTStartOptions> = {}): Promise<void> {
        if (!this.recognition) {
            throw new STTError(
                STTErrorCode.SPEECH_NOT_SUPPORTED,
                "Speech recognition is not supported in this browser."
            );
        }

        try {
            if (navigator.permissions) {
                const status = await navigator.permissions.query({
                    name: "microphone" as PermissionName,
                });
                if (status.state === "denied") {
                    throw new STTError(
                        STTErrorCode.PERMISSION_DENIED,
                        "Microphone permission was denied."
                    );
                }
            }

            const {
                lang = "en-US",
                continuous = true,
                interimResults = true,
            } = options;

            this.recognition.lang = lang;
            this.recognition.continuous = continuous;
            this.recognition.interimResults = interimResults;
            this.finalTranscript = "";

            this.recognition.start();
        } catch (err) {
            const error =
                err instanceof STTError
                    ? err
                    : new STTError(STTErrorCode.GENERAL_ERROR, (err as Error).message);

            this.emit("error", error);
            throw error;
        }
    }

    public stop(): void {
        this.recognition?.stop();
    }

    public abort(): void {
        this.recognition?.abort();
    }

    public isRecognizing(): boolean {
        return this.recognizing;
    }

    public dispose(): void {
        this.stop();
        this.removeAllListeners();
        this.recognition = undefined;
    }
}
