# Pathikatech TTS — Text-to-Speech Web App

A full-stack web application for converting text to speech using **Sarvam AI's bulbul:v3** model. Supports Hindi, English, and 10+ Indian languages with real-time WebSocket streaming.

---

## Features

- 🎙️ **Two voices** — Male (Shubh) and Female (Simran)
- 🌐 **11 Indian languages** — Hindi, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, English
- 📖 **Pronunciation dictionary** — Upload a custom JSON dictionary to improve domain-specific term accuracy
- ⚡ **Real-time WebSocket streaming** — Audio streams in as it's generated for low latency
- ▶️ **Audio player** — Play/pause with progress scrubbing
- ⬇️ **MP3 download** — Save generated audio to your device
- 📱 **Responsive UI** — Works on desktop and mobile

---

## Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS           |
| Backend    | Node.js + Express                        |
| Streaming  | WebSockets (ws library)                  |
| AI Model   | Sarvam AI bulbul:v3                      |
| HTTP Client| Axios                                    |
| File Upload| Multer                                   |

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **Sarvam AI API key** — get one at [https://sarvam.ai](https://sarvam.ai)

---

## Setup

### 1. Clone / Extract

```bash
cd pathikatech-tts
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` and add your Sarvam API key:

```
SARVAM_API_KEY=your_actual_sarvam_api_key_here
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend will start at **http://localhost:3000**.

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Optionally create a `.env` file:

```bash
cp .env.example .env
```

The defaults (`http://localhost:3000` and `ws://localhost:3000/tts-stream`) work without changes.

Start the frontend:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## Usage

1. **Enter text** in the text area (supports Hindi, English, Hinglish, and other Indic languages)
2. **Select a voice** — Shubh (Male) or Simran (Female)
3. **Choose a language** from the dropdown
4. *(Optional)* **Upload a pronunciation dictionary** JSON file for custom pronunciations
5. Click **Generate Speech**
6. Audio streams in real-time — use the **player** to play/pause
7. Click **Download MP3** to save the audio

---

## Pronunciation Dictionary Format

The dictionary must be a `.json` file with this structure:

```json
{
  "pronunciations": {
    "hi-IN": {
      "API": "ay-pee-eye",
      "GitHub": "git-hub"
    },
    "en-IN": {
      "Namaste": "nuh-muh-stey"
    }
  }
}
```

A sample file is provided at `sample-dictionary.json`.

---

## API Endpoints

### REST

| Method | Path              | Description                        |
|--------|-------------------|------------------------------------|
| GET    | `/health`         | Health check                       |
| POST   | `/api/dictionary` | Upload a pronunciation dictionary  |

### WebSocket

**URL**: `ws://localhost:3000/tts-stream`

**Send** (JSON):
```json
{
  "text": "Hello, how are you?",
  "speaker": "shubh",
  "dictId": "optional-dictionary-id",
  "languageCode": "hi-IN"
}
```

**Receive**:
- Binary frames: MP3 audio chunks
- JSON frame on completion: `{ "done": true }`
- JSON frame on error: `{ "error": "error message" }`

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover:
- Dictionary JSON validation
- REST endpoint behavior (mocked Sarvam API)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Required | Default               | Description                  |
|---------------|----------|-----------------------|------------------------------|
| SARVAM_API_KEY| ✅ Yes   | —                     | Your Sarvam AI API key       |
| PORT          | No       | 3000                  | Backend server port          |
| CORS_ORIGIN   | No       | http://localhost:5173 | Allowed frontend origin      |

### Frontend (`frontend/.env`)

| Variable          | Required | Default                           | Description            |
|-------------------|----------|-----------------------------------|------------------------|
| VITE_BACKEND_URL  | No       | http://localhost:3000             | Backend REST URL       |
| VITE_WS_URL       | No       | ws://localhost:3000/tts-stream    | WebSocket URL          |

---

## Project Structure

```
pathikatech-tts/
├── backend/
│   ├── server.js               # Express app + HTTP server
│   ├── websocket.js            # WebSocket server for TTS streaming
│   ├── routes/dictionary.js    # POST /api/dictionary route
│   ├── controllers/dictionaryController.js
│   ├── services/sarvamService.js  # Sarvam API integration
│   ├── middleware/errorHandler.js
│   ├── utils/validators.js     # Dictionary JSON validation
│   └── __tests__/              # Jest tests
├── frontend/
│   └── src/
│       ├── App.jsx             # Main application
│       ├── components/         # UI components
│       ├── hooks/useTTSStream.js  # WebSocket streaming hook
│       ├── utils/              # Helpers and validation
│       └── lib/api.js          # Axios instance
├── sample-dictionary.json      # Example pronunciation dictionary
└── README.md
```

---

## Branding

- Navbar: **Pathikatech**
- Footer: **Pathika Technologies**

---

## License

© Pathika Technologies. All rights reserved.
