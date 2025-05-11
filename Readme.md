# Speech-to-Text (STT) Library

## Live Demo

You can view a live demo of the example [here](https://raghavendra-k-j.github.io/stt-js/example/).

## Introduction

The Speech-to-Text (STT) library provides a clean interface for integrating browser-based speech recognition into your web applications using the Web Speech API. It supports real-time transcription, interim results, and continuous listening.

## Installation

```bash
npm install @raghavendra_kj/stt-js
```

## Usage

### Import the Library

```javascript
import { STT } from "@raghavendra_kj/stt-js";
```

### Create an Instance

```javascript
const stt = new STT();
```

### Start Recognition

```javascript
await stt.start();
```

You can also pass options:

```javascript
await stt.start({
  lang: "en-IN",
  continuous: false,
  interimResults: false
});
```

### Stop or Abort Recognition

```javascript
stt.stop(); // Gracefully ends recognition
stt.abort(); // Forcibly ends recognition
```

### Add Event Listeners

```javascript
stt.onResult((text) => {
  console.log("Final result:", text);
});

stt.onPartialResult((text) => {
  console.log("Interim result:", text);
});

stt.onError((error) => {
  console.error("Error occurred:", error);
});
```

### Remove Event Listeners

```javascript
stt.offResult(handler); // Remove a specific listener
stt.removeAllListeners(); // Remove all listeners
```

## API Reference

### `STT.start(options?)`

Starts speech recognition.

**Parameters:**

- `lang` (string): Language code (default: `"en-US"`)
- `continuous` (boolean): If recognition should continue after pauses (default: `true`)
- `interimResults` (boolean): Whether to include interim results (default: `true`)

**Returns:** `Promise<void>`

### `STT.stop()`

Stops the recognition session gracefully.

### `STT.abort()`

Forcibly aborts the recognition session.

### `STT.isRecognizing()`

Returns a boolean indicating whether recognition is currently active.

### `STT.dispose()`

Stops recognition and removes all listeners. Use for cleanup.

### Event Listeners

#### Add Listeners

- `stt.onStart(handler: () => void)`: Triggered when recognition starts.
- `stt.onEnd(handler: () => void)`: Triggered when recognition ends.
- `stt.onResult(handler: (text: string) => void)`: Triggered when a final transcript is available.
- `stt.onPartialResult(handler: (text: string) => void)`: Triggered for interim transcript updates.
- `stt.onError(handler: (error: STTError) => void)`: Triggered when an error occurs.

#### Remove Listeners

- `stt.offStart(handler: () => void)`: Removes a specific "start" listener.
- `stt.offEnd(handler: () => void)`: Removes a specific "end" listener.
- `stt.offResult(handler: (text: string) => void)`: Removes a specific "result" listener.
- `stt.offPartialResult(handler: (text: string) => void)`: Removes a specific "partialResult" listener.
- `stt.offError(handler: (error: STTError) => void)`: Removes a specific "error" listener.
- `stt.removeAllListeners(event?)`: Removes all listeners for a specific event or all events.

## Permissions

If supported, the library uses the Permissions API to check for microphone access.

Errors are reported through the `"error"` events.

## Browser Support

Ensure the target browser supports the Web Speech API (e.g., latest versions of Chrome, Edge).

## Example

A complete working example is available in `example/index.html`.