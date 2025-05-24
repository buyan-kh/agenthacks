# Knowde - AI-Powered Learning Companion

Knowde is a comprehensive learning platform that combines a Chrome extension with a full web application to provide personalized, AI-driven learning experiences. It serves as your intelligent learning coach, helping you master new concepts through adaptive lesson plans, progress tracking, and interactive features.

## 🌟 Features

### Chrome Extension

- **Quick Access Learning**: Generate lesson plans directly from your browser
- **Context-Aware Learning**: Analyze current webpage content for learning opportunities
- **Progress Tracking**: Monitor your daily learning streak and concept mastery
- **AI Chat Assistant**: Get instant help with learning questions
- **Seamless Integration**: Easy access to the full web application

### Web Application

- **User Authentication**: Secure login and registration system
- **Personalized Dashboard**: Track progress, goals, and learning statistics
- **Learning Goals Management**: Set, track, and achieve learning objectives
- **Concept Explorer**: Discover interconnected learning concepts with mastery tracking
- **Study Plans**: Structured lesson plans with progress monitoring
- **Interactive Quizzes**: Test knowledge with detailed explanations
- **AI-Powered Chat**: Intelligent learning assistant (Nodi)

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Auth (ready for integration)
- **Database**: Firestore (ready for integration)
- **Extension**: Chrome Manifest V3

### Project Structure

```
agenthacks/
├── knowde-extension/          # Chrome Extension
│   ├── src/
│   │   ├── popup/            # Extension popup UI
│   │   ├── background/       # Service worker
│   │   ├── content/          # Content scripts
│   │   └── types/            # TypeScript definitions
│   ├── public/               # Extension assets
│   └── dist/                 # Built extension
├── knowde-webapp/            # Web Application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── goals/        # Learning goals
│   │   │   ├── concepts/     # Concept explorer
│   │   │   ├── study/        # Study plans
│   │   │   ├── quiz/         # Quiz system
│   │   │   ├── layout/       # Layout components
│   │   │   └── common/       # Shared components
│   │   ├── contexts/         # React contexts
│   │   ├── types/            # TypeScript definitions
│   │   └── styles/           # CSS and styling
│   └── public/               # Static assets
└── backend/                  # Backend API (future)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Chrome browser for extension testing
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd agenthacks
   ```

2. **Set up the Web Application**

   ```bash
   cd knowde-webapp
   npm install
   npm start
   ```

   The web app will be available at `http://localhost:3000`

3. **Set up the Chrome Extension**

   ```bash
   cd ../knowde-extension
   npm install
   npm run build
   ```

4. **Load the Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `knowde-extension/dist` folder
   - The Knowde extension should now appear in your browser

## 🎨 Design System

### Color Palette

- **Primary**: `#6B73FF` (kn-primary)
- **Secondary**: `#A8B3FF` (kn-secondary)
- **Accent**: `#FF6B9D` (kn-accent)
- **Surface**: `#F8F9FF` (kn-surface)
- **Success**: `#10B981` (kn-success)
- **Warning**: `#F59E0B` (kn-warning)
- **Error**: `#EF4444` (kn-error)

### Typography

- **Display Font**: Space Grotesk
- **Body Font**: Inter
- **Font Weights**: 300, 400, 500, 600, 700

### Components

- Custom button styles (primary, secondary, ghost)
- Input fields with focus states
- Card components with shadows
- Sidebar navigation
- Progress bars and indicators

## 🔧 Development

### Chrome Extension Development

```bash
cd knowde-extension
npm run dev        # Development build with watch
npm run build      # Production build
npm run type-check # TypeScript checking
```

### Web Application Development

```bash
cd knowde-webapp
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

### Key Development Features

- **Hot Reload**: Both extension and web app support hot reloading
- **TypeScript**: Full type safety across the project
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Reusable components with consistent styling
- **Mock Data**: Realistic mock data for development and testing

## 📱 Usage

### Chrome Extension

1. Click the Knowde icon in your browser toolbar
2. Use the dashboard to track your learning progress
3. Generate lesson plans by typing what you want to learn
4. Chat with Nodi for learning assistance
5. Click the "Open Full App" button to access the web application

### Web Application

1. Visit `http://localhost:3000`
2. Sign up or log in (currently uses mock authentication)
3. Set learning goals and track progress
4. Explore concepts and their relationships
5. Follow structured study plans
6. Take quizzes to test your knowledge
7. Chat with the AI assistant for help

## 🔮 Future Enhancements

### Planned Features

- **Real AI Integration**: Connect with OpenAI, Claude, or other AI services
- **Firebase Integration**: Real user authentication and data persistence
- **Spaced Repetition**: Intelligent review scheduling
- **Social Learning**: Share progress and compete with friends
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Detailed learning insights and recommendations
- **Content Creation**: User-generated learning materials
- **Offline Support**: Learn without internet connection

### Technical Improvements

- **Performance Optimization**: Code splitting and lazy loading
- **Testing**: Comprehensive unit and integration tests
- **CI/CD Pipeline**: Automated testing and deployment
- **Accessibility**: WCAG compliance and screen reader support
- **Internationalization**: Multi-language support
- **PWA Features**: Service workers and offline capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the established component patterns
- Maintain consistent styling with Tailwind CSS
- Write meaningful commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern learning platforms and educational tools
- **Icons**: Lucide React icon library
- **Fonts**: Google Fonts (Inter and Space Grotesk)
- **Color Palette**: Carefully crafted for accessibility and aesthetics
- **Community**: Open source contributors and the learning community

---

**Built with ❤️ for learners everywhere**

For questions, suggestions, or support, please open an issue or reach out to the development team.
