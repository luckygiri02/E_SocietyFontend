import React, { useState, useEffect } from "react";
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "upcoming",
  });
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/events`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch events");

      setEvents(data.events);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type, e) => {
    const files = Array.from(e.target.files);
    const maxFiles = type === "images" ? 5 : 2;

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} ${type} allowed`);
      return;
    }

    if (type === "images") {
      setImages(files);
    } else {
      setVideos(files);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("date", formData.date);
      data.append("type", formData.type);

      images.forEach((file) => data.append("images", file));
      videos.forEach((file) => data.append("videos", file));

      const url = editingId
        ? `${import.meta.env.VITE_BaseURL_API}/api/events/${editingId}`
        : `${import.meta.env.VITE_BaseURL_API}/api/events`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save event");
      }

      setFormData({ title: "", description: "", date: "", type: "upcoming" });
      setImages([]);
      setVideos([]);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      type: event.type,
    });
    setEditingId(event._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Delete failed");
      }

      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setFormData({ title: "", description: "", date: "", type: "upcoming" });
    setImages([]);
    setVideos([]);
    setEditingId(null);
  };

  return (
    <div className="event-container">
      <h2 className="event-heading">Event Management</h2>

      {error && <div className="event-error">{error}</div>}

      <form onSubmit={handleSubmit} className="event-form">
        <h3 className="form-heading">{editingId ? "Edit Event" : "Create New Event"}</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Title*</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date*</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type*</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="previous">Previous</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Images (Max 5)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handleFileChange("images", e)} />
            {images.length > 0 && <p>{images.length} image(s) selected</p>}
          </div>
          <div className="form-group">
            <label>Videos (Max 2)</label>
            <input type="file" accept="video/*" multiple onChange={(e) => handleFileChange("videos", e)} />
            {videos.length > 0 && <p>{videos.length} video(s) selected</p>}
          </div>
        </div>

        <div className="form-actions">
          {editingId && (
            <button type="button" onClick={cancelEdit} className="btn cancel-btn">
              Cancel
            </button>
          )}
          <button type="submit" disabled={isLoading} className="btn submit-btn">
            {isLoading ? "Processing..." : editingId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>

      <div className="event-list">
        <h3 className="list-heading">All Events</h3>
        {isLoading && <p className="loading-text">Loading...</p>}

        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          <table className="event-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Type</th>
                <th>Media</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>
                    <strong>{event.title}</strong>
                    <div className="desc">{event.description}</div>
                  </td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.type}</td>
                  <td>
                    {event.images?.length > 0 && <span>{event.images.length} image(s)</span>}{" "}
                    {event.videos?.length > 0 && <span>{event.videos.length} video(s)</span>}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(event)} className="action-btn edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event._id)} className="action-btn delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
