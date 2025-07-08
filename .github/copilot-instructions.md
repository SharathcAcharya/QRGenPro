<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# QRloop - Advanced QR Code Generator

This is a React-based QR code generator application with the following key features:

## Tech Stack
- **Frontend**: React with Vite
- **Styling**: Tailwind CSS with dark mode support
- **QR Generation**: qr-code-styling library for advanced customization
- **Icons**: Lucide React
- **Responsive Design**: Mobile-first approach

## Key Features
- Real-time QR code generation from URLs
- Logo/image embedding in QR codes
- Color and style customization (foreground, background, dot shapes)
- Dark mode toggle
- Download functionality (PNG format)
- Mobile responsive design
- Local storage for QR history

## Component Structure
- `App.jsx` - Main application container with dark mode context
- `QRGenerator.jsx` - Core QR generation component
- `QRCustomizer.jsx` - Customization controls component
- `QRPreview.jsx` - QR code display and download component
- `DarkModeToggle.jsx` - Theme switching component

## Code Guidelines
- Use functional components with React hooks
- Implement responsive design with Tailwind CSS classes
- Follow modern JavaScript ES6+ syntax
- Ensure accessibility with proper ARIA labels
- Use semantic HTML elements
- Optimize for mobile-first design

## State Management
- Use React's built-in useState and useContext for state management
- Implement dark mode with context provider
- Use local storage for persisting user preferences and QR history
