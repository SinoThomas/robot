const Big = require('big.js');
const fs = require('node:fs');


const startPower = Number(process.argv[2]) || 0;
console.log('startPower is ', startPower);
const endPower = Number(process.argv[3]) || Infinity;
console.log('endPower is ', endPower);


// removeDir('../2^')
createDir('../2^')

const n2 = new Big(2)
let contentArr = []

let startNumber = n2.pow(startPower)

for (let i = 1; i <= endPower - startPower; i += 1) {
    const newPower = startPower + i;
    const f = Math.floor(Number(newPower / 1000)) * 1000
    createDir('../2^/' + f);
    const filePath = '../2^/' + f + '/' + newPower + '.txt';

    if (fileExist(filePath)) continue;

    const startT = performance.now();
    startNumber = startNumber.times(2)
    const endT = performance.now();
    const t = Number(endT - startT).toFixed();

    if (newPower % 1000 === 0) {
        for (const {filePath, content} of contentArr) {
            writeFile(filePath, content);
        }
        contentArr = []
    }
    contentArr.push({filePath, content: startNumber.toFixed(0)})

    console.log('2^' + newPower + "(" + t + "ms)" + ' ' + startNumber.toFixed(0).length + " long");
}


function createDir(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    } catch (err) {
        console.error(err);
    }
}

function removeDir(dirPath) {
    try {
        fs.rmdirSync(dirPath, {recursive: true});
    } catch (err) {
        console.error(err);
    }
}

function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
    } catch (err) {
        console.error(err);
    }
}

function fileExist(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false
    }
}
