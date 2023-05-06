const path = require('path');
const fs = require('fs');

const stylesPath = path.join(__dirname, 'styles');

fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
  if (err) return;
  const arrCSS = [];

  fs.rm(path.join(__dirname, 'project-dist', 'bundle.css'), (err) => {
    if (err) console.log('bundle.css to be created');
  });
  const fileArr = [];
  files.forEach(file => {
    const filePath = path.join(__dirname, 'styles', file.name);
    if (file.isFile() && path.extname(filePath) === '.css') {
      fileArr.push(file);
    }
  });

  fileArr.forEach((fileCSS, index) => {
    const fileCSSPath = path.join(__dirname, 'styles', fileCSS.name);
    const stream = fs.createReadStream(fileCSSPath, 'utf-8');
    stream.on('data', (data) => {
      arrCSS.push(data);
      if (index === fileArr.length-1) {
        fs.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), arrCSS.join(''), (err) => {
          if (err) console.log('error');
        });
      }
    });
  });
});