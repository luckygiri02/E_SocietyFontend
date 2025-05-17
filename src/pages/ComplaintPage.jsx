import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import "./ComplaintPage.css";

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    date: "",
    area: "",
    unit: "",
    description: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserContext);

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        area: userData.wingNumber || "",
        unit: userData.flatNo || ""
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        file: {
          data: reader.result.split(",")[1], // base64 data
          contentType: file.type,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      alert("User not logged in.");
      return;
    }

    const complaintPayload = {
      username: userData.fullName,
      flatNo: formData.unit,
      wing: formData.area,
      subject: formData.title,
      description: formData.description,
      submittedDate: formData.date,
      status: "pending",
      adminResponse: "",
      evidenceImage: formData.file || null,
      mobileNumber: userData.mobileNumber // Include mobile number for reference
    };

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintPayload),
      });

      if (!response.ok) throw new Error("Submission failed");

      alert("Complaint submitted successfully!");
      setFormData({
        ...formData,
        type: "",
        title: "",
        date: "",
        description: "",
        file: null,
      });
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complaint-page">
      <div className="sidebar1">
        <h2>SocietyName</h2>
        <nav>
          <a href="/homepage">Home Page</a>
          <a href="/complaint-history">History</a>
          <a href="/complaints-reply">Complaints Reply</a>
        </nav>
      </div>

      <main className="form-section">
        <h2>
          <span role="img" aria-label="folder">📁</span> New Complaint
        </h2>
        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="row">
            <label>Complaint Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              required
              disabled={isLoading}
            >
              <option value="">Select Type</option>
              <option value="Maintenance">Maintenance Issue</option>
              <option value="Noise">Noise Complaint</option>
              <option value="Parking">Parking Issue</option>
              <option value="Security">Security Concern</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="row">
            <input
              type="text"
              name="title"
              placeholder="Complaint Title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <input
              type="date"
              name="date"
              placeholder="Date of Incident"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="row">
            <input
              type="text"
              name="area"
              placeholder="Wing Number"
              value={formData.area}
              readOnly
            />
            <input
              type="text"
              name="unit"
              placeholder="Flat Number"
              value={formData.unit}
              readOnly
            />
          </div>

          <div className="row">
            <textarea
              name="description"
              placeholder="Describe the Issue"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="row classforattactment">
            <label>Attach any evidence (Optional)</label>
            <input
            className="inputfileclass"
              type="file"
              name="file"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isLoading}
            />
          </div>

          <div className="row">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ComplaintPage;