import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";

const root = createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
