import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/Chatbot.css";
import botIcon from "../images/bot-icon.png"; 
import pandaTyping from "../images/panda-typing.gif";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const apiKey = process.env.REACT_APP_COHERE_API_KEY;
    if (!apiKey) {
      setMessages([...newMessages, { text: "API key is missing!", sender: "bot" }]);
      setIsTyping(false);
      return;
    }

    // Adjust the prompt to handle queries without restrictions
    let adjustedPrompt = input;
    if (input.toLowerCase().includes("fashion")) {
      adjustedPrompt = `You are User's Panda, a fashion expert. Answer the following query: ${input}`;
    } else if (input.toLowerCase().includes("website")) {
      adjustedPrompt = `You are User's Panda, a website assistant. Provide accurate information for this query: ${input}`;
    } else if (input.toLowerCase().includes("shop")) {
      adjustedPrompt = `You are User's Panda, a shopping assistant. Help with this query: ${input}`;
    }

    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command",
          prompt: adjustedPrompt,
          max_tokens: 50,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const botMessage = response.data.generations?.[0]?.text?.trim() || "I didn't understand that.";
      setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response from Cohere API:", error);
      setMessages([...newMessages, { text: "Something went wrong. Please try again later.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to the bottom of messages when a new one is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={`chatbot ${isOpen ? "open" : ""}`} onClick={toggleChatbot}>
      <div className="chatbot-header">
        <img src={botIcon} alt="Chatbot Icon" className="chatbot-icon" />
      </div>
      {isOpen && (
        <div className="chatbot-body" onClick={(e) => e.stopPropagation()}>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
                <div className="message bot typing">
                    <img src={pandaTyping} alt="Typing..." className="typing-indicator" />
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}  

export default Chatbot;
