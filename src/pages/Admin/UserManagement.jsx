import React, { useState, useEffect } from "react";
import "./AdminUserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    location: "",
    visittime: "",
    relation: "",
    purpose: "",
    familyMembers: [],
    documents: [],
  });

  const [selectedDocType, setSelectedDocType] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
      const data = await res.json();
      setUsers(data.filter(user => !isVisitor(user)));
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const isVisitor = (user) => {
    if (!user || !user.role) return false;
    return user.role.toLowerCase() === "visitor";
  };

  const filteredUsers = users.filter(user =>
    !isVisitor(user) && (
      user.mobileNumber?.includes(searchTerm) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.flatNo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name || "",
      fullName: user.fullName || "",
      mobileNumber: user.mobileNumber || "",
      email: user.email || "",
      flatNo: user.flatNo || "",
      wingNumber: user.wingNumber || "",
      role: user.role || "",
      occupation: user.occupation || "",
      adharCard: user.adharCard || "",
      password: user.password || "",
      location: user.location || "",
      visittime: user.visittime || "",
      relation: user.relation || "",
      purpose: user.purpose || "",
      familyMembers: user.familyMembers || [],
      documents: user.documents || [],
    });
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
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          { name: selectedDocType, documentData: reader.result },
        ],
      }));
      setSelectedDocType("");
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
      familyMembers: [
        ...prev.familyMembers,
        { relationship: "", fullName: "", mobileNumber: "" },
      ],
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

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setFormData({
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
      location: "",
      visittime: "",
      relation: "",
      purpose: "",
      familyMembers: [],
      documents: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      isEditing && selectedUser
        ? `${import.meta.env.VITE_BaseURL_API}/api/items/${selectedUser._id}`
        : `${import.meta.env.VITE_BaseURL_API}/api/items`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save user");
      alert("User saved successfully!");
      fetchUsers();
      if (!isEditing) handleCreateNew();
    } catch (err) {
      console.error("Submit error", err);
      alert("Error saving user");
    }
  };

  const handleDeleteUser = async () => {
    if (
      !selectedUser ||
      !window.confirm("Are you sure you want to delete this user?")
    )
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BaseURL_API}/api/items/${selectedUser._id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      alert("User deleted successfully!");
      fetchUsers();
      handleCreateNew();
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting user");
    }
  };

  const renderDocumentsSection = () => {
    if (!selectedUser || !selectedUser.documents || selectedUser.documents.length === 0) {
      return <p>No documents available</p>;
    }

    return (
      <div className="documents-section">
        <h3>Documents</h3>
        <div className="documents-grid">
          {selectedUser.documents.map((doc, index) => (
            <div key={index} className="document-card">
              <div className="document-preview">
                {doc.name === "Profile Photo" ? (
                  <img src={doc.documentData} alt="Profile" className="document-image" />
                ) : (
                  <div className="document-icon">
                    <i className="fas fa-file-alt"></i>
                  </div>
                )}
              </div>
              <div className="document-info">
                <span className="document-name">{doc.name}</span>
                <a 
                  href={doc.documentData} 
                
  
                  className="view-document-btn"
                >
                  View Document
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-user-management">
      <div className="user-list-panel">
        <h2>User Management</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by mobile, name, or flat..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button onClick={handleCreateNew}>+ Create New User</button>
        </div>

        <div className="user-grid">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`user-card ${
                selectedUser?._id === user._id ? "selected" : ""
              }`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="user-avatar">
                {user.documents?.length > 0 ? (
                  <img
                    src={
                      user.documents.find((d) => d.name === "Profile Photo")
                        ?.documentData || user.documents[0].documentData
                    }
                    alt="User"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="user-info">
                <h4>{user.fullName || "No Name"}</h4>
                <p>Mobile: {user.mobileNumber}</p>
                <p>Flat: {user.flatNo || "N/A"}</p>
                <p>Role: {user.role || "Resident"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="user-detail-panel">
        {selectedUser || !isEditing ? (
          <>
            <h2>{isEditing ? "Edit User" : "Create New User"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Flat No</label>
                    <input
                      type="text"
                      name="flatNo"
                      value={formData.flatNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Wing Number</label>
                    <input
                      type="text"
                      name="wingNumber"
                      value={formData.wingNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Resident">Resident</option>
                      <option value="Staff-President">Staff-President</option>
                      <option value="Staff-Chairman">Staff-Chairman</option>
                      <option value="Staff-Secretary">Staff-Secretary</option>
                      <option value="Staff-Teasurer">Staff-Teasurer</option>
                      <option value="Staff-Head">Staff-Head</option>
                      <option value="Visitor">Visitor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Aadhar Card</label>
                    <input
                      type="text"
                      name="adharCard"
                      value={formData.adharCard}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Family Members</h3>
                <button
                  type="button"
                  onClick={handleAddFamilyMember}
                  className="add-member-btn"
                >
                  + Add Family Member
                </button>

                <div className="family-members-grid">
                  {formData.familyMembers.map((member, index) => (
                    <div key={index} className="family-member-card">
                      <div className="form-group">
                        <label>Relationship</label>
                        <input
                          type="text"
                          value={member.relationship}
                          onChange={(e) =>
                            handleFamilyChange(
                              index,
                              "relationship",
                              e.target.value
                            )
                          }
                          placeholder="Father/Mother/etc."
                        />
                      </div>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={member.fullName}
                          onChange={(e) =>
                            handleFamilyChange(
                              index,
                              "fullName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Mobile</label>
                        <input
                          type="text"
                          value={member.mobileNumber}
                          onChange={(e) =>
                            handleFamilyChange(
                              index,
                              "mobileNumber",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFamilyMember(index)}
                        className="remove-member-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedUser && renderDocumentsSection()}

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {isEditing ? "Update User" : "Create User"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDeleteUser}
                    className="delete-btn"
                  >
                    Delete User
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="empty-state">
            <h3>Select a user to edit or create a new one</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;