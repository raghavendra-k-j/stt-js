export enum STTErrorCode {
  SPEECH_NOT_SUPPORTED = "SPEECH_NOT_SUPPORTED",
  GENERAL_ERROR = "GENERAL_ERROR"
}

export class STTError extends Error {
  code: STTErrorCode;

  constructor(code: STTErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'SpeechError';
  }
}
