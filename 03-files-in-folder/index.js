const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');
fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  if (err) return;

  files.forEach(file => {
    if (file.isFile()) {
      const fileName = file.name;
      const filePath = path.join(__dirname, 'secret-folder', fileName);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        console.log(path.basename(filePath, path.extname(filePath))  + ' - ' + path.extname(filePath).slice(1) + ' - ' + stats.size + 'b');
      })
    } else {
      return;
    }
  })
});

