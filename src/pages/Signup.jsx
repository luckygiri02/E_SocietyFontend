import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signup.css'
const Signup = () => {
  const [isVisitor, setIsVisitor] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [visitorData, setVisitorData] = useState({
    fullName: "",
    mobileNumber: "",
    location: "",
    purpose: "",
    flatNo: "",
    wingNumber: "",
    relation: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
      const data = await res.json();

      const user = data.find((item) => item.mobileNumber === mobileNumber);

      if (!user) {
        setMessage("❌ User not found with this mobile number.");
        return;
      }

      if (user.password !== password) {
        setMessage("❌ Incorrect password.");
        return;
      }

      setMessage("✅ Login successful!");
      localStorage.setItem("loggedInMobile", user.mobileNumber);

      setTimeout(() => {
        if (user.role?.toLowerCase() === "visitor") {
          navigate("/rent");
        } else if (user.role?.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/homepage");
        }
        
        
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Server error. Try again later.");
    }
  };
 
  
  const handleVisitorChange = (e) => {
    const { name, value } = e.target;
    setVisitorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();

    if (visitorData.password !== visitorData.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    const payload = {
      ...visitorData,
      role: "visitor",
      visittime: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit visitor");

      setMessage("✅ Visitor entry submitted!");
      localStorage.setItem("loggedInMobile", visitorData.mobileNumber);

      setTimeout(() => navigate("/rent"), 1000);

      setVisitorData({
        fullName: "",
        mobileNumber: "",
        location: "",
        purpose: "",
        flatNo: "",
        wingNumber: "",
        relation: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Visitor submit failed", err);
      setMessage("❌ Visitor submission failed.");
    }
  };

  return (
    
    <div className="page-wrapper">

    <div className="signup-container">
    <div className="toggle-buttons">
      <button onClick={() => setIsVisitor(false)} disabled={!isVisitor}>
        Existing User
      </button>
      <button onClick={() => setIsVisitor(true)} disabled={isVisitor}>
        New Visitor
      </button>
    </div>
  
    {!isVisitor ? (
      <>
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="form-field">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </>
    ) : (
      <>
        <h2>Visitor Entry</h2>
        <form onSubmit={handleVisitorSubmit}>
          {[
            { label: "Full Name", name: "fullName" },
            { label: "Mobile Number", name: "mobileNumber" },
            { label: "Location", name: "location" },
            { label: "Purpose", name: "purpose" },
            { label: "Flat No", name: "flatNo" },
            { label: "Wing Number", name: "wingNumber" },
            { label: "Relation", name: "relation" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map((field) => (
            <div className="form-field" key={field.name}>
              <label>{field.label}:</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={visitorData[field.name]}
                onChange={handleVisitorChange}
                required
              />
            </div>
          ))}
          <button type="submit">Submit Visitor Entry</button>
        </form>
      </>
    )}
  
    {message && (
      <p className={`message ${message.includes("❌") ? "error" : "success"}`}>
        {message}
      </p>
    )}
  </div>
  </div>
  );
};

export default Signup;
