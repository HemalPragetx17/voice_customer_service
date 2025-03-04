# Voice Interaction for Customer Service Request

A web application enabling users to interact via voice communication for opening new accounts. The application captures voice input, processes it via backend APIs, and displays a real-time conversation transcript.

## Overview

This project implements a voice assistant for customer service requests using the Web Speech API. The assistant:
- Captures user voice input.
- Transmits the input to a backend API endpoint for processing.
- Converts the API’s text response into audible speech.
- Displays a transcript of the conversation in real time.

The following backend API endpoints are integrated:
- **GET Question:** `POST https://bankingcsapi.techvantage.ai/get_question`
- **Disconnect:** `POST https://bankingcsapi.techvantage.ai/disconnect`

## Features

- **Voice Input:** Uses the Web Speech API to capture and transcribe user speech.
- **Voice Output:** Uses the SpeechSynthesis API to speak the assistant’s responses.
- **Real-Time Transcript:** Displays a running log of the conversation.
- **Error Handling:** Includes error checking for speech recognition and API calls.
- **API Integration:** Seamlessly integrates with provided backend endpoints.

## Prerequisites

- **Node.js:** Version 14 or later is recommended.
- **npm or yarn:** To manage dependencies.
- **Supported Browser:** A browser with Web Speech API support (e.g., Google Chrome).
- **HTTPS:** Required for accessing the microphone (in production).

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/voice-interaction-app.git
   cd voice-interaction-app
