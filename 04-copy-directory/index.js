const path = require('path');
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;

const pathCopyFolder = path.join(__dirname, 'files-copy');
const pathFolder = path.join(__dirname, 'files');

fs.mkdir(pathCopyFolder, { recursive: true, force: true, }, (err) => {
  if (err) return;
});

fs.readdir(pathCopyFolder, (err, files) => {
  if (err) return;
  files.forEach(file => {
    fs.unlink(path.join(pathCopyFolder, file), (err) => {
      if (err) throw err;
    });
  });
});

fs.readdir(pathFolder, {withFileTypes: true}, (err, files) => {
  if (err) return;

  files.forEach(file => {
    if (file.isFile()) {
      fs.copyFile(path.resolve(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), COPYFILE_EXCL, (err)=> {
        if (err) {
          console.log(`File ${file.name} already exists`);
        } else {
          console.log(`File ${file.name} copied`);
        }
      });
    }
  });
});

