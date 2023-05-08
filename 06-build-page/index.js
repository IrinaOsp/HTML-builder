const path = require('path');
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;

//creation of project-dist folder and copy assets folder

const pathToDist = path.join(__dirname, 'project-dist');
// const pathToDistAssets = path.join(pathToDist, 'assets');

// function clearDir(pathToDistAssets) {
//   fs.readdir(pathToDistAssets, {withFileTypes: true}, (err, elements) => {
//     if (err) console.log('checkDir' + err);
//     elements.forEach(el => {
//       if (el.isFile()) {
//         fs.rm(path.join(pathToDistAssets, el.name), (err) => {console.log('DELETE err ' + err);});
//       }
//       if (el.isDirectory()) {
//         clearDir(path.join(pathToDistAssets, el.name));
//       }
//     });
//   });
// }

fs.mkdir(pathToDist, { recursive: true, force: true, }, (err) => {
  if (err) return;
});
const pathToAssets = path.join(__dirname, 'assets');

fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true, }, (err) => {
  if (err) return;
});

const targetFolder = path.join(__dirname, 'project-dist', 'assets');

const copyDir = (pathToAssets, targetFolder) => {
  fs.readdir(pathToAssets, {withFileTypes: true}, (err, files) => {
    if (err) return;
    files.forEach(file => {
      const sourcePath = path.join(pathToAssets, file.name);
      const targetPath = path.join(targetFolder, file.name);
      if (file.isDirectory()) {
        fs.mkdir(path.join(targetFolder, file.name), { recursive: true, force: true, }, (err) => {
          if (err) console.log('ERROR');
        });
        copyDir(sourcePath, targetPath);

      } else if (file.isFile()) {
        fs.copyFile(path.join(pathToAssets, file.name), path.join(targetFolder, file.name), COPYFILE_EXCL, (err)=> {
          if (err) {
            console.log(`File ${file.name} already exists`);
          } else {
            console.log(`File ${file.name} copied`);
          }
        });
      }
    });
  });
};

copyDir(pathToAssets, targetFolder);

//replacement of sample tags in html
let indexContent = '';
fs.rm(path.join(__dirname, 'project-dist', 'index.html'), () => {});

const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const matches = [];

readableStream.on('data', (data) => {
  let str = data;
  const regex = /{{(.*?)}}/g;
  let match;
  while ((match = regex.exec(str))) {
    matches.push(match[1]);
  }

  if (matches.length > 0) {
    fs.readdir(path.join(__dirname, 'components'), {withFileTypes: true}, (err, files) => {
      if (err) console.log('error');
      indexContent = str;
      files.forEach((file, index) => {
        const point = /[^\w\s]/g;
        const fileName = file.name.slice(0, file.name.search(point));
        if (matches.includes(fileName)) {

          const stream = fs.createReadStream(path.join(__dirname, 'components', file.name), 'utf-8');
          stream.on('data', (data) => {
            indexContent = indexContent.replace(`{{${fileName}}}`, data);
            if (index >= files.length-1) {
              fs.appendFile(path.join(__dirname, 'project-dist', 'index.html'), indexContent, (err) => {
                if (err) console.log('error');
              });
            }
          });
        }
      });
    });
  }
});

//creation of styles .css

const stylesPath = path.join(__dirname, 'styles');

fs.readdir(stylesPath, {withFileTypes: true}, (err, files) => {
  if (err) return;
  const arrCSS = [];
  const fileArr = [];
  fs.rm(path.join(__dirname, 'project-dist', 'style.css'), (err) => {
    if (err) console.log('styles.css is not yet exists ' + err);
  });
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
        fs.appendFile(path.join(__dirname, 'project-dist', 'style.css'), arrCSS.join(''), (err) => {
          if (err) console.log('error');
        });
      }
    });
  });
});