import { useAuth } from "../auth/AuthContext";
import { useState, useRef, useEffect } from "react";
import "../styles/AIAssistant.css";
import AnalyticsTable from "../components/AnalyticsTable";
import MetricCard from "../components/MetricCard";
import ProductGrid from "../components/ProductGrid";
import OrdersList from "../components/OrdersList";

function CustomerAssistant() {
  const { user } = useAuth(); //getting curr logged in user

  const [question, setQuestion] = useState(""); //update user Qs

  const initialMsg = {
    sender: "ai",
    text: `Hello ${user?.first_name || "there"} 👋
I'm your AI Store Assistant.
Ask me anything about your products, orders or account.`,
  };

  const [messages, setMessages] = useState(() => {
    const savedMsgs = localStorage.getItem("chat_history");
    if (savedMsgs) {
      return JSON.parse(savedMsgs);
    }
    return [initialMsg];
  });
  const bottomRef = useRef(null); //at the bottomist by default

  useEffect(() => {
    // Scroll to latest message
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

    // Save chat history
    localStorage.setItem("chat_history", JSON.stringify(messages));
    console.log("MY HISTORY ", localStorage.getItem("chat_history"));
  }, [messages]);

  const clearHistory = () => {
    localStorage.removeItem("chat_history"); //deletes saved chat
    setMessages([initialMsg]); //display greetings anyways
  };
  const handleSendMessage = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/shop/api/ai-query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      const data = await response.json();

      let aiMessage = {
        sender: "ai",
        type: data.type,
      };
      switch (data.type) {
        case "chat":
          aiMessage.text = data.message;
          break;

        case "metric":
          aiMessage.data = data;
          break;

        case "table":
          aiMessage.data = data.data;
          break;

        case "products":
          aiMessage.text = data.message;
          aiMessage.products = data.products;
          break;

        case "orders":
          aiMessage.orders = data.orders;
          break;

        case "not_found":
          aiMessage.text = data.message;
          aiMessage.categories = data.available_categories;
          break;
      }

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

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
      <div className="assistant-header">
        <div className="assistant-text">
          <h1 className="ai-title">AI Assistant</h1>

          <p className="ai-subtitle">Your intelligent shopping assistant</p>
        </div>

        <button
          className="btn btn-primary clear-history-btn"
          onClick={clearHistory}
        >
          Clear History
        </button>
      </div>

      {user ? (
        <>
          <div className="chat-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === "user"
                    ? "message-row user"
                    : "message-row ai"
                }
              >
                <div
                  className={
                    message.sender === "user"
                      ? "chat-bubble user-bubble"
                      : "chat-bubble ai-bubble"
                  }
                >
                  {message.text && <p>{message.text}</p>}

                  {message.type === "table" && (
                    <AnalyticsTable data={message.data} />
                  )}

                  {message.type === "metric" && (
                    <MetricCard data={message.data} />
                  )}

                  {message.type === "products" && (
                    <ProductGrid products={message.products} />
                  )}

                  {message.type === "orders" && (
                    <OrdersList orders={message.orders} />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          <div className="chat-input-wrapper">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask anything about your orders..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
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
