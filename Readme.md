# `@raghavendra_kj/stt-js`

A simple wrapper around the Web Speech API for speech-to-text functionality.

---

## Installation

You can install the package via npm:

```bash
npm install @raghavendra_kj/stt-js
```

---

## Usage

### Import the package

You can import the package in your JavaScript/TypeScript project like this:

```javascript
import { STT } from "@raghavendra_kj/stt-js";
```

### Example usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Speech Recognition Demo</title>
</head>
<body>
    <h1>Speech Recognition Demo</h1>
    <button id="startBtn">🎙️ Speak</button>
    <br><br>
    <textarea id="output" placeholder="Speech will appear here..." readonly rows="10" cols="50"></textarea>

    <script type="module">
        import { STT } from "@raghavendra_kj/stt-js";

        const recognizer = new STT();

        const startBtn = document.getElementById('startBtn');
        const output = document.getElementById('output');

        startBtn.onclick = () => {
            recognizer.toggle();
        };

        recognizer.onStart = () => {
            startBtn.textContent = '🛑 Stop';
        };

        recognizer.onEnd = () => {
            startBtn.textContent = '🎙️ Speak';
        };

        recognizer.onPartialResult = (interimTranscript) => {
            output.value = recognizer.finalTranscript + interimTranscript;
        };

        recognizer.onResult = (finalTranscript) => {
            output.value = finalTranscript;
        };

        recognizer.onError = (error) => {
            alert('Error occurred: ' + error);
        };
    </script>
</body>
</html>
```

### Class `STT`

The `STT` class is the main component of this library.

#### Methods

* **`start(options: STTStartOptions)`**: Starts the speech recognition with options.

    * `options`: An object that contains:

        * `lang`: The language of recognition (e.g., `'en-US'`).
        * `continuous`: Whether to continue listening after the speech ends (default: `true`).
        * `interimResults`: Whether to show partial results (default: `true`).

* **`stop()`**: Stops the recognition.

* **`abort()`**: Aborts the recognition.

* **`isRecognizing()`**: Returns a boolean indicating whether recognition is ongoing.

* **`dispose()`**: Clean up resources when done.

---

## API Events

* **`onStart`**: Triggered when the recognition starts.
* **`onEnd`**: Triggered when the recognition ends.
* **`onPartialResult`**: Triggered with partial (interim) results during recognition.
* **`onResult`**: Triggered with the final recognized result.
* **`onError`**: Triggered if an error occurs during recognition.

---

## Example Options

### `STTStartOptions`

```typescript
export interface STTStartOptions {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
}
```

* `lang`: Language code for speech recognition (e.g., `en-US`).
* `continuous`: If `true`, the recognition will continue even after speech pauses.
* `interimResults`: If `true`, partial results will be returned during the speech.
