import ReactDOM from "react-dom/client";
import App from "../App";

/**
 * Application Entry Point
 * 
 * This file bootstraps the React application by mounting the root App component.
 * All routing, layout, and global providers are configured in App.tsx
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
