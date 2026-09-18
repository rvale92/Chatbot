# AI Tutor — Certification Study Assistant

A React + TypeScript learning project that explores how an AI assistant can be embedded into a certification-study experience.

## What this project demonstrates

- Building a reusable chat interface in React and TypeScript
- Sending user prompts to a backend endpoint with `fetch`
- Handling loading, error, and empty-response states
- Rendering formatted AI responses
- Integrating an AI-oriented workflow into an existing application

## Current architecture

```text
React / TypeScript UI
        |
        v
Supabase Edge Function endpoint
        |
        v
AI workflow / model backend
```

The current client posts prompts to a configured Supabase Edge Function. Earlier iterations of this project explored n8n and Google Gemini as the workflow/model layer; the backend implementation is not included in this repository.

## Key component

`src/components/AiTutor.tsx` contains the chat experience, including:

- Message state and conversation history
- POST requests to the backend endpoint
- Loading and error handling
- Markdown-capable AI output
- Keyboard submission
- Responsive open/close chat UI

## Tech stack

- React
- TypeScript
- Tailwind CSS
- marked
- Supabase Edge Functions (integration endpoint)

## Run locally

```bash
git clone https://github.com/rvale92/Chatbot.git
cd Chatbot
npm install
npm start
```

## Security note

Do not commit API keys or model credentials to the client. AI-provider credentials should remain in a server-side function or workflow environment.

## Project status

This is a personal learning and portfolio project, not a production service. I use it to practice API integration, AI-assisted workflows, frontend state management, and operational error handling.
