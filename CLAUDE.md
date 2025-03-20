# CLAUDE.md - Urdu Voice Chatbot

## Build Commands
- Start development server: `expo start` or `npm start`
- Run on Android: `expo start --android` or `npm run android`
- Run on iOS: `expo start --ios` or `npm run ios`
- Run on web: `expo start --web` or `npm run web`
- Type check: `npx tsc --noEmit`

## Development Setup
- Install dependencies: `npm install`
- Configure environment: Copy `.env.example` to `.env` and add your OpenAI API key
- Environment variables are loaded using react-native-dotenv

## Project Structure
- `src/components`: Reusable UI components
- `src/hooks`: Custom hooks for state management and logic
- `src/screens`: Screen components
- `src/services`: API services (OpenAI API integration)
- `src/types`: TypeScript interfaces
- `src/utils`: Utility functions

## Code Style Guidelines
- Use functional components with hooks, avoid class components
- Prefer named exports over default exports
- Group imports: React first, third-party next, local imports last
- Follow TypeScript strict mode with explicit types
- Component props must have explicit interfaces in `types/index.ts`
- Handle errors with try/catch blocks and proper user feedback
- Organize related functionality into custom hooks
- Keep components focused on UI, move business logic to hooks/services
- Naming: PascalCase for components, camelCase for functions/variables
- Secure sensitive data (API keys) in environment variables, never hardcode