import { STTError, STTErrorCode } from "./STTError";

export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}

export class STT {
    private recognition: SpeechRecognition | undefined = undefined;
    private recognizing = false;
    private finalTranscript = '';

    public onStart?: () => void;
    public onEnd?: () => void;
    public onResult?: (finalTranscript: string) => void;
    public onPartialResult?: (interimTranscript: string) => void;
    public onError?: (error: string) => void;

    constructor() {
        if (typeof window === 'undefined') {
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

    private bindEvents() {
        if (!this.recognition) {
            return;
        }
        this.recognition.onstart = () => {
            this.recognizing = true;
            this.onStart?.();
        };

        this.recognition.onend = () => {
            this.recognizing = false;
            this.onEnd?.();
        };

        this.recognition.onerror = (event) => {
            this.onError?.(event.error);
        };

        this.recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript;
                    this.onResult?.(this.finalTranscript.trim());
                } else {
                    interim += transcript;
                }
            }

            if (interim && this.onPartialResult) {
                this.onPartialResult(interim.trim());
            }
        };
    }

    start(options: STTStartOptions) {
        if (!this.recognition) {
            throw new STTError(STTErrorCode.SPEECH_NOT_SUPPORTED, 'Speech recognition not supported');
        }
        this.recognition.lang = options.lang;
        this.recognition.continuous = options.continuous;
        this.recognition.interimResults = options.interimResults;
        this.finalTranscript = '';
        this.recognition?.start();
    }

    stop() {
        this.recognition?.stop();
    }

    abort() {
        this.recognition?.abort();
    }

    isRecognizing() {
        return this.recognizing;
    }

    dispose() {
        if (!this.recognition) {
            return;
        }
    }

}
