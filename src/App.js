// APP.JS
import { useState } from "react";
import "./App.css";
import { sendMessageToOpenAi } from "./components/Openai";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, isUser: true },
    ]);

    const response = await sendMessageToOpenAi(input);

    const isCode = input.toLowerCase().includes("code");
    const formattedResponse = isCode ? `<code>${response}</code>` : response;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: formattedResponse, isUser: false },
    ]);

    setInput("");
  };

  return (
    <div className="App">
      <div className="title">
        <h1>ASK ARIEL</h1>
        <p>Powered by Openai API</p>
      </div>
      <div className="container">
        <div className="chat">
          {messages.map((message, index) => (
            <div
              key={index}
              className={message.isUser ? "user-message" : "bot-message"}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="input-container">
          <input
            placeholder="Type a message.."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button onClick={handleSend}>SEND</button>
        </div>
      </div>
      <h2>JOHN ARIEL YAP | 2023</h2>
    </div>
  );
}

export default App;
