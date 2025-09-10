import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/AdoptPage.css"; // We'll create this CSS file

const AdoptPage = () => {
  const { id } = useParams(); // Match the route parameter name
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adopterDetails, setAdopterDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pets/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPet(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdopterDetails({ ...adopterDetails, [name]: value });
  };

  const handleInitiateAdoption = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Basic validation
    if (!adopterDetails.name || !adopterDetails.email || !adopterDetails.phone) {
      alert("Please fill in all your details to proceed.");
      return;
    }
    setShowConfirmation(true); // Show the confirmation/payment section
  };

  const handleConfirmAdoption = () => {
    // In a real app, you'd send adopterDetails and petId to your backend
    // to record the adoption, handle payment, send emails, etc.
    alert(
      `Congratulations, ${adopterDetails.name}! You are now processing the adoption of ${pet.name}! 🎉
      \n(This is a simulated adoption. In a real app, payment and finalization would occur here.)`
    );
    // After successful "adoption," navigate back to the home page or a success page
    navigate("/");
  };

  if (loading) {
    return (
      <div className="adopt-page-container loading">
        <p>Loading pet details...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adopt-page-container error">
        <p>Error loading pet: {error}</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="adopt-page-container not-found">
        <p>Pet not found.</p>
        <button onClick={() => navigate(-1)} className="btn-back">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="adopt-page-container">
      <button onClick={() => navigate(-1)} className="btn-back">
        &larr; Back to Pets
      </button>

      <div className="adopt-card">
        <div className="adopt-image-section">
          <img src={pet.image} alt={pet.name} className="adopt-main-image" />
        </div>
        <div className="adopt-details-section">
          <h2 className="adopt-title">Adopt {pet.name}</h2>
          <p className="adopt-type">
            <strong>Type:</strong> {pet.type}
          </p>
          <p className="adopt-breed">
            <strong>Breed:</strong> {pet.breed}
          </p>
          <p className="adopt-location">
            <strong>Location:</strong> {pet.location}
          </p>
          <p className="adopt-description">
            <strong>About {pet.name}:</strong> {pet.description}
          </p>
          {/* Add more details like age, temperament, etc., if available in pet object */}
          <div className="pet-characteristics">
            {/* Example characteristics - add these to your pet schema if you want */}
            {/* <span className="characteristic-tag">Playful</span>
            <span className="characteristic-tag">Friendly</span>
            <span className="characteristic-tag">House-trained</span> */}
          </div>
        </div>
      </div>

      {!showConfirmation ? (
        <form onSubmit={handleInitiateAdoption} className="adopter-form">
          <h3>Your Details</h3>
          <p>Please provide your information to proceed with the adoption.</p>
          <div className="form-group">
            <label htmlFor="adopterName">Full Name:</label>
            <input
              type="text"
              id="adopterName"
              name="name"
              value={adopterDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="adopterEmail">Email:</label>
            <input
              type="email"
              id="adopterEmail"
              name="email"
              value={adopterDetails.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="adopterPhone">Phone Number:</label>
            <input
              type="tel"
              id="adopterPhone"
              name="phone"
              value={adopterDetails.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Proceed to Adoption
          </button>
        </form>
      ) : (
        <div className="adoption-confirmation-section">
          <h3>Confirm Your Adoption</h3>
          <p>
            You're almost there! Please review your details and confirm the
            adoption of **{pet.name}**.
          </p>
          <p>
            A representative will contact you at **{adopterDetails.email}** or{" "}
            **{adopterDetails.phone}** shortly.
          </p>
          {/* Payment Placeholder - In a real app, this would be a Stripe/PayPal button */}
          <div className="payment-options">
            <h4>Adoption Fee: $100 (Example)</h4>
            <button className="btn-payment" onClick={handleConfirmAdoption}>
              <i className="fas fa-credit-card"></i> Process Adoption & Pay
            </button>
            <p className="small-text">
              (This is a simulated payment. No real transaction will occur.)
            </p>
          </div>
          <button
            onClick={() => setShowConfirmation(false)}
            className="btn-secondary"
          >
            Edit Details
          </button>
        </div>
      )}
    </div>
  );
};

export default AdoptPage;