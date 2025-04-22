import React from "react";
import "../css/Contact.css";
import "../css/fonts.css";

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-content">
        <h2>Contact Us</h2>
        <p>
          To request a custom <b>gelato cake OR yule log cake</b>, please use the form or contact us at:
        </p>
        <table className="contact-table">
          <tbody>
            <tr>
              <td><b>Email:</b></td>
              <td>
                <a className="no-underline contact-link" href="mailto:atelierrosso1@gmail.com">
                  atelierrosso1@gmail.com
                </a>
              </td>
            </tr>
            <tr>
              <td><b>Phone:</b></td>
              <td>
                <a className="no-underline contact-link" href="tel:+16138248184">
                  (613) 824-8184
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <p><b>Or fill out this form:</b></p>
        <form
          action="mailto:atelierrosso1@gmail.com"
          method="get"
          encType="text/plain"
          className="contact-form"
        >
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="body" rows="8" required></textarea>
          </div>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
      </div>
    </section>
  );
}