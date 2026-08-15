import React from "react";
import "../styles/About.css";

function AboutUs() {
  const features = [
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        "Interact with Alacena using natural language to quickly find information, explore products, and assist with administrative tasks.",
    },
    {
      icon: "✨",
      title: "Smart Recommendations",
      description:
        "Discover products tailored to your interests using your browsing activity and purchase history.",
    },
    {
      icon: "🛍️",
      title: "Easy Shopping",
      description:
        "Browse products, search by keywords, filter categories, manage your cart, and place orders through a simple interface.",
    },
    {
      icon: "📦",
      title: "Order Management",
      description:
        "Track your orders and stay informed about changes in order status throughout the purchasing process.",
    },
    {
      icon: "📊",
      title: "Admin Dashboard",
      description:
        "Administrators can manage products, customers, orders, and access useful business insights from one place.",
    },
    {
      icon: "🔔",
      title: "Smart Notifications",
      description:
        "Receive timely updates about important order events and other relevant activities.",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="about-badge">ABOUT Alacena</span>

            <h1>
              Smarter Shopping.
              <span> Smarter Experience.</span>
            </h1>

            <p>
              Alacena is an AI-powered e-commerce platform designed to make
              online shopping more intelligent, personalized, and convenient.
            </p>

            <a href="/" className="about-hero-btn">
              Explore Products
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="about-section">
        <div className="container">
          <div className="about-two-column">
            <div className="about-section-heading">
              <span className="section-label">WHO WE ARE</span>
              <h2>
                More than just an
                <span> online store.</span>
              </h2>
            </div>

            <div className="about-section-text">
              <p>
                Alacena is a full-stack e-commerce platform created to combine
                modern web development with artificial intelligence. It provides
                customers with a smooth shopping experience while giving
                administrators powerful tools to manage and understand their
                online store.
              </p>

              <p>
                From discovering products to receiving personalized
                recommendations and interacting with an AI assistant, Alacena
                brings multiple intelligent features together in one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">WHAT Alacena OFFERS</span>

            <h2>
              Built for a <span>smarter</span> shopping experience.
            </h2>

            <p>
              Alacena combines essential e-commerce functionality with
              intelligent features designed to improve the customer and
              administrator experience.
            </p>
          </div>

          <div className="row g-4 mt-4">
            {features.map((feature, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="ai-section">
        <div className="container">
          <div className="ai-content">
            <div className="ai-text">
              <span className="section-label">INTELLIGENCE BEHIND Alacena</span>

              <h2>
                AI where it actually
                <span> adds value.</span>
              </h2>

              <p>
                Alacena does not use artificial intelligence simply to replace
                traditional application logic. Standard operations such as
                product management, order processing, filtering, and
                calculations are handled through reliable application logic.
              </p>

              <p>
                AI is introduced where intelligent interpretation provides
                additional value — including natural-language assistance,
                personalized recommendations, and intelligent interaction with
                the platform.
              </p>
            </div>

            <div className="ai-box">
              <div className="ai-box-item">
                <strong>Traditional Logic</strong>
                <span>Products • Orders • Search • Filtering</span>
              </div>

              <div className="ai-divider">+</div>

              <div className="ai-box-item">
                <strong>Artificial Intelligence</strong>
                <span>Recommendations • Assistant • Insights</span>
              </div>

              <div className="ai-equals">=</div>

              <div className="ai-result">
                <strong>Alacena</strong>
                <span>Smarter E-Commerce</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="technology-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">TECHNOLOGY</span>

            <h2>
              Powered by modern <span>technologies.</span>
            </h2>

            <p>
              Alacena is built using a combination of modern frontend, backend,
              database, cloud, and AI technologies.
            </p>
          </div>

          <div className="technology-list">
            <div className="technology-item">React</div>
            <div className="technology-item">Vite</div>
            <div className="technology-item">Django</div>
            <div className="technology-item">Django REST Framework</div>
            <div className="technology-item">Python</div>
            <div className="technology-item">Firebase</div>
            <div className="technology-item">AI / LLM</div>
            <div className="technology-item">Bootstrap</div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-card">
            <span className="section-label">OUR GOAL</span>

            <h2>
              Making online shopping
              <span> more intelligent.</span>
            </h2>

            <p>
              Our goal is to demonstrate how a modern e-commerce platform can go
              beyond traditional product listings by combining robust full-stack
              development with AI-powered personalization, assistance, and
              intelligent insights.
            </p>

            <div className="mission-tagline">
              Shop smarter. Discover better. Experience Alacena.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
