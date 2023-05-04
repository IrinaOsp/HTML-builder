const path = require('path');
const fs = require('fs');
const process = require('process');

const inputStr = fs.createWriteStream(path.join(__dirname, 'input.txt'), 'utf-8');

const readline = require('node:readline');
const {
  stdin: input,
  stdout: output,
} = require('node:process');

const rl = readline.createInterface({ input, output });

rl.write('Hi there! Enter your text: ');
rl.on('line', (text) => {
  if (text === 'exit') {
    rl.close();
    inputStr.close();
  } else {
    inputStr.write(text+'\n');
  }
});
process.on('exit', () => {
  rl.write('Bye bye!');
});