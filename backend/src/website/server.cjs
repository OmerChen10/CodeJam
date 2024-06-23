const app = require('express')();
const path = require('path');
const https = require('https');
const fs = require('fs');
const dist_path = path.join(__dirname, '../../../frontend/src/dist');

// Define certificate path
const cert_path = path.join(__dirname, '../../../.credentials/cert.pem');
const key_path = path.join(__dirname, '../../../.credentials/key.pem');

// Define HTTPS server
const https_server = https.createServer({
  key: fs.readFileSync(key_path, 'utf8'),
  cert: fs.readFileSync(cert_path, 'utf8')
}, app);

// Serve static files
app.use(require('express').static(dist_path));

// Serve all endpoints to index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(dist_path, 'index.html'));
});

// Protect against DDOS attacks
app.use(require('express-rate-limit')({
  windowMs: 15 * 60 * 1000,
  max: 100 // 100 requests per 15 minutes
}));

// Start the server
https_server.listen(443, '0.0.0.0');