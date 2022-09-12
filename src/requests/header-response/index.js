const setSuccess = (res) => res.statusCode = 200
const setError = (res) => res.statusCode = 500
const setBadRequest = (res) => res.statusCode = 405

const setHtmlContent = (res) => {
    setSuccess(res)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
}

const setImageContent = (res) => {
    setSuccess(res)
    res.setHeader('Content-Type', 'image/png');
}

const setJsonContent = (res) => {
    setSuccess(res)
    res.setHeader('Content-Type', 'application/json');
}

const setCors = (res) => {
    setSuccess(res)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
}

module.exports = {
    setSuccess,
    setError,
    setBadRequest,
    setCors,
    setHtmlContent,
    setImageContent,
    setJsonContent
}
