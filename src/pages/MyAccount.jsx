import React, { useState, useEffect } from "react";
import './ProfileLayout.css';

const MyAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    flatNo: "",
    wingNumber: "",
    role: "",
    occupation: "",
    adharCard: "",
    password: "",
    familyMembers: [],
    documents: [],
  });

  const [editMode, setEditMode] = useState(false);
  const [itemId, setItemId] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [personalDocName, setPersonalDocName] = useState("");

  useEffect(() => {
    const storedMobile = localStorage.getItem("loggedInMobile");
    if (storedMobile) fetchUserByPhone(storedMobile);
  }, []);

  const fetchUserByPhone = async (phone) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
      const data = await res.json();
      const found = data.find((item) => item.mobileNumber === phone);
      if (found) {
        setEditMode(true);
        setItemId(found._id);
        setFormData({ ...found });
      }
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedDocType) {
      alert("Select document type first!");
      return;
    }
    if (selectedDocType === "Personal Document" && personalDocName.trim() === "") {
      alert("Please enter a document name for the personal document.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            name:
              selectedDocType === "Personal Document" && personalDocName
                ? personalDocName
                : selectedDocType,
            documentData: reader.result,
          },
        ],
      }));
      setSelectedDocType("");
      setPersonalDocName("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleAddFamilyMember = () => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { relationship: "", fullName: "", mobileNumber: "" }],
    }));
  };

  const handleFamilyChange = (index, field, value) => {
    const updated = [...formData.familyMembers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, familyMembers: updated }));
  };

  const handleRemoveFamilyMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `${import.meta.env.VITE_BaseURL_API}/api/items/${itemId}`
      : `${import.meta.env.VITE_BaseURL_API}/api/items`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Saved!");
    } catch (err) {
      console.error("Submit error", err);
    }
  };

  return (
    <form className="profile-container-two-col" onSubmit={handleSubmit}>
      <div className="left-panel">
        <div className="profile-image-section">
          {formData.documents.length > 0 && (
            <img
              src={formData.documents[0].documentData}
              alt="Profile"
              className="profile-pic-large"
            />
          )}
        </div>

        {[
          "name",
          "fullName",
          "mobileNumber",
          "email",
          "flatNo",
          "wingNumber",
          "role",
          "occupation",
          "adharCard",
          "password",
        ].map((field) => (
          <div key={field} className="form-group">
            <label>{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div className="right-panel">
        <h3>Family Members</h3>
        <div className="family-members-grid">
          {formData.familyMembers.map((member, index) => (
            <div key={index} className="family-member-block">
              <input
                type="text"
                placeholder="Relationship"
                value={member.relationship}
                onChange={(e) => handleFamilyChange(index, "relationship", e.target.value)}
              />
              <input
                type="text"
                placeholder="Full Name"
                value={member.fullName}
                onChange={(e) => handleFamilyChange(index, "fullName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Mobile"
                value={member.mobileNumber}
                onChange={(e) => handleFamilyChange(index, "mobileNumber", e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveFamilyMember(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddFamilyMember}>
          + Add Member
        </button>

        <h3>Documents</h3>
        <div className="form-group">
          <label>Select Type</label>
          <select
            value={selectedDocType}
            onChange={(e) => {
              setSelectedDocType(e.target.value);
              if (e.target.value !== "Personal Document") setPersonalDocName("");
            }}
          >
            <option value="">-- Select --</option>
            <option value="Profile Photo">Profile Photo</option>
            <option value="Personal Document">Personal Document</option>
          </select>
        </div>

        {selectedDocType === "Personal Document" && (
          <div className="form-group">
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Enter document name"
              value={personalDocName}
              onChange={(e) => setPersonalDocName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Upload</label>
          <input type="file" onChange={handleFileUpload} />
        </div>

        <ul>
          {formData.documents.map((doc, i) => (
            <li key={i}>
              {doc.name}
              <button type="button" onClick={() => handleRemoveDocument(i)}>Remove</button>
              <a href={doc.documentData} target="_blank" rel="noreferrer" download>
                View
              </a>
            </li>
          ))}
        </ul>

        <button type="submit">{editMode ? "Update" : "Submit"}</button>
      </div>
    </form>
  );
};

export default MyAccount;
