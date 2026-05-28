"use client";

export default function NewsletterForm() {
  return (
    <form
      className="newsletter-input-group"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thank you for subscribing! Keep an eye on your inbox.");
      }}
    >
      <input
        type="email"
        placeholder="Enter your email address"
        required
        className="newsletter-input"
      />
      <button type="submit" className="newsletter-btn">
        Subscribe
      </button>
    </form>
  );
}
