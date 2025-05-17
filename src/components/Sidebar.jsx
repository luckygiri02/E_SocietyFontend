import React, { useEffect, useState } from 'react';
import './NavSidebar.css';
import './media.css';
import jethaprofile from '../assets/jethaprofile.avif';

const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const mobile = localStorage.getItem("loggedInMobile");
    if (!mobile) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const data = await res.json();
        const user = data.find((item) => item.mobileNumber === mobile);
        if (user) {
          setUserData(user);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  if (!userData) return <aside className="resident-sidebar">Loading...</aside>;

  const { fullName, flatNo, familyMembers, documents } = userData;

  const profilePhotoObj = documents?.find((doc) => doc.name === "Profile Photo");
  const profilePhoto = profilePhotoObj?.documentData || jethaprofile;

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <aside className="resident-sidebar1">
      <div className="resident-profile-section1">
        <div className="resident-profile-image1">
          <img src={profilePhoto} alt="Resident" className="resident-profile-img" />
        </div>
        <h2 className="resident-profile-name1">{fullName}</h2>
        <p className="resident-profile-flat1">Flat No: {flatNo}</p>
      </div>

      <div className="resident-family-list1">
        <h3 className="resident-family-title1">Family Members</h3>
        <div className="resident-family-members1">
          {Array.isArray(familyMembers) && familyMembers.length > 0 ? (
            familyMembers.map((member, i) => (
              <div key={i} className="resident-family-member1">
                <div
                  onClick={() => toggleExpand(i)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#f2f2f2',
                    padding: '8px',
                    borderRadius: '5px',
                    marginBottom: '5px',
                  }}
                >
                  Member {i + 1}
                </div>
                {expandedIndex === i && (
                  <div
                    className="family-member-details1"
                    style={{
                      marginLeft: '10px',
                      marginTop: '5px',
                      padding: '8px',
                      backgroundColor: '#fafafa',
                      borderLeft: '3px solid #aaa',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div><strong>Relationship:</strong> {member.relationship}</div>
                    <div><strong>Full Name:</strong> {member.fullName}</div>
                    <div><strong>Mobile Number:</strong> {member.mobileNumber}</div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No family members added</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
