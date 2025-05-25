import React, { useEffect, useState } from "react";
import "./EventPhotos.css";

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const previousEvents = data.events
          .filter(event => event.type?.toLowerCase() === "previous")
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (previousEvents.length > 0) {
          const latest = previousEvents[0];

          const hasImages = (latest.images?.length > 0) || (latest.mediaUrls?.images?.length > 0);

          const imageUrls =
            latest.mediaUrls?.images?.map(img =>
              img.startsWith('/')
                ? `https://e-society-n6ky.onrender.com${img}`
                : img
            ) ||
            (latest.images?.map((_, i) =>
              `https://e-society-n6ky.onrender.com/api/events/media/${latest._id}/image/${i}`
            ) || []);

          setLatestEvent({
            ...latest,
            hasImages,
            imageUrls,
          });

          console.log('Image URLs:', imageUrls);
        } else {
          setLatestEvent(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEvent();
  }, []);

  if (loading) {
    return (
      <section className="event-photo">
        <h2>Loading latest event...</h2>
        <div className="spinner"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="event-photo error">
        <h2>Error loading event</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </section>
    );
  }

  return (
    <section className="event-photo">
      <h2>{latestEvent ? `Latest Event: ${latestEvent.title}` : "No Events Found"}</h2>

      {latestEvent && (
        <>
          <div className="event-meta">
            <p>Date: {new Date(latestEvent.date).toLocaleDateString()}</p>
            <p>{latestEvent.description}</p>
          </div>

          <div className="event-images">
            {latestEvent.hasImages ? (
              latestEvent.imageUrls.slice(0, 2).map((url, index) => (
                <div key={index} className="event-image-container">
                  <img
                    src={url}
                    alt={`${latestEvent.title} - ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/placeholder-event.jpg";
                      console.error(`Failed to load image: ${url}`);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="no-images">
                <img src="/placeholder-event.jpg" alt="No images available" />
                <p>No images available for this event</p>
              </div>
            )}
          </div>
        </>
      )}

      {!latestEvent && (
        <div className="no-events">
          <img src="/placeholder-event.jpg" alt="No events found" />
          <p>No previous events available</p>
        </div>
      )}
    </section>
  );
};

export default EventPhoto;
