import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// StrictMode intentionally omitted: the WebGL stage and SplitType mutate the DOM imperatively.
createRoot(document.getElementById("root")!).render(<App />);
