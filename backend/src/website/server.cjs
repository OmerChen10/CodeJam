const app = require('express')();
const path = require('path');

const dist_path = path.join(__dirname, '../../../frontend/src/dist');

// Serve static files
app.use(require('express').static(dist_path));

// Define website root
app.get('/', (req, res) => {
  res.sendFile(path.join(dist_path, 'index.html'));
});

// Start the server
app.listen(80);