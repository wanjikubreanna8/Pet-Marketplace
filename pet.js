const apiUrl = 'http://localhost:3000/pets';  // Replace with your backend URL

let pets = [];  // Array to hold the fetched pets

// Get references to the DOM elements
const petForm = document.getElementById('petForm');
const viewPetsBtn = document.getElementById('viewPetsBtn');
const petsGrid = document.getElementById('petsGrid');
const petModal = document.getElementById('petModal');
const closeModal = document.querySelector('.close-modal');

// Fetch pets from the server (GET request)
async function fetchPets() {
  try {
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('Fetched pets:', data); // Log the response to verify the structure
      pets = data.pets || [];  // Populate the pets array with the response data
      renderPets();  // Call renderPets to update the UI
    } else {
      console.error('Failed to fetch pets');
    }
  } catch (error) {
    console.error('Error fetching pets:', error);
  }
}

// Function to render pets on the page
function renderPets() {
  petsGrid.innerHTML = '';  // Clear any existing content before rendering new pets
  
  if (!pets.length) {
    petsGrid.innerHTML = '<p>No pets available</p>'; // Display message if no pets exist
    return;
  }

  pets.forEach(pet => {
    const petCard = document.createElement('div');
    petCard.classList.add('pet-card');
    
    petCard.innerHTML = `
      <img src="${pet.image}" alt="${pet.name}" class="pet-image">
      <div class="pet-info">
        <h3 class="pet-name">${pet.name}</h3>
        <p class="pet-species">${pet.species}</p>
        <p class="pet-price">$${pet.price.toFixed(2)}</p>
      </div>
    `;
    
    // Show pet details in a modal when clicked
    petCard.addEventListener('click', function() {
      showPetModal(pet);
    });

    petsGrid.appendChild(petCard);
  });
}

// Function to show pet details in a modal
function showPetModal(pet) {
  const modalPetImage = document.getElementById('modalPetImage');
  const modalPetName = document.getElementById('modalPetName');
  const modalPetSpecies = document.getElementById('modalPetSpecies');
  const modalPetPrice = document.getElementById('modalPetPrice');
  const modalPetDescription = document.getElementById('modalPetDescription');
  
  modalPetImage.src = pet.image;
  modalPetName.textContent = pet.name;
  modalPetSpecies.textContent = pet.species;
  modalPetPrice.textContent = `$${pet.price.toFixed(2)}`;
  modalPetDescription.textContent = pet.description;

  petModal.style.display = 'block'; // Show the modal

  closeModal.addEventListener('click', function() {
    petModal.style.display = 'none'; // Close the modal
  });
}

// Event listener for "View All Pets" button
viewPetsBtn.addEventListener('click', function() {
  fetchPets();  // Fetch and display pets when the button is clicked
});

// Handle form submission to add a new pet
petForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById('petName').value.trim();
  const species = document.getElementById('petSpecies').value;
  const price = parseFloat(document.getElementById('petPrice').value);
  const description = document.getElementById('petDescription').value.trim();
  const image = document.getElementById('petImage').value.trim();

  let isValid = true;

  // Validate form data
  if (!name) {
    document.getElementById('nameError').textContent = 'Pet name is required';
    isValid = false;
  } else {
    document.getElementById('nameError').textContent = '';
  }

  if (!species) {
    document.getElementById('speciesError').textContent = 'Please select a species';
    isValid = false;
  } else {
    document.getElementById('speciesError').textContent = '';
  }

  if (isNaN(price) || price <= 0) {
    document.getElementById('priceError').textContent = 'Please enter a valid price';
    isValid = false;
  } else {
    document.getElementById('priceError').textContent = '';
  }

  if (!description) {
    document.getElementById('descriptionError').textContent = 'Description is required';
    isValid = false;
  } else {
    document.getElementById('descriptionError').textContent = '';
  }

  if (!image) {
    document.getElementById('imageError').textContent = 'Image URL is required';
    isValid = false;
  } else {
    document.getElementById('imageError').textContent = '';
  }

  if (!isValid) return; // Return early if validation fails

  // Create new pet object
  const newPet = { name, species, price, description, image };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPet),
    });

    if (response.ok) {
      const data = await response.json();
      pets.push(data.pet); // Assuming the backend returns the newly added pet
      petForm.reset(); // Reset the form
      alert('Pet listed successfully!');
      renderPets();  // Re-render the pets list after adding a new pet
    } else {
      console.error('Failed to add new pet');
    }
  } catch (error) {
    console.error('Error adding new pet:', error);
  }
});

// Fetch pets when the page loads
document.addEventListener('DOMContentLoaded', fetchPets);
