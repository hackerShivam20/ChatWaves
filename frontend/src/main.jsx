import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "./components/ui/provider";
import App from './App.jsx'
import ChatProvider from './context/ChatProvider.jsx';

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <ChatProvider>
        <Provider>
          <App />
        </Provider>
      </ChatProvider>
    </BrowserRouter>
);