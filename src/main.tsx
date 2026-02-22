import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";

// Lazy import App to prevent Supabase client initialization from crashing
// if env vars aren't available yet
async function init() {
  try {
    const { default: App } = await import("./App.tsx");
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Failed to initialize app:", error);
    const root = document.getElementById("root")!;
    root.innerHTML = `
      <div style="padding: 2rem; font-family: Inter, sans-serif; text-align: center; margin-top: 4rem;">
        <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Loading Error</h1>
        <p style="color: #666; margin-bottom: 1rem;">
          The application failed to initialize. This is usually a temporary issue.
        </p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1.5rem; background-color: #006699; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 1rem;">
          Refresh Page
        </button>
      </div>
    `;
  }
}

init();
