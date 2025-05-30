import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [newPet, setNewPet] = useState({ name: '', image: null });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredPets, setFilteredPets] = useState([]); // State for filtered pets

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    const response = await fetch('http://localhost:3000/pets');
    const data = await response.json();
    setPets(data);
    setFilteredPets(data); // Initialize filteredPets with all pets
  };

  useEffect(() => {
    // Filter pets based on search term
    const results = pets.filter(pet =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPets(results);
  }, [searchTerm, pets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newPet.name);
    formData.append('image', newPet.image);

    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setPets([...pets, data]);
    setNewPet({ name: '', image: null });
  };

  const handleRating = async (id, rating) => {
    const response = await fetch(`http://localhost:3000/rate/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    const updatedPet = await response.json();
    setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));
  };

  const getEmoji = (rating) => {
    if (rating >= 4.5) return '😍';
    if (rating >= 4) return '😄';
    if (rating >= 3) return '😊';
    if (rating >= 2) return '😐';
    return '🙁';
  };

  return (
    <div className="App">
      <h1>🐾 Pawsome Pet Rater 🐾</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pet name"
          value={newPet.name}
          onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
        />
        <input
          type="file"
          onChange={(e) => setNewPet({ ...newPet, image: e.target.files[0] })}
        />
        <button type="submit">Add Pet 🐶🐱</button>
      </form>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search pets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="pet-list">
        {filteredPets.map(pet => (
          <div key={pet.id} className="pet-card">
            <img src={`http://localhost:3000/uploads/${pet.image}`} alt={pet.name} />
            <h3>{pet.name}</h3>
            <p>
              Rating: {pet.rating.toFixed(1)} {getEmoji(pet.rating)} ({pet.votes} votes)
            </p>
            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map(rating => (
                <button key={rating} onClick={() => handleRating(pet.id, rating)}>
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;