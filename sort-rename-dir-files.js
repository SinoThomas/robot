const fs = require('fs');
const path = require('path');


// Get dir path from arguments
const dirPath = process.argv[2];
if (!dirPath) {
    console.log('Missing dir path.')
    console.log('Exiting.')
    process.exit(0)
}

console.log('directory: '+ dirPath);

if(!fs.existsSync(dirPath)){
    console.log('directory not found.')
    console.log('Exiting.')
    process.exit(0)
}



// Get all file in dir & sort
const fileNames = fs.readdirSync(dirPath).sort()



// Rename files
for (let i = 0; i < fileNames.length; i++) {
    const oldFileName = fileNames[i];
    const oldFilePath = path.join(dirPath, oldFileName)
    const oldFilePathParsed = path.parse(oldFilePath);

    const newFileName = String(i + 1).padStart(2, 0);
    const newFilePath = path.format({
        root: oldFilePathParsed.root,
        dir:  oldFilePathParsed.dir,
        name:  newFileName,
        ext:  oldFilePathParsed.ext,
    });

    fs.renameSync(oldFilePath, newFilePath);

    console.log('Renamed ' + oldFilePath + " to " + newFilePath);
}
