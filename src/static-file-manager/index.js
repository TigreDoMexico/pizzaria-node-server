const fs = require('fs').promises;
const process = require('process');

let content = {}

const getFileContent = async (fileName) => {
    if(!content[fileName]) {
        content[fileName] = await fs.readFile(process.cwd() + "/src/public/" + fileName);
    }

    return content[fileName]
}

module.exports = {
    getFileContent
}