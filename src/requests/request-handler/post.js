const header = require('../header-response')
const { generateAuthToken } = require('../../auth')

const onLoginHandler = (data, req, res) => {
  const result = generateAuthToken(data);

  if (result.auth) header.setSuccess(res);
  else header.setBadRequest(res);

  res.end(JSON.stringify(result));
};

module.exports = {
    onLoginHandler
}