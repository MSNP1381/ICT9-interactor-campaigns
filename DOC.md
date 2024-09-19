# Interactive Advertising Dashboard - Frontend Documentation

## 1. Project Overview

The Interactive Advertising Dashboard is a comprehensive web application designed to empower businesses in managing their interactive advertising campaigns. Built with React.js and Ant Design (antd) components, this frontend solution provides a robust and user-friendly interface for creating, managing, and analyzing campaigns, discounts, and interactive widgets.

## 2. Technology Stack

- **React.js**: Core library for building the user interface
- **TypeScript**: Adds static typing to enhance code quality and developer experience
- **Ant Design (antd)**: UI component library for a consistent and professional look
- **Vite**: Build tool and development server for fast development and optimized production builds
- **React Router**: Handles routing within the application
- **Axios**: HTTP client for making API requests
- **Nunjucks**: Templating engine for rendering widget previews
- **Recharts**: Library for creating responsive charts and graphs
- **Framer Motion**: Animation library for enhanced user experience

## 3. Project Structure

The project follows a modular structure, organizing components, pages, and utilities into separate directories:
src/
├── api/
├── assets/
├── components/
│ ├── Campaigns/
│ ├── Dashboard/
│ ├── Discounts/
│ ├── Widgets/
│ └── common/
├── pages/
├── styles/
├── utils/
├── App.tsx
└── main.tsx

## 4. Key Features

### 4.1 Landing Page

The landing page (`src/pages/LandingPage.tsx`) serves as the entry point for users, providing an overview of the platform's capabilities:

- Engaging hero section with a call-to-action
- Feature highlights showcasing key functionalities
- Smooth animations using Framer Motion for an enhanced user experience

### 4.2 Dashboard

The main application dashboard provides an overview of key metrics and quick actions.

### 4.3 Campaign Management

Comprehensive tools for creating, editing, and analyzing advertising campaigns.

### 4.4 Widget Management

The Widgets page (`src/pages/WidgetsPage.tsx`) allows users to create and manage interactive widgets:

- List view of existing widgets
- Widget creation interface with template selection
- Widget editing and preview functionality

### 4.5 User Tracking

A client-side tracking script (`public/userTracker.js`) is implemented to collect user interaction data:

- Tracks page views, widget interactions, and other relevant user actions
- Sends collected data to the backend for analysis

## 5. Routing and Application Structure

The main application structure and routing are defined in `src/App.tsx`:

- Utilizes React Router for navigation
- Implements protected routes using an AuthGuard component
- Defines the overall layout structure using Ant Design's Layout components

## 6. API Integration

API calls are centralized in the `src/api/` directory. The application uses an OpenAPI specification (`public/openapi.json`) to define the API structure and endpoints.

## 7. Widget Templates

Widget templates, such as `templates/banner.jinja`, are used to generate interactive elements that can be embedded in campaigns.

## 8. Build and Development

The project uses Vite for both development and production builds:

- Development: `npm run dev`
- Production build: `npm run build`
- Preview production build: `npm run preview`

The entry point for the application is `src/main.tsx`, which renders the main App component.

## 9. Version Control

The project uses Git for version control. The `.gitignore` file is configured to exclude unnecessary files and directories from the repository.

## 10. Examples and Documentation

- `examples/blog-post.html` provides a sample implementation of how widgets can be embedded in external web pages.
- The OpenAPI specification (`openapi.json`) serves as both documentation and a contract for the API endpoints.

## 11. Future Improvements

- Implement more comprehensive unit and integration tests
- Enhance error handling and user feedback throughout the application
- Implement more advanced analytics features and visualizations
- Consider adding a theme switcher for light/dark mode

## 12. User Tracking and Widget Integration

### 12.1 User Tracker (userTracker.js)

The `userTracker.js` script is a crucial component of the Interactive Advertising Dashboard, responsible for tracking user interactions and integrating widgets into web pages. This client-side script is designed to be easily embedded in any webpage and provides powerful tracking and widget display capabilities.

Key features of `userTracker.js`:

1. **Initialization**: The script initializes itself using data attributes from its script tag, including `data-campaign-id`, `data-widget-id`, and `data-display-mode`.

2. **Page Information Tracking**: Captures basic page information, including URL and localStorage data.

3. **User Action Tracking**: Records various user actions such as clicks, form submissions, and custom events.

4. **Widget Loading**: Dynamically loads widget content either in a modal or embedded in the page, depending on the specified display mode.

5. **Device Identification**: Generates a unique device ID based on various browser and hardware characteristics for consistent user tracking across sessions.

6. **Data Transmission**: Sends collected data to the server, including user actions, widget interactions, and page information.

7. **Modal Creation**: For widgets displayed in modal mode, creates and manages a modal dialog to show the widget content.

8. **Widget Interaction Handling**: Provides a global `onWidgetSubmit` function for widgets to report their specific interactions.

Usage:

```html
<script src="path/to/userTracker.js"
data-campaign-id="your-campaign-id"
data-widget-id="your-widget-id"
data-display-mode="modal"></script>
```

### 12.2 Widget Templates

The Interactive Advertising Dashboard uses a set of customizable widget templates to create engaging interactive elements for advertising campaigns. These templates are designed to be flexible and easily integrated with the `userTracker.js` script.

#### 12.2.1 Multi-Choice Question (multi.jinja)

This template creates a multi-choice question widget with an image and customizable options.

Features:

- Displays a main question or title
- Shows an optional image
- Presents multiple choice options as buttons
- Records the user's selection
- Sends the selected choice to the `userTracker` when submitted

#### 12.2.2 Banner (banner.jinja)

A simple yet effective banner widget that can be used for various advertising purposes.

Features:

- Displays a clickable banner image
- Customizable image source and alt text
- Tracks banner clicks and reports them to the `userTracker`

#### 12.2.3 Wheel of Fortune (fortune.jinja)

An interactive "Wheel of Fortune" style game that engages users with a spinning wheel and prizes.

Features:

- Customizable wheel sectors with different colors and labels
- Animated wheel spinning effect
- Displays a congratulations message with the won prize
- Reports the game result to the `userTracker`

#### 12.2.4 Atari Pong Game (atari-pong-game.jinja)

A classic Pong game implementation that provides an engaging, interactive experience for users.

Features:

- Fully functional Pong game with player vs. computer gameplay
- Customizable game parameters (winning score, ball speed, etc.)
- Tracks game progress and final scores
- Reports game results to the `userTracker`

### 12.3 Integration of Widgets and User Tracker

The widget templates are designed to work seamlessly with the `userTracker.js` script. They utilize the `window.onWidgetSubmit` function provided by the user tracker to report specific interactions and results.

For example, in the multi-choice question widget:

```javascript
sendButton.addEventListener('click', () => {
if (selectedChoice && window.onWidgetSubmit) {
window.onWidgetSubmit({ choice: selectedChoice });
}
});
```

This integration allows for consistent tracking and data collection across different widget types, providing valuable insights into user engagement and campaign performance.

## 13. Conclusion

The combination of the `userTracker.js` script and the diverse set of widget templates provides a powerful and flexible system for creating interactive advertising campaigns. This system allows for easy deployment of engaging content while collecting valuable user interaction data, enabling businesses to optimize their advertising strategies based on real-world performance metrics.
