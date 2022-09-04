const { saveData } = require('../../repository/PizzaRepository')
const mapper = require('./mapper')

const validateRequestData = (requestData) => {
    if(!requestData.sabor?.trim()) {
        throw "Sabor da Pizza não pode ser vazio"
    }

    if(!requestData.ingredientes?.length) {
        throw "Não é possível salvar uma pizza sem ingredientes"
    }
}

const savePizzaDomain = (requestData) => {
    validateRequestData(requestData)
    saveData(mapper(requestData))
}

module.exports = {
    savePizzaDomain
}