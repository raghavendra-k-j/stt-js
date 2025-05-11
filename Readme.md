# Speech-to-Text (STT) Library

## Introduction

The Speech-to-Text (STT) library provides a simple interface for integrating browser-based speech recognition into your web applications. It leverages the Web Speech API to enable real-time speech recognition with support for continuous and interim results.

## Installation

To use the STT library, include it in your project by importing the `STT` class from the appropriate file.

```bash
npm install @raghavendra_kj/stt-js
```

## Usage

### Importing the Library

```javascript
import { STT } from "./STT";
```

### Creating an Instance

```javascript
const stt = new STT();
```

### Event Handlers

The library provides the following event handlers for customization:

- `onStart`: Triggered when speech recognition starts.
- `onEnd`: Triggered when speech recognition ends.
- `onResult`: Triggered when a final transcript is available.
- `onPartialResult`: Triggered when interim results are available.
- `onError`: Triggered when an error occurs.

### Starting and Stopping Recognition

Use the `start` method to begin recognition and the `stop` or `abort` methods to end it.

```javascript
stt.start({
  lang: "en-US",
  continuous: true,
  interimResults: true,
});

stt.stop();
```

## Example

Below is an example of how to use the STT library in a web application:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Speech Recognition Demo</title>
    <style>
      body {
        font-family: sans-serif;
        padding: 2rem;
      }
      button {
        font-size: 1.2rem;
        padding: 0.5rem 1rem;
      }
      textarea {
        margin-top: 1rem;
        width: 100%;
        height: 200px;
        font-size: 1rem;
      }
    </style>
  </head>
  <body>
    <h1>Speech Recognition Demo</h1>
    <button id="startBtn">🎙️ Speak</button>
    <textarea
      id="output"
      readonly
      placeholder="Speech will appear here..."
    ></textarea>

    <script type="module">
      import { STT } from "./STT";

      const stt = new STT();
      const startBtn = document.getElementById("startBtn");
      const output = document.getElementById("output");

      let fullText = "";

      stt.onStart = () => {
        startBtn.textContent = "🛑 Stop";
      };

      stt.onEnd = () => {
        startBtn.textContent = "🎙️ Speak";
      };

      stt.onResult = (finalTranscript) => {
        fullText = finalTranscript;
        output.value = fullText;
      };

      stt.onPartialResult = (interimTranscript) => {
        output.value = fullText + interimTranscript;
      };

      stt.onError = (error) => {
        alert("STT Error: " + error);
      };

      let recognizing = false;

      startBtn.onclick = () => {
        if (!recognizing) {
          try {
            stt.start({
              lang: "en-US",
              continuous: true,
              interimResults: true,
            });
            recognizing = true;
          } catch (e) {
            alert("Error: " + e.message);
          }
        } else {
          stt.stop();
          recognizing = false;
        }
      };
    </script>
  </body>
</html>
```

## Notes

- Ensure the browser supports the Web Speech API.
- Handle errors gracefully using the `onError` event.

## Live Demo

You can view a live demo of the example [here](https://github.com/raghavendra-k-j/stt-js).

To try it locally, use the provided `example/index.html` file as a starting point.
