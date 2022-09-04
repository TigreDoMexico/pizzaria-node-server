const tempData = []

const saveData = (data) => {
    console.log("Dados Salvos com Sucesso")
    tempData.push(data)
}

module.exports = {
    saveData
}