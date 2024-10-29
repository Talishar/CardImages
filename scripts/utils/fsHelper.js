const fs = require('fs');

const createFolderIfNotExists = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
}

const checkIfPathExists = (path) => fs.existsSync(path);

const createJsonIfNotExists = (path) => {
    if (!fs.existsSync(path)) {
        fs.writeFile(path, JSON.stringify({}, null, 2), () => {});
    }
}

const readJSON = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
};

const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

module.exports = {
    createFolderIfNotExists,
    checkIfPathExists,
    createJsonIfNotExists,
    readJSON,
    writeJSON
};
