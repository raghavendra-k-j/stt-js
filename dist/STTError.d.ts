export declare enum STTErrorCode {
    SPEECH_NOT_SUPPORTED = "SPEECH_NOT_SUPPORTED",
    GENERAL_ERROR = "GENERAL_ERROR"
}
export declare class STTError extends Error {
    code: STTErrorCode;
    constructor(code: STTErrorCode, message: string);
}
