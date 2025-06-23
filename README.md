# AI Tutor Integration

This project contains the AI Tutor widget component for integration with the certification study platform. The tutor uses n8n for backend processing and connects to Google Gemini for AI responses.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure n8n:
   - Set up your n8n workflow
   - Update the N8N_WEBHOOK_URL in src/components/AiTutor.tsx

3. Start the development server:
   ```bash
   npm start
   ```

## Integration with Main Project

1. Copy the `src/components/AiTutor.tsx` file to your main project's components directory
2. Import and add the AiTutor component to your main App:
   ```tsx
   import AiTutor from './components/AiTutor';

   // In your App component:
   <AiTutor />
   ```

3. Ensure you have all required dependencies:
   - react-markdown
   - tailwindcss

## Features

- Real-time chat interface
- Markdown support for AI responses
- Responsive design
- Show/hide animation
- Error handling
- Loading states
- Keyboard shortcuts (Enter to send)

## Customization

The component uses Tailwind CSS for styling. You can customize the appearance by:
1. Modifying the Tailwind classes in AiTutor.tsx
2. Adjusting the color scheme (currently uses blue-600)
3. Changing the dimensions (currently max-w-sm for width)

## n8n Workflow

The n8n workflow should:
1. Accept POST requests with a prompt
2. Process the prompt with context from your study materials
3. Send the prompt to Google Gemini
4. Return the AI response

Make sure to update the N8N_WEBHOOK_URL constant with your actual webhook URL.
