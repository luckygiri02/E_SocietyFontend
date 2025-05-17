import React, { useEffect, useState } from "react";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/events`);

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        const eventsWithMedia = data.events.map((event) => ({
          ...event,
          mediaUrls: {
            images: event.images?.map(
              (_, index) =>
                `${import.meta.env.VITE_BaseURL_API}/api/events/media/${event._id}/image/${index}`
            ),
            videos: event.videos?.map(
              (_, index) =>
                `${import.meta.env.VITE_BaseURL_API}/api/events/media/${event._id}/video/${index}`
            ),
          },
        }));

        setEvents(eventsWithMedia);
        setError(null);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Categorize events based on type property
  const upcomingEvents = events.filter(event => event.type === "upcoming");
  const previousEvents = events.filter(event => event.type === "previous");

  const renderEventCard = (event, isUpcoming = true) => (
    <div className="event-card" key={event._id}>
      <h3 className="event-title">{event.title}</h3>

      <div className="event-media-scroll">
        {event.mediaUrls?.images?.map((url, index) => (
          <img
            key={`img-${index}`}
            src={url}
            alt={`Event ${index}`}
            className="media-item"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        ))}
        {event.mediaUrls?.videos?.map((url, index) => (
          <video key={`vid-${index}`} controls className="media-item">
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>

      <div className="event-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          {new Date(event.date).toDateString()}
        </div>
        <div className="detail-item">
          <span className="detail-icon">📝</span>
          {event.description}
        </div>
      </div>

      {isUpcoming && (
        <button
          className="participate-btn"
          onClick={() =>
            alert(`Visit society office to register for: ${event.title}`)
          }
        >
          Participate
        </button>
      )}
    </div>
  );

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="events-page-wrapper">
      <h1 className="events-title">Upcoming Events</h1>
      {upcomingEvents.length === 0 ? (
        <p className="no-events">No upcoming events scheduled</p>
      ) : (
        <div className="events-grid">
          {upcomingEvents.map((event) => renderEventCard(event, true))}
        </div>
      )}

      <h2 className="events-subtitle">Previous Events</h2>
      {previousEvents.length === 0 ? (
        <p className="no-events">No previous events found</p>
      ) : (
        <div className="events-grid">
          {previousEvents.map((event) => renderEventCard(event, false))}
        </div>
      )}
    </div>
  );
};

export default Events;