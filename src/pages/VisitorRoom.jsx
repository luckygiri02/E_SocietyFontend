import React, { useContext, useEffect, useState } from 'react';
import './VisitorRoom.css';
import { UserContext } from '../context/UserContext'; // Make sure the path is correct

const VisitorRoom = () => {
  const { userData } = useContext(UserContext);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const data = await res.json();

        const visitorList = data.filter(
          (item) =>
            item.role === "visitor" &&
            item.flatNo === userData?.flatNo &&
            item.wingNumber === userData?.wingNumber
        );

        setVisitors(visitorList);
      } catch (err) {
        console.error("Error fetching visitors", err);
      }
    };

    if (userData) {
      fetchVisitors();
    }
  }, [userData]);

  return (
    <div className="visitor-room-page">
      <h1>Visitor Room</h1>
      {userData && (
        <p className="visitor-note">
          Visitors visiting your flat ({userData.flatNo}, Wing {userData.wingNumber})
        </p>
      )}

      <div className="visitor-list">
        {visitors.length > 0 ? (
          visitors.map((visitor, index) => (
            <div className="visitor-card" key={index}>
              <h3>{visitor.fullName}</h3>
              <p><strong>Flat No:</strong> {visitor.flatNo}</p>
              <p><strong>Wing:</strong> {visitor.wingNumber}</p>
              <p><strong>Purpose:</strong> {visitor.purpose}</p>
              <p><strong>Relation:</strong> {visitor.relation}</p>
              <p><strong>Time:</strong> {new Date(visitor.visittime).toLocaleTimeString()}</p>
              <p><strong>Date:</strong> {new Date(visitor.visittime).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No visitors recorded for your flat today.</p>
        )}
      </div>
    </div>
  );
};

export default VisitorRoom;
