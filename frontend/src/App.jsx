import "./App.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "./components/ui/toaster";

function App(){

  return (
    <div className="App">
      <Toaster /> {/* <- add this line to render the toast container */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;