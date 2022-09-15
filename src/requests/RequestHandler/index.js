const header = require('../header-response')
const { savePizzaDomain, getIngredientesListDomain, getAllPizzasSaved } = require('../../domain/PizzaDomain')
const { getFileContent } = require('../StaticFileManager')

const handleGetRequest = async (req, res) => {
    if (req.url.startsWith('/api/')) {
        handleApiGetRequest(req, res)
    } else {
        await handleFileGetRequest(req, res)
    }
}

const handlePostRequest = async (req, res) => {
    const data = await getBodyJsonResponse(req)
    try {
        savePizzaDomain(data)

        header.setCors(res)
        res.end()
    } catch (ex) {
        res.statusCode = 400
        res.end(ex)
    }
}

const handleApiGetRequest = (req, res) => {
    var route = req.url.split('/')[2].trim()

    switch(route) {
        case 'ingredientes':
            const ingredientes = getIngredientesListDomain()
            header.setJsonContent(res)
            res.end(JSON.stringify(ingredientes))
            break;
        case 'pizzas':
            const pizzas = getAllPizzasSaved()
            header.setJsonContent(res)
            res.end(JSON.stringify(pizzas))
            break;
        default:
            header.setBadRequest(res)
            res.end()
            break;
    }
}

const handleFileGetRequest = async (req, res) => {
    let fileName = req.url.substring(1);
    if (!fileName) {
        fileName = 'page.html'
        header.setHtmlContent(res)
    }

    let fileContent = ''

    if (fileName.startsWith("images")) {
        fileContent = await getFileContent(fileName)
        header.setImageContent(res)
    }
    else {
        fileContent = await getFileContent(fileName, true)
        header.setSuccess(res)
    }

    res.end(fileContent)
}

const getBodyJsonResponse = (req) => new Promise((resolve) => {
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