import React from 'react';
import './FAQPage.css'; // For custom styling

const FAQPage = () => {
  const faqs = [
    {
      question: 'How can I rent a flat in the society?',
      answer: 'You can rent a flat by contacting the management through our Rent Portal. Select the flat you want, and follow the booking instructions.',
    },
    {
      question: 'What is the monthly rent range for flats?',
      answer: 'The rent for flats ranges between ₹10,000 to ₹40,000 depending on the size and amenities.',
    },
    {
      question: 'Are utilities included in the rent?',
      answer: 'Utilities such as water, electricity, and internet are typically not included in the rent and are billed separately.',
    },
    {
      question: 'Can I schedule a visit to the flats?',
      answer: 'Yes, you can schedule a visit by contacting the management team or using the Rent Portal.',
    },
    {
      question: 'What documents are required to rent a flat?',
      answer: 'Required documents include a government-issued ID, proof of address, and employment details. Additional documents may be requested based on the flat type.',
    },
    // Add more questions and answers as needed
  ];

  return (
    <div className="faq-page">
      <header className="faq-header">
        <h1>Frequently Asked Questions (FAQ)</h1>
      </header>

      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
