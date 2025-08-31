
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Load configuration
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Use path from config file, resolved from the server file's location
const questionSetsDir = path.resolve(__dirname, config.questionSetPath);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/images', express.static(questionSetsDir));


// Utility to ensure directory exists
const ensureExists = async (dirPath) => {
  try {
    await fs.promises.access(dirPath);
  } catch (e) {
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureExists(questionSetsDir);
    cb(null, questionSetsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


// --- API Endpoints ---

// GET all question sets metadata
app.get('/api/question-sets', async (req, res) => {
  try {
    const indexPath = path.join(questionSetsDir, 'index.json');
    const data = await fs.readFile(indexPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Error reading index.json', 
      error: {
        message: error.message,
        path: error.path,
        code: error.code
      }
    });
  }
});

// POST to update index.json
app.post('/api/question-sets', async (req, res) => {
    try {
        const indexPath = path.join(questionSetsDir, 'index.json');
        await fs.writeFile(indexPath, JSON.stringify(req.body, null, 2), 'utf-8');
        res.json({ message: 'index.json updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error writing to index.json', error: error.message });
    }
});


// GET a specific question set
app.get('/api/question-sets/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(questionSetsDir, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: `File not found: ${filename}`, error: error.message });
  }
});

// POST to update/create a specific question set
app.post('/api/question-sets/:filename', async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(questionSetsDir, filename);
  try {
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
    res.json({ message: `${filename} saved successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error saving ${filename}`, error: error.message });
  }
});

// DELETE a specific question set
app.delete('/api/question-sets/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(questionSetsDir, filename);
    try {
        await fs.unlink(filePath);
        res.json({ message: `${filename} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error deleting ${filename}`, error: error.message });
    }
});


// POST to upload an image
app.post('/api/images', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  res.json({ message: 'Image uploaded successfully', filename: req.file.filename });
});

// DELETE an image
app.delete('/api/images/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(questionSetsDir, filename);
    try {
        await fs.unlink(filePath);
        res.json({ message: `Image ${filename} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error deleting image ${filename}`, error: error.message });
    }
});


app.listen(port, () => {
  console.log(`Authoring tool backend listening at http://localhost:${port}`);
});
