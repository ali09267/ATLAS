import { useState } from "react";
import "../styles/AIAssistant.css";
import AnalyticsTable from "../components/AnalyticsTable";
import MetricCard from "../components/MetricCard";

function AIAssistant() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Ali 👋\nI'm your AI Store Assistant.\nAsk me anything about your products, customers, orders or revenue.",
    },
  ]);

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    const userQuestion = question; //since we are about to clear the input (question state), we need to store it in a variable

    setMessages((prev) => [
      // Add the user's question to all the previous messages
      ...prev, //represents all the previous messages
      {
        sender: "user", //the user is the sender of this message
        text: userQuestion,
      },
    ]);
    setQuestion(""); //clear the input field
    try {
      const token = localStorage.getItem("token");
      console.log("Token being sent:", token);

      const response = await fetch("http://127.0.0.1:8000/shop/api/ai-query/", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },

        body: JSON.stringify({
          //send the user's question to the backend
          question: userQuestion,
        }),
      });

      const data = await response.json();
      console.log("AI RESPONSE FROM BACKEND:", data);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.message || null,
          type: data.type, //the type of the response (text, table, or metric)
          data: data, //actual content it have
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong.",
        },
      ]);
    }
  };

  return (
    <div className="ai-page">
      <h1 className="ai-title">AI Assistant</h1>

      <p className="ai-subtitle">Your intelligent analytics assistant</p>

      <div className="chat-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "user" ? "message-row user" : "message-row ai"
            }
          >
            <div
              className={
                message.sender === "user"
                  ? "chat-bubble user-bubble"
                  : "chat-bubble ai-bubble"
              }
            >
              {message.text && <div>{message.text}</div>}

              {message.type === "table" && (
                <AnalyticsTable data={message.data} />
              )}

              {message.type === "metric" && <MetricCard data={message.data} />}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask anything about your store..."
          value={question}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          onChange={(e) => setQuestion(e.target.value)}
          autoFocus
        />

        <button className="send-btn" onClick={handleSendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default AIAssistant;
