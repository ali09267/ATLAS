import React, { useEffect, useState } from "react";
import "../styles/Contact.css";

function ContactUs() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("token");

  const formatTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/shop/api/support/messages/", {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load messages");
        }

        setMessages(data.data);
      } catch (error) {
        console.error("Fetch support messages error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchMessages();
    } else {
      setIsLoading(false);
      console.error("No authentication token found.");
    }
  }, [token]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    console.log("My message: ", trimmedMessage);
    if (!trimmedMessage || isSending) {
      return;
    }

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/shop/api/support/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          message: trimmedMessage,
        }),
      });
      console.log("SUPPORT TOKEN:", token);
      console.log("AUTH HEADER:", `Token ${token}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      setMessages((prev) => [...prev, data.data]);

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="contact-page">
      <div className="support-chat">
        <div className="support-header">
          <div className="support-avatar">S</div>

          <div className="support-header-info">
            <h2>Support</h2>

            <p>Usually replies within a few hours</p>
          </div>
        </div>

        <div className="support-messages">
          {isLoading ? (
            <div className="support-loading">Loading conversation...</div>
          ) : messages.length === 0 ? (
            <div className="support-empty">
              <h3>How can we help?</h3>

              <p>
                Send us a message and our support team will get back to you.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isCustomer = msg.sender_role === "customer";

              return (
                <div
                  key={msg.id}
                  className={
                    isCustomer
                      ? "message customer-message"
                      : "message admin-message"
                  }
                >
                  <div className="message-bubble">{msg.message}</div>

                  <div className="message-meta">
                    {isCustomer ? "You" : "Support"}
                    {" • "}
                    {formatTime(msg.created_at)}

                    {isCustomer && (
                      <span className="message-status">
                        {msg.read_at ? " ✓✓" : " ✓"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="support-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={isSending}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            aria-label="Send message"
          >
            {isSending ? "..." : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
