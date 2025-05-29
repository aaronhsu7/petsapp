const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

let pets = [];

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const newPet = {
    id: Date.now(),
    name: req.body.name,
    image: req.file.filename,
    rating: 0,
    votes: 0,
  };
  pets.push(newPet);
  res.json(newPet);
});

app.get('/pets', (req, res) => {
  res.json(pets);
});

app.post('/rate/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const rating = parseInt(req.body.rating);
  const pet = pets.find(p => p.id === id);
  if (pet) {
    pet.rating = ((pet.rating * pet.votes) + rating) / (pet.votes + 1);
    pet.votes++;
    res.json(pet);
  } else {
    res.status(404).send('Pet not found');
  }
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});