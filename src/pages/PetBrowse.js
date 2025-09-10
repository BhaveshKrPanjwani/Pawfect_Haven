import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PetBrowse = () => {
  // `pets` will store the original fetched list of all pets
  const [pets, setPets] = useState([]);
  // `filteredPets` will store the pets after applying search and type filters
  const [filteredPets, setFilteredPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);   // State for error handling

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/pets");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn("Fetched data is not an array:", data);
          setPets([]); // Ensure pets is always an array
          setFilteredPets([]);
        } else {
          setPets(data);
          setFilteredPets(data); // Initialize filtered pets with all pets
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []); // Empty dependency array means this runs once on component mount

  // Effect for filtering pets whenever searchQuery, filterType, or the original pets list changes
  useEffect(() => {
    let results = [...pets]; // Start with a copy of the original pets list

    if (searchQuery) {
      results = results.filter((pet) =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      results = results.filter((pet) => pet.type === filterType);
    }

    setFilteredPets(results);
  }, [searchQuery, filterType, pets]); // Dependencies for this effect

  const handleAdopt = (petId) => {
    navigate(`/adopt/${petId}`);
  };

  if (loading) {
    return <div className="loading-indicator">Loading pets...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="pet-browse-container"> {/* Changed class name for clarity */}
      {/* Quiz Button */}
      <button className="quiz-btn" onClick={() => navigate("/quiz")}>
        Take the Quiz
      </button>

      {/* Search and Filter Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search pet by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="type-filter-select"
        >
          <option value="">All Pets</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Fish">Fish</option>
          <option value="Bird">Bird</option>
          {/* Add more pet types as needed */}
        </select>
      </div>

      {/* Pet Listings */}
      <div className="pet-list-display"> {/* Changed class name for clarity */}
        {filteredPets.length > 0 ? (
          filteredPets.map((pet) => (
            // Use pet._id if your backend provides _id, otherwise pet.id
            <div key={pet._id || pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <h3>{pet.name}</h3>
              <p>Breed: {pet.breed}</p>
              <p>{pet.description}</p>
              <p>Location: {pet.location}</p>
              <button
                className="adopt-btn"
                onClick={() => handleAdopt(pet._id || pet.id)}
              >
                Adopt {pet.name}
              </button>
            </div>
          ))
        ) : (
          <p>No pets found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default PetBrowse;