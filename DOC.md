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
- Implements a sophisticated fingerprinting method to identify users across sessions

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

9. **User Fingerprinting**: Implements a sophisticated method to create a unique fingerprint for each user, replacing traditional methods like MAC address or device ID.

The `userTracker.js` script uses a combination of browser and hardware characteristics to create a unique fingerprint for each user. This method is necessary because traditional identification methods like MAC addresses or device IDs are no longer accessible due to privacy concerns and restrictions imposed by modern browsers and operating systems.

The fingerprinting method in `userTracker.js` uses the following components:

- User agent string
- Language settings
- Screen color depth
- Screen resolution
- Timezone offset
- Available storage (session and local)
- WebGL vendor and renderer information

These components are combined and hashed to create a unique identifier that remains consistent across sessions for the same device and browser, while still respecting user privacy.

Usage:

To use the `userTracker.js` script, include it in your HTML file:

```html
<script src="userTracker.js"></script>
```

The script will automatically initialize and start tracking user interactions.

### 12.2 Widget Integration

The `userTracker.js` script provides a global `onWidgetSubmit` function that widgets can use to report their specific interactions. This function is triggered when a widget is submitted, allowing widgets to send additional data to the server.

To use the `onWidgetSubmit` function, widgets need to call it with the specific interaction data:

```javascript
onWidgetSubmit({
    widgetId: "your-widget-id",
    action: "specific-action",
    data: {
        additionalData: "value"
    }
});
```

This will send the interaction data to the server, which can then be used for analysis and reporting.

### 12.3 Widget Templates

The `userTracker.js` script supports two display modes for widgets:

1. **Modal Mode**: Displays the widget in a modal dialog.
2. **Embedded Mode**: Embeds the widget directly into the page.

To specify the display mode, include the `data-display-mode` attribute in the script tag:

```html
<script src="userTracker.js" data-display-mode="modal"></script>
```

This will ensure that the widget is displayed in a modal dialog.

### 12.4 Widget Templates

The `userTracker.js` script supports two display modes for widgets:

1. **Modal Mode**: Displays the widget in a modal dialog.
2. **Embedded Mode**: Embeds the widget directly into the page.

To specify the display mode, include the `data-display-mode` attribute in the script tag:

```html
<script src="userTracker.js" data-display-mode="modal"></script>
```

This will ensure that the widget is displayed in a modal dialog.

### 12.5 Widget Templates

The `userTracker.js` script supports two display modes for widgets:

1. **Modal Mode**: Displays the widget in a modal dialog.
2. **Embedded Mode**: Embeds the widget directly into the page.

To specify the display mode, include the `data-display-mode` attribute in the script tag:

```html
<script src="userTracker.js" data-display-mode="modal"></script>
```

This will ensure that the widget is displayed in a modal dialog.
