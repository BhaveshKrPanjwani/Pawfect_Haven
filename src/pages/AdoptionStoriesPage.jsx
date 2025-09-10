// src/pages/AdoptionStoriesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AdoptionStoriesPage.css"; // We'll create this CSS file

// Placeholder for adoption stories (in a real app, this would come from a backend API)
const initialStories = [
  {
    id: "s1",
    author: "Sarah",
    petName: "Bella",
    story:
      "Adopting Bella changed my life. She brought so much joy and companionship into our home. Seeing her thrive after being rescued is the most rewarding experience.",
    image: process.env.PUBLIC_URL + "/util/story1.jpg",
  },
  {
    id: "s2",
    author: "Arti and Anjana",
    petName: "Whiskers",
    story:
      "When we adopted Whiskers, he was shy and scared. Now, he rules the house with his playful antics. Giving him a forever home has been a blessing for our family.",
    image: process.env.PUBLIC_URL + "/util/himali-1200x550.jpg",
  },
  {
    id: "s3",
    author: "Mohan",
    petName: "Kiku",
    story:
      "We started a fundraiser to help with rescue efforts, and it led us to adopt Kiku. Knowing we helped him and so many others makes his tail wags even more special.",
    image: process.env.PUBLIC_URL + "/util/story3.webp",
  },
  // Add more initial stories here if you like
];

const AdoptionStoriesPage = () => {
  const [stories, setStories] = useState(initialStories);
  const [newStory, setNewStory] = useState({
    author: "",
    petName: "",
    story: "",
    image: "", // In a real app, this would be a file upload, here it's a URL
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory({ ...newStory, [name]: value });
  };

  const handleSubmitStory = (e) => {
    e.preventDefault();
    if (!newStory.author || !newStory.petName || !newStory.story) {
      alert("Please fill in all required fields (Author, Pet Name, Story).");
      return;
    }

    setIsSubmitting(true);
    // In a real application, you would send newStory to your backend API
    // and then fetch updated stories or add the new story to the state
    console.log("Submitting new story:", newStory);

    // Simulate API call
    setTimeout(() => {
      const storyToAdd = {
        ...newStory,
        id: `s${stories.length + 1}`, // Generate a simple ID
        // If image is empty, use a placeholder
        image: newStory.image || process.env.PUBLIC_URL + "/util/placeholder-pet-story.jpg",
      };
      setStories((prevStories) => [storyToAdd, ...prevStories]); // Add new story to the top
      setNewStory({ author: "", petName: "", story: "", image: "" }); // Clear form
      setIsSubmitting(false);
      alert("Your story has been shared! Thank you!");
    }, 1000);
  };

  return (
    <div className="adoption-stories-page-container">
      <button onClick={() => navigate(-1)} className="btn-back-stories">
        &larr; Back
      </button>

      <h1 className="stories-page-title">Our Pawfect Haven Stories</h1>
      <p className="stories-page-intro">
        Read heartwarming tales of adoption and share your own journey with your furry (or feathered, or finned!) friend.
      </p>

      {/* Share Your Story Form */}
      <section className="share-story-section">
        <h2 className="section-title">Share Your Story</h2>
        <form onSubmit={handleSubmitStory} className="share-story-form">
          <div className="form-group">
            <label htmlFor="author">Your Name:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={newStory.author}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="petName">Your Pet's Name:</label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={newStory.petName}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="story">Your Adoption Story:</label>
            <textarea
              id="story"
              name="story"
              rows="6"
              value={newStory.story}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL (optional):</label>
            <input
              type="url"
              id="image"
              name="image"
              value={newStory.image}
              onChange={handleInputChange}
              placeholder="e.g., https://example.com/my-pet.jpg"
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="btn-submit-story" disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : "Share My Story"}
          </button>
        </form>
      </section>

      {/* Existing Stories Section */}
      <section className="all-stories-section">
        <h2 className="section-title">All Adoption Stories</h2>
        <div className="stories-grid">
          {stories.length > 0 ? (
            stories.map((story) => (
              <div key={story.id} className="story-card">
                <img src={story.image} alt={`Pet of ${story.author}`} className="story-image" />
                <h3 className="story-pet-name">Meet {story.petName}</h3>
                <p className="story-author">By {story.author}</p>
                <p className="story-text">"{story.story}"</p>
              </div>
            ))
          ) : (
            <p>No stories yet. Be the first to share!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdoptionStoriesPage;