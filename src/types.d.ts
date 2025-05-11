declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    var SpeechRecognition: {
        prototype: SpeechRecognition;
        new(): SpeechRecognition;
    };

    var webkitSpeechRecognition: {
        prototype: SpeechRecognition;
        new(): SpeechRecognition;
    };
}

export { };

declare global {
    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        maxAlternatives: number;

        // Instance Methods
        abort(): void;
        start(): void;
        stop(): void;

        // Event Handlers (as event handler properties)
        onaudioend: (this: SpeechRecognition, ev: Event) => any;
        onaudiostart: (this: SpeechRecognition, ev: Event) => any;
        onend: (this: SpeechRecognition, ev: Event) => any;
        onerror: (this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any;
        onnomatch: (this: SpeechRecognition, ev: Event) => any;
        onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
        onsoundend: (this: SpeechRecognition, ev: Event) => any;
        onsoundstart: (this: SpeechRecognition, ev: Event) => any;
        onspeechend: (this: SpeechRecognition, ev: Event) => any;
        onspeechstart: (this: SpeechRecognition, ev: Event) => any;
        onstart: (this: SpeechRecognition, ev: Event) => any;
    }

    interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
        message: string;
    }

    interface SpeechRecognitionResultList {
        item(index: number): SpeechRecognitionResult;
        readonly length: number;
    }

    interface SpeechRecognitionResult {
        readonly isFinal: boolean;
        item(index: number): SpeechRecognitionAlternative;
        readonly length: number;
    }

    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }
}
