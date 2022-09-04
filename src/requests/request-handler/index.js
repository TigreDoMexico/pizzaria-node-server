const header = require('../header-response')
const { savePizzaDomain } = require('../../domain/PizzaDomain')

const handleGetRequest = async (req, res) => {
    let fileName = req.url.substring(1);
    if(!fileName) {
        fileName = 'page.html'
        header.setHtmlContent(res)
    }

    const fileContent = await getFileContent(fileName)
    header.setSuccess(res)
    res.end(fileContent)
}

const handlePostRequest = async (req, res) => {
    const data = await getBodyJSONResponse(req)
    try {
        savePizzaDomain(data)

        header.setCors(res)
        res.end()
    } catch(ex) {
        header.setError(res)
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