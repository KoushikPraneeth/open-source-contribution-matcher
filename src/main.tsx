
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below.
serviceWorkerRegistration.register();
