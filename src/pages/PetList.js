// PetList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Make sure react-router-dom is installed and configured

const PetList = ({ petType, location }) => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // This fetch is causing the "Cannot GET" if the backend is not ready
    fetch("http://localhost:5000/api/pets")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Ensure data is an array before filtering
        const filteredPets = Array.isArray(data)
          ? data.filter(
              (pet) =>
                pet.type === petType &&
                pet.location.toLowerCase() === location.toLowerCase()
            )
          : []; // Handle cases where data might not be an array
        setPets(filteredPets);
      })
      .catch((error) => console.error("Fetch error:", error)); // Catch network/parsing errors
  }, [petType, location]);

  return (
    <div className="pet-list">
      <h2>
        Available {petType}s in {location}
      </h2>
      {pets.length === 0 ? <p>No pets found in your area.</p> : null}

      <div className="pet-container">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card"> {/* Added class for styling */}
            <h3>{pet.name}</h3>
            <p>Breed: {pet.breed}</p>
            <p>Location: {pet.location}</p>
            {pet.image && (
              <img
                src={pet.image}
                alt={pet.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
            <Link to={`/adopt/${pet._id}`} className="adopt-button">
              Adopt {pet.name}
            </Link>{" "}
            {/* Link to individual adoption page */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetList;