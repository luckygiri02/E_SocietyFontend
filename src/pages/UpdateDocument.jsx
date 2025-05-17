import React, { useState } from "react";
import "./UpdateDocument.css";

const documents = [
  "Aadhar Card",
  "PAN Card",
  "Address Proof",
  "Electricity Bill",
  "Rent Agreement",
  "Passport",
  "Other Document", // Added option
];

const UpdateDocument = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [customDocName, setCustomDocName] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleDocumentClick = (docName) => {
    setSelectedDoc(docName);
    setCustomDocName("");
    setFile(null);
    setUploadStatus("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = () => {
    const finalDocName = selectedDoc === "Other Document" ? customDocName : selectedDoc;

    if (!finalDocName || finalDocName.trim() === "") {
      alert("Please enter the document name.");
      return;
    }

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    // Simulate upload
    setUploadStatus(`✅ Uploaded "${file.name}" for "${finalDocName}" successfully.`);
    setFile(null);
    setSelectedDoc(null);
    setCustomDocName("");
  };

  return (
    <div className="update-doc-page">
      <h1>Update Your Documents</h1>
      <p>Select a document you want to update:</p>

      <div className="doc-list">
        {documents.map((doc, index) => (
          <button
            key={index}
            className={`doc-item ${selectedDoc === doc ? "active" : ""}`}
            onClick={() => handleDocumentClick(doc)}
          >
            {doc}
          </button>
        ))}
      </div>

      {selectedDoc && (
        <div className="upload-section">
          <h3>Upload: {selectedDoc}</h3>

          {selectedDoc === "Other Document" && (
            <input
              type="text"
              placeholder="Enter custom document name"
              value={customDocName}
              onChange={(e) => setCustomDocName(e.target.value)}
              className="custom-doc-input"
            />
          )}

          <label htmlFor="fileUpload" className="file-label">
            Choose File (PDF, JPG, PNG - Max 2MB)
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
          {file && <p className="file-name">Selected: {file.name}</p>}

          <button onClick={handleUpload} className="upload-btn">
            Upload
          </button>

          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default UpdateDocument;
