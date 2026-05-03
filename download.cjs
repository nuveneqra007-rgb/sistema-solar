const fs = require('fs');
const https = require('https');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/';
const textures = {
  sun: 'sunmap.jpg',
  mercury: 'mercurymap.jpg',
  venus: 'venusmap.jpg',
  earth: 'earthmap1k.jpg',
  mars: 'marsmap1k.jpg',
  jupiter: 'jupitermap.jpg',
  saturn: 'saturnmap.jpg',
  uranus: 'uranusmap.jpg',
  neptune: 'neptunemap.jpg',
  saturnRings: 'saturnringcolor.jpg'
};

const dir = path.join(__dirname, 'public', 'textures');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function download() {
  for (const [key, filename] of Object.entries(textures)) {
    const url = baseUrl + filename;
    const dest = path.join(dir, filename);
    await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
          console.log(`Downloaded ${filename}`);
        });
      }).on('error', reject);
    });
  }
}

download().catch(console.error);
