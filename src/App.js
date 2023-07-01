import { useState, useEffect, useRef } from "react";
import "./App.css";
import { FiMic } from "react-icons/fi";
import { sendMessageToOpenAi } from "./components/Openai";
import TypingEffect from "./components/TypingEffect";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        setInput((prevInput) => prevInput + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, []);

  const handleSend = async () => {
    setIsTyping(true);

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

    setIsTyping(false);
    setInput("");
  };

  const handleMicPress = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleMicRelease = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
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
              {isTyping && index === messages.length - 1 ? (
                <TypingEffect />
              ) : (
                message.text
              )}
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
          <button
            className="mic-button"
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
          >
            <FiMic />
          </button>

          <button onClick={handleSend}>SEND</button>
        </div>
      </div>
      <h2>JOHN ARIEL YAP | 2023</h2>
    </div>
  );
}

export default App;
