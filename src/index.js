const http = require('http');
const header = require('./requests/header-response')
const { handleGetRequest, handlePostRequest } = require('./requests/request-handler')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    switch (req.method) {
        case "GET":
            await handleGetRequest(req, res)
            break;
        case "POST":
            await handlePostRequest(req, res)
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