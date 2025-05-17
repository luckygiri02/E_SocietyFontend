import React, { useState } from "react";

const PropertyForm = ({ closeForm }) => {
  const [formData, setFormData] = useState({
    flatNo: "",
    wing: "",
    userName: "",
    mobileNumber: "",
    price: "",
    type: "sell",
    eligibility: "",
    visitTime: "",
    image: null,
    video: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/properties`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error submitting property');
      }

      const data = await response.json();
      alert("Property added successfully!");
      closeForm(); // Close the form after submission
    } catch (err) {
      console.error("Error uploading property:", err);
      alert("Error submitting property. Please try again.");
    }
  };

  return (
    <div className="property-form">
      <h2>Sell Your Property</h2>
      <form onSubmit={handleSubmit}>
        <label>Flat No:</label>
        <input
          type="text"
          name="flatNo"
          value={formData.flatNo}
          onChange={handleChange}
        />
        <label>Wing:</label>
        <input
          type="text"
          name="wing"
          value={formData.wing}
          onChange={handleChange}
        />
        <label>Owner Name:</label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <label>Eligibility:</label>
        <input
          type="text"
          name="eligibility"
          value={formData.eligibility}
          onChange={handleChange}
        />
        <label>Visit Time:</label>
        <input
          type="text"
          name="visitTime"
          value={formData.visitTime}
          onChange={handleChange}
        />
        <label>Property Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
          <option value="both">Both</option>
        </select>
        <label>Image:</label>
        <input type="file" name="image" onChange={handleFileChange} />
        <label>Video:</label>
        <input type="file" name="video" onChange={handleFileChange} />
        <button type="submit">Submit</button>
        <button type="button" onClick={closeForm}>Cancel</button>
      </form>
    </div>
  );
};

export default PropertyForm;
