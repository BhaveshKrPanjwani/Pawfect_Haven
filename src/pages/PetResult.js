import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PetResults = () => {
  const [pets, setPets] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const petType = queryParams.get("pet");
  const userLocation = queryParams.get("location");

  useEffect(() => {
    fetch(`http://localhost:5000/api/pets?type=${petType}&location=${userLocation}`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Error fetching pets:", err));
  }, [petType, userLocation]);

  return (
    <div className="pet-results">
      <h2>Available {petType}s in {userLocation}</h2>
      <div className="pet-list">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} />
              <h3>{pet.name}</h3>
              <p>Breed: {pet.breed}</p>
              <p>{pet.description}</p>
              <p>Location: {pet.location}</p>
            </div>
          ))
        ) : (
          <p>No {petType}s available in {userLocation}.</p>
        )}
      </div>
    </div>
  );
};

export default PetResults;
