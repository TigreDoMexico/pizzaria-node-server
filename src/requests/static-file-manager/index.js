const fs = require('fs').promises;
const process = require('process');

let content = {}

const getFileContent = async (fileName) => {
    if(!content[fileName]) {
        content[fileName] = await fs.readFile(process.cwd() + "/src/public/" + fileName, 'utf-8');
    }

    return content[fileName]
}

module.exports = {
    getFileContent
}