import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust path as needed
import './AddPropertyPage.css';
import '../components/media.css';

const BASE_URL = `${import.meta.env.VITE_BaseURL_API}/api/properties`;

const AddPropertyPage = () => {
  // Get user data from context
  const { userData } = useContext(UserContext);
  const user = userData;
  
  // Form state - initialize with user data
  const [formData, setFormData] = useState({
    flatNo: '',
    wing: '',
    userName: '',
    mobileNumber: '',
    price: '',
    type: 'Rent',
    eligibility: '',
    visitTime: ''
  });
  
  // Prefill form after userData loads
  useEffect(() => {
    if (userData) {
      const user = userData;
      setFormData((prev) => ({
        ...prev,
        flatNo: user.flatNo || '',
        wing: user.wingNumber || '',
        userName: user.fullName || user.name || '',
        mobileNumber: user.mobileNumber || ''
      }));
    }
  }, [userData]);
  
  // Media state
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [properties, setProperties] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'add', or 'edit'
  const [editingId, setEditingId] = useState(null);

  // Separate properties into user's and others'
  const userProperties = properties.filter(
    property => property.mobileNumber === user?.mobileNumber
  );
  const otherProperties = properties.filter(
    property => property.mobileNumber !== user?.mobileNumber
  );

  // Fetch all properties with media URLs
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch properties');
      }
      
      const data = await response.json();
      
      // Add media URLs to each property
      const propertiesWithMedia = data.properties.map(property => ({
        ...property,
        mediaUrls: {
          images: property.images.map((_, index) => 
            `${BASE_URL}/media/${property._id}/image/${index}?${Date.now()}`),
          videos: property.videos.map((_, index) => 
            `${BASE_URL}/media/${property._id}/video/${index}?${Date.now()}`)
        }
      }));
      
      setProperties(propertiesWithMedia);
      setMessage({ text: '', type: '' });
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const editableFields = ['price', 'type', 'eligibility', 'visitTime'];
    if (editableFields.includes(e.target.name)) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle file selection
  const handleFileChange = (type, e) => {
    const files = Array.from(e.target.files);
    const maxFiles = type === 'images' ? 5 : 2;
    const currentFiles = type === 'images' ? images.length : videos.length;
    
    if (files.length + currentFiles > maxFiles) {
      setMessage({ 
        text: `Maximum ${maxFiles} ${type} allowed (${currentFiles} already added)`, 
        type: 'error' 
      });
      return;
    }
    
    // Validate file types
    const invalidFiles = files.filter(file => 
      type === 'images' 
        ? !file.type.startsWith('image/')
        : !file.type.startsWith('video/')
    );
    
    if (invalidFiles.length > 0) {
      setMessage({
        text: `Invalid file type. Only ${type === 'images' ? 'images' : 'videos'} allowed`,
        type: 'error'
      });
      return;
    }
    
    if (type === 'images') {
      setImages([...images, ...files]);
    } else {
      setVideos([...videos, ...files]);
    }
    
    e.target.value = '';
  };

  // Remove selected file
  const removeFile = (type, index, isExisting = false) => {
    if (isExisting) {
      if (type === 'images') {
        setExistingImages(existingImages.filter((_, i) => i !== index));
      } else {
        setExistingVideos(existingVideos.filter((_, i) => i !== index));
      }
    } else {
      if (type === 'images') {
        setImages(images.filter((_, i) => i !== index));
      } else {
        setVideos(videos.filter((_, i) => i !== index));
      }
    }
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: 'Submitting...', type: 'info' });
    
    try {
      const formPayload = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      
      // Append new files
      images.forEach(file => formPayload.append('images', file));
      videos.forEach(file => formPayload.append('videos', file));
      
      // Append existing media references if editing
      if (editingId) {
        formPayload.append('existingImages', JSON.stringify(
          existingImages.map(img => ({ index: img.index }))
        ));
        formPayload.append('existingVideos', JSON.stringify(
          existingVideos.map(vid => ({ index: vid.index }))
        ));
      }
      
      const url = editingId 
        ? `${BASE_URL}/${editingId}`
        : BASE_URL;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formPayload
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }
      
      const data = await response.json();
      
      setMessage({ 
        text: `Property ${editingId ? 'updated' : 'added'} successfully!`, 
        type: 'success' 
      });
      
      resetForm();
      fetchProperties();
      setViewMode('list');
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ 
        text: error.message || 'Failed to submit property', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit property
  const handleEdit = (property) => {
    setFormData({
      flatNo: property.flatNo,
      wing: property.wing,
      userName: property.userName,
      mobileNumber: property.mobileNumber,
      price: property.price,
      type: property.type,
      eligibility: property.eligibility || '',
      visitTime: property.visitTime || ''
    });
    
    setExistingImages(property.mediaUrls.images.map((url, index) => ({
      url,
      index
    })));
    
    setExistingVideos(property.mediaUrls.videos.map((url, index) => ({
      url,
      index
    })));
    
    setEditingId(property._id);
    setViewMode('edit');
  };

  // Delete property
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Deletion failed');
      }
      
      setMessage({ text: 'Property deleted successfully', type: 'success' });
      fetchProperties();
    } catch (error) {
      console.error('Deletion error:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      flatNo: user?.flatNo || '',
      wing: user?.wing || '',
      userName: user?.name || '',
      mobileNumber: user?.mobileNumber || '',
      price: '',
      type: 'Rent',
      eligibility: '',
      visitTime: ''
    });
    setImages([]);
    setVideos([]);
    setExistingImages([]);
    setExistingVideos([]);
    setEditingId(null);
  };

  // Initial data fetch
  useEffect(() => {
    fetchProperties();
  }, []);

  // Render property card
  const renderPropertyCard = (property, isEditable = false) => (
    <div key={property._id} className="property-card">
      <div className="property-header">
        <h3>{property.wing} - {property.flatNo}</h3>
        <span className={`property-type ${property.type.toLowerCase()}`}>
          {property.type}
        </span>
      </div>
      
      <div className="property-details">
        <p><strong>Price:</strong> {property.price}</p>
        <p><strong>Contact:</strong> {property.userName} ({property.mobileNumber})</p>
        {property.eligibility && <p><strong>Eligibility:</strong> {property.eligibility}</p>}
        {property.visitTime && <p><strong>Visit Time:</strong> {property.visitTime}</p>}
      </div>
      
      <div className="media-preview">
        {property.mediaUrls.images.length > 0 && (
          <img
            src={property.mediaUrls.images[0]}
            alt="Property thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}
        {property.mediaUrls.videos.length > 0 && !property.mediaUrls.images.length && (
          <video
            controls
            src={property.mediaUrls.videos[0]}
            onError={(e) => {
              e.target.onerror = null;
              e.target.poster = '/placeholder-video.jpg';
            }}
          />
        )}
      </div>
      
      {isEditable && (
        <div className="property-actions editanddelete">
          <button 
            onClick={() => handleEdit(property)}
            disabled={isLoading}
            className="editanddelete"
          >
            Edit
          </button>
          <button 
            onClick={() => handleDelete(property._id)}
            className="delete-button editanddelete"
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="property-manager">
      <h1>Property Management</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}
      
      {viewMode === 'list' ? (
        <>
          <button 
            onClick={() => setViewMode('add')}
            className="add-button"
            disabled={isLoading}
          >
            Add New Property
          </button>
          
          {isLoading && properties.length === 0 ? (
            <div className="loading">Loading properties...</div>
          ) : (
            <>
              {/* User's Properties Section */}
              {userProperties.length > 0 && (
                <div className="property-section">
                  <h2>Your Properties</h2>
                  <div className="property-grid">
                    {userProperties.map(property => 
                      renderPropertyCard(property, true)
                    )}
                  </div>
                </div>
              )}
              
              {/* Other Properties Section */}
              {otherProperties.length > 0 && (
                <div className="property-section">
                  <h2>Available Properties</h2>
                  <div className="property-grid">
                    {otherProperties.map(property => 
                      renderPropertyCard(property, false)
                    )}
                  </div>
                </div>
              )}
              
              {properties.length === 0 && (
                <div className="no-properties">No properties found</div>
              )}
            </>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="property-form">
          <h2>{editingId ? 'Edit Property' : 'Add New Property'}</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Flat Number*</label>
              <input
                type="text"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleChange}
                required
                disabled={true}
                className="read-only-field"
              />
            </div>
            
            <div className="form-group">
              <label>Wing*</label>
              <input
                type="text"
                name="wing"
                value={formData.wing}
                onChange={handleChange}
                required
                disabled={true}
                className="read-only-field"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Your Name*</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                disabled={true}
                className="read-only-field"
              />
            </div>
            
            <div className="form-group">
              <label>Mobile Number*</label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                disabled={true}
                className="read-only-field"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price*</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="Rent">Rent</option>
                <option value="Sale">Sale</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Eligibility</label>
              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label>Visit Time</label>
              <input
                type="text"
                name="visitTime"
                value={formData.visitTime}
                onChange={handleChange}
                placeholder="e.g., 10AM-6PM"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Images Section */}
          <div className="media-section">
            <h3>Images (Max 5)</h3>
            <div className="media-controls">
              <label className="file-upload-button">
                Add Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange('images', e)}
                  disabled={isLoading || (images.length + existingImages.length) >= 5}
                />
              </label>
              <span className="file-count">
                {images.length + existingImages.length} / 5 images added
              </span>
            </div>
            
            <div className="media-previews">
              {existingImages.map((media, index) => (
                <div key={`existing-img-${index}`} className="media-preview-item">
                  <img
                    src={media.url}
                    alt={`Existing image ${index}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('images', index, true)}
                    disabled={isLoading}
                    className="remove-media-button"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {images.map((file, index) => (
                <div key={`new-img-${index}`} className="media-preview-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('images', index)}
                    disabled={isLoading}
                    className="remove-media-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Videos Section */}
          <div className="media-section">
            <h3>Videos (Max 2)</h3>
            <div className="media-controls">
              <label className="file-upload-button">
                Add Videos
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange('videos', e)}
                  disabled={isLoading || (videos.length + existingVideos.length) >= 2}
                />
              </label>
              <span className="file-count">
                {videos.length + existingVideos.length} / 2 videos added
              </span>
            </div>
            
            <div className="media-previews">
              {existingVideos.map((media, index) => (
                <div key={`existing-vid-${index}`} className="media-preview-item">
                  <video controls>
                    <source src={media.url} type="video/mp4" />
                  </video>
                  <button
                    type="button"
                    onClick={() => removeFile('videos', index, true)}
                    disabled={isLoading}
                    className="remove-media-button"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {videos.map((file, index) => (
                <div key={`new-vid-${index}`} className="media-preview-item">
                  <video controls>
                    <source src={URL.createObjectURL(file)} type={file.type} />
                  </video>
                  <button
                    type="button"
                    onClick={() => removeFile('videos', index)}
                    disabled={isLoading}
                    className="remove-media-button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Processing...' : 'Save Property'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setViewMode('list');
              }}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddPropertyPage;