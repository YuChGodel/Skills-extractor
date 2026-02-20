const express = require('express');
const cors = require('cors');
const skillsRoutes = require('./routes/skillsRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

// Mount skills API routes
app.use('/api/skills', skillsRoutes);

// Handle multer file filter errors
app.use((err, req, res, next) => {
  if (err && err.message === 'Only PDF files are allowed.') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Skills Extractor server running on http://localhost:${PORT}`);
});

module.exports = app;
