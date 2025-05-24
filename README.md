# Knowde - Personalized Learning Coach Extension

Knowde is a Chrome extension that transforms your browsing experience into structured learning opportunities. It acts as your AI-powered learning companion, creating personalized lesson plans based on your interests and tracking your progress.

## Features

- **Chat Interface**: Ask questions about any topic you want to learn
- **Progress Tracking**: Monitor your daily learning goals and streaks
- **Smart Content Analysis**: Automatically analyzes web pages for learning opportunities
- **Text Highlighting**: Capture and learn from selected text on any webpage
- **Learning Mode**: Toggle focused learning with Alt+K shortcut

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the extension:

   ```bash
   npm run build
   ```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

1. Run development build with watch mode:

   ```bash
   npm run dev
   ```

2. Make changes to the source files in `src/`

3. Reload the extension in Chrome to see changes

## Usage

### Basic Chat

1. Click the Knowde extension icon in your browser toolbar
2. Type what you want to learn about in the input field
3. Receive personalized responses and learning plans

### Learning Mode

1. Press `Alt+K` on any webpage to toggle learning mode
2. Select text you want to learn more about
3. Click "Learn More" when the tooltip appears

### Progress Tracking

- View your daily progress in the popup
- Track concepts learned and maintain learning streaks
- Set and adjust daily learning goals

## Architecture

- **Popup (React)**: Main UI with chat interface and progress tracking
- **Background Script**: Handles message processing and data management
- **Content Script**: Analyzes web pages and captures learning content
- **Tailwind CSS**: Modern, responsive styling

## Future Features

- AI-powered lesson plan generation
- Knowledge graph visualization
- Voice interaction support
- Adaptive learning algorithms
- Integration with external learning platforms

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Chrome Extension Manifest V3
- Webpack for bundling
- Lucide React for icons
