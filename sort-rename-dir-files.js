const fs = require('fs');
const path = require('path');


const parentDirPath = process.argv[2];

const dirPaths = fs.readdirSync(parentDirPath, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(dirent.path, dirent.name));

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
    const fileNames = fs.readdirSync(dirPath).filter(path => !path.startsWith('.')).sort()

    // Rename files
    for (let i = 0; i < fileNames.length; i++) {
        const oldFileName = fileNames[i];
        const oldFilePath = path.join(dirPath, oldFileName)
        const oldFilePathParsed = path.parse(oldFilePath);

        const newFileName = String(i + 1).padStart(fileNames.length.toString().length, '0');
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

