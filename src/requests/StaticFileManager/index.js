const fs = require('fs').promises;
const process = require('process');

let content = {}

const readUtf8File = async (fileName) => await fs.readFile(process.cwd() + "/src/public/" + fileName, 'utf-8')
const readNonEncodingFile = async (fileName) => await fs.readFile(process.cwd() + "/src/public/" + fileName)

const getFileContent = async (fileName, encodeUtf8) => {
    if (!content[fileName]) {
        content[fileName] = encodeUtf8 ? await readUtf8File(fileName) : await readNonEncodingFile(fileName);
    }

    return content[fileName]
}

module.exports = {
    getFileContent
}