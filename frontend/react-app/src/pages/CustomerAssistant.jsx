import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import "../styles/AIAssistant.css";
import AnalyticsTable from "../components/AnalyticsTable";
import MetricCard from "../components/MetricCard";
import ProductGrid from "../components/ProductGrid";

function CustomerAssistant() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello ${user?.first_name || "there"} 👋\nI'm your AI Store Assistant.\nAsk me anything about your products, orders or account.`,
    },
  ]);

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    const userQuestion = question; // store before clearing input

    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userQuestion
      }
    ]);
    setQuestion("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/shop/api/ai-query/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
          },
          body: JSON.stringify({
            question: userQuestion
          })
        }
      );

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          ...data//... means simply copy prev data as it is
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong."
        }
      ]);
      console.error(error);
    }
  };

  return (
    <div className="ai-page">
      <h1 className="ai-title">AI Assistant</h1>
      <p className="ai-subtitle">Your intelligent shopping assistant</p>

      {user ? (
        <>
          <div className="chat-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "user" ? "message-row user" : "message-row ai"
                }
              >
                <div className="chat-bubble">
                  {message.text && <p>{message.text}</p>}

                  {message.type === "table" && (
                    <AnalyticsTable data={message.data} />
                  )}

                  {message.type === "metric" && (
                    <MetricCard data={message.data} />
                  )}

                  {message.type === "products" && (
                    <ProductGrid products={message.products}/>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask anything about your orders..."
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
        </>
      ) : (
        <p>Loading your assistant...</p>
      )}
    </div>
  );
}

export default CustomerAssistant;