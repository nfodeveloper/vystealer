const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const deleteFileAfter24Hours = (filePath) => {
  setTimeout(() => {
    fs.unlink(filePath, (err) => {
      if (err) {
      } else {
      }
    });
  }, 24 * 60 * 60 * 1000); 
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const originalFilename = file.originalname;
    const sanitizedFilename = originalFilename.replace(/\s+/g, '-'); 
    cb(null, sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

app.post('/send', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(uploadDirectory, req.file.filename);

  deleteFileAfter24Hours(filePath);

  const fileUrl = `https://${req.headers.host}/download/${req.file.filename}`;
  res.status(200).send({
    message: 'ok',
    fileUrl: fileUrl,
  });
});

app.use('/download', express.static(uploadDirectory));

app.get('/download/:file', (req, res) => {
  const filenameWithRandomNumber = req.params.file;
  
  const filename = filenameWithRandomNumber.replace(/^\d+-/, ''); 
  const sanitizedFilename = filename.replace(/-/g, ' ');

  const filePath = path.join(uploadDirectory, sanitizedFilename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, sanitizedFilename, (err) => {
      if (err) {
        res.status(500).send('Error downloading the file');
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});

app.listen("80", () => {
});
