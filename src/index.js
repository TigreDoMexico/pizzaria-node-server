const http = require('http');
const { getFileContent } = require('./static-file-manager')
const header = require('./header-response')

const hostname = '127.0.0.1';
const port = 3000;

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

const server = http.createServer(async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res)
            break;
        case "POST":
            header.setCors(res)
            res.end()
            break;
        case "OPTIONS":
            header.setCors(res)
            res.end()
            break;
        default:
            header.setBadRequest(res)
            res.end()
            break;
    }
});

server.listen(port, hostname, () => {
    console.log('Pizzaria Server');
    console.log(`Servidor iniciado na ULR: http://${hostname}:${port}/`);
});