// server.js
console.log("🔧 server.js started executing");

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const ROOT_DIR = path.join(__dirname, 'School');

app.use(express.static(ROOT_DIR));

// Recursive function to read all folders and files
function scanDirectory(dir) {
  const results = [];

  function walk(currentPath, relativePath = '') {
    let files;
    try {
      files = fs.readdirSync(currentPath);
    } catch (err) {
      console.error(`❌ ERROR reading directory: ${currentPath}`);
      console.error(err.message);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(currentPath, file);
      const relPath = path.join(relativePath, file);
      let stat;

      try {
        stat = fs.statSync(fullPath);
      } catch (err) {
        console.error(`❌ ERROR reading file stats: ${fullPath}`);
        return;
      }

      if (stat && stat.isDirectory()) {
        walk(fullPath, relPath);
      } else {
        results.push(relPath.replace(/\\/g, '/'));
      }
    });
  }

  walk(dir);
  return results;
}

app.get('/files', (req, res) => {
  const allFiles = scanDirectory(ROOT_DIR);
  res.json(allFiles);
});

app.listen(PORT, () => {
  console.log("🚀 Starting server...");
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
