require("dotenv-safe").config();
const jwt = require("jsonwebtoken");

const generateAuthToken = (bodyData) => {
  if (bodyData.usuario && bodyData.senha) {
    const id = 1;

    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 300,
    });

    return { auth: true, token: token };
  }

  return { auth: false, token: null };
};

const validateAuthToken = (token) => {
  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return { auth: false, message: "Falha para autenticar" }

    return { auth: true, id: decoded.id }
  });
};

module.exports = {
  generateAuthToken,
  validateAuthToken,
};
