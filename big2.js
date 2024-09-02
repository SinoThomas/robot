const Big = require('big.js');
const fs = require('node:fs');


// removeDir('../2^')
createDir('../2^')

const n2 = new Big(2);

const ps = [
    0,
    1,
];

for (let i = 1; i <= 100; i++) {
    ps.push(Big(10).pow(i))
}


let val = Big(1)
let pt = performance.now()
for (let p = Big(0); p.lte(Big(1000000)); p = p.plus(1)) {
    if (p.mod(1000).eq(0)) {
        const filePath = '../2^/' + p.toFixed(0) + '.txt';
        if (!fileExist(filePath)) {
            writeFile(filePath, val.toFixed(0));
        }
        t = Number(performance.now() - pt).toFixed();
        console.log('2^', p.toFixed(0), ' ', val.toFixed(0).length, 'long   Took', t, 'ms');
        pt = performance.now()
    }

    val = val.times(2);
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
