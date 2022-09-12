const header = require('../header-response')
const { savePizzaDomain } = require('../../domain/PizzaDomain')
const { getFileContent } = require('../static-file-manager')

const handleGetRequest = async (req, res) => {
    let fileName = req.url.substring(1);
    if(!fileName) {
        fileName = 'page.html'
        header.setHtmlContent(res)
    }

    let fileContent = ''

    if(fileName.startsWith("images")) {
        fileContent = await getFileContent(fileName)
        header.setImageContent(res)
    }
    else {
        fileContent = await getFileContent(fileName, true)
        header.setSuccess(res)
    }

    res.end(fileContent)
}

const handlePostRequest = async (req, res) => {
    const data = await getBodyJSONResponse(req)
    try {
        savePizzaDomain(data)

        header.setCors(res)
        res.end()
    } catch(ex) {
        res.statusCode = 400
        res.end(ex)
    }
}

const getBodyJSONResponse = (req) => new Promise((resolve) => {
    let data = '';

    req.on('data', chunk => {
        data += chunk;
    });

    req.on('end', () => {
        resolve(JSON.parse(data));
    });
})

module.exports = {
    handleGetRequest,
    handlePostRequest,
}