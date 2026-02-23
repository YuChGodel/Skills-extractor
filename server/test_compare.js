const express = require('express');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const app = express();

app.post('/test', upload.fields([
  { name: 'cvA', maxCount: 1 },
  { name: 'cvB', maxCount: 1 }
]), (req, res) => {
  console.log('req.files:', req.files);
  console.log('req.files.cvA:', req.files?.cvA);
  console.log('req.files.cvB:', req.files?.cvB);
  res.json({ files: req.files });
});

app.listen(4000, () => console.log('Test server on 4000'));
