const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Serve the index.html file when visiting the root
app.get('/', (req, res) => {
  res.redirect('https://ytube.eu.org/');
});

// Handle video download requests
app.get('/download', (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format;
  const quality = req.query.quality || 'highest';
  let contentType, filenamePrefix, filenameSuffix;

  if (!ytdl.validateURL(videoUrl)) {
    res.redirect('https://ytube.eu.org/error.html'); // redirect to error.html if URL is invalid
    return;
    }

  if (format === 'mp3') {
    contentType = 'audio/mpeg';
    filenamePrefix = 'YTube-';
    filenameSuffix = '.mp3';
  } else {
    contentType = 'video/mp4';
    filenamePrefix = 'YTube-';
    filenameSuffix = '.mp4';
  }

  ytdl.getBasicInfo(videoUrl).then(info => {
    const filename = filenamePrefix + info.videoDetails.title.replace(/[^\w\s]/gi, '') + filenameSuffix;
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    ytdl(videoUrl, { quality: quality, filter: format === 'mp3' ? 'audioonly' : 'videoandaudio' })
      .pipe(res.type(contentType));
  }).catch(err => {
    res.status(400).send('Invalid URL');
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

let count = 1;

const printKEEPONLINE = () => {
  console.log(`Server is online = ${count}`);
  count++;
};

setInterval(printKEEPONLINE, 30000); // 20000 milliseconds (20 seconds)
