import React, { useEffect, useState } from "react";
import "./EventPhotos.css";
import './media.css'

const EventPhoto = () => {
  const [latestEvent, setLatestEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestEvent = async () => {
      try {
     
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/events`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        
        const data = await response.json();
        
        // Filter previous events and sort by date (newest first)
        const previousEvents = data.events
        .filter(event => event.type.toLowerCase() === "previous")

          .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (previousEvents.length > 0) {
          // Get the most recent previous event
          const latest = previousEvents[0];
          
          // If the event has images, get the first one
          if (latest.images && latest.images.length > 0) {
            const imageUrl = `${import.meta.env.VITE_BaseURL_API}/api/events/media/${latest._id}/image/0`;
            setLatestEvent({
              title: latest.title,
              imageUrl: imageUrl
            });
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvent();
  }, []);

  if (loading) {
    return (
      <section className="event-photo1">
        <h1>Last Event Photo</h1>
        <div className="loading">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="event-photo1">
        <h1>Last Event Photo</h1>
        <div className="error">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="event-photo1">
    <h1>{latestEvent ? `Last Event: ${latestEvent.title}` : "Last Event Photos"}</h1>
    <div className="event-photo-container">
      {latestEvent ? (
        <>
          <img 
            src={latestEvent.imageUrl} 
            alt={`Event 1: ${latestEvent.title}`} 
            className="event-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-event.jpg";
            }}
          />
          <img 
            src={latestEvent.imageUrl2 || latestEvent.imageUrl} 
            alt={`Event 2: ${latestEvent.title}`} 
            className="event-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-event.jpg";
            }}
          />
        </>
      ) : (
        <p className="no-events1">No previous events found</p>
      )}
    </div>
  </section>
  
  );
};

export default EventPhoto;