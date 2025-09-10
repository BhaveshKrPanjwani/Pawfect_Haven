import { useState } from "react";

const SellPetForm = () => {
  const [pet, setPet] = useState({
    type: "",
    name: "",
    breed: "",
    description: "",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPet((prevPet) => ({
        ...prevPet,
        image: reader.result, // Convert image to Base64
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet),
    });

    if (response.ok) {
      alert("Pet listed successfully!");
      setPet({ type: "", name: "", breed: "", description: "", image: "" }); // Reset form
    } else {
      alert("Error listing pet.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sell-pet-form">
      <label>Pet Type:</label>
      <input
        type="text"
        name="type"
        value={pet.type}
        onChange={handleChange}
        required
      />

      <label>Pet Name:</label>
      <input
        type="text"
        name="name"
        value={pet.name}
        onChange={handleChange}
        required
      />

      <label>Breed:</label>
      <input
        type="text"
        name="breed"
        value={pet.breed}
        onChange={handleChange}
        required
      />

      <label>Description:</label>
      <textarea
        name="description"
        value={pet.description}
        onChange={handleChange}
        required
      />

      <label>Location:</label>
      <input
        type="text"
        name="location"
        value={pet.location}
        onChange={handleChange}
        required
      />

      <label>Upload Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />

      {pet.image && (
        <img
          src={pet.image}
          alt="Preview"
          style={{ width: "100px", marginTop: "10px" }}
        />
      )}

      <button type="submit">Sell Pet</button>
    </form>
  );
};

export default SellPetForm;
