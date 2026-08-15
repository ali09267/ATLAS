import React, { useState, useEffect } from "react";
import "../styles/Contact.css";

function ContactUs() {
  function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== "") {
      document.cookie.split(";").forEach((cookie) => {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        }
      });
    }

    return cookieValue;
  }

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/shop/api/csrf/");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/shop/api/contact-us/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      console.log("Response status:", response.status);
      console.log("Response text:", text);

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON:", error);
        }
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            `Request failed with status ${response.status}`,
        );
      }
      setSuccessMessage(
        data.message || "Your message has been sent successfully.",
      );

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setErrorMessage(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <span className="contact-label">GET IN TOUCH</span>

          <h1 id="heading">Contact Us</h1>

          <p>
            Have a question, suggestion, or issue? Send us a message and our
            team will get back to you.
          </p>
        </div>

        <div className="contact-card">
          <form onSubmit={handleSubmit}>
            {/* First + Last Name */}
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="first_name">First Name</label>

                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="last_name">Last Name</label>

                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="contact-field">
              <label htmlFor="email">Email Address</label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Message */}
            <div className="contact-field">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows="6"
                required
              />
            </div>

            {successMessage && (
              <div className="contact-success">✓ {successMessage}</div>
            )}

            {errorMessage && (
              <div className="contact-error">{errorMessage}</div>
            )}

            <button
              type="submit"
              className="contact-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
