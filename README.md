# Pathikatech TTS

Pathikatech TTS is a Text-to-Speech (TTS) application developed using Sarvam AI to provide high-quality voice synthesis. This project features a React frontend and a Node.js/Express backend, with support for heritage-specific glossaries.

## 🚀 Features

- **High-Quality TTS:** Powered by Sarvam AI for natural-sounding voice synthesis.
- **WebSocket Streaming:** Real-time audio streaming for low-latency playback.
- **Custom Glossaries:** Support for uploading and using custom heritage dictionaries (e.g., Heritage_Glossary.xlsx).
- **Interactive UI:** A modern, responsive frontend built with React and Tailwind CSS.
- **Voice Selection:** Multiple voice options to choose from.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Lucide-React** (Icons)
- **Framer Motion** (Animations)

### Backend
- **Node.js**
- **Express.js**
- **WebSocket (ws)**
- **Multer** (File uploads)
- **Axios** (API requests)

## 🤝 Contributors

This project was built with the combined efforts of:
- **Master Jayan**
- **Himanshu Chaudhari**
- **Tanmay Bothara**

## 📂 Project Structure

- `frontend/`: React-based user interface.
- `backend/`: Express server handling API requests and WebSocket streaming.
- `ml model/`: Contains glossaries and testing scripts for ML-related components.

## ⚙️ Getting Started

### Backend Setup
1. Navigate to the `backend/` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example` and add your `SARVAM_API_KEY`.
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example` and set `VITE_API_URL` and `VITE_WS_URL`.
4. Start the development server: `npm run dev`.

## 📜 License

This project is licensed under the [MIT License](LICENSE).
