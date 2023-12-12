const fs = require('fs');
const path = require('path');


const dirPaths = process.argv.slice(2)
for (const dirPath of dirPaths) {
    sortRenameDirFiles(dirPath)
}


function sortRenameDirFiles(dirPath) {
    console.log('')

    if (!dirPath) {
        console.log('Missing dir path.')
        console.log('Skipping.')
        return;
    }

    console.log('directory: ' + dirPath);

    if (!fs.existsSync(dirPath)) {
        console.log('directory not found.')
        console.log('Skipping.')
        return
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
            dir: oldFilePathParsed.dir,
            name: newFileName,
            ext: oldFilePathParsed.ext,
        });

        fs.renameSync(oldFilePath, newFilePath);

        console.log('Renamed ' + oldFilePath + " to " + newFilePath);
    }
}

