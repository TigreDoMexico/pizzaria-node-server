const tempData = []
const ingredientesData = [{ id: 1, nome: 'Queijo Mussarela', preco: 15.00 }, { id: 2, nome: 'Ovo', preco: 2.00 }]

const saveData = (data) => {
    console.log("Dados Salvos com Sucesso")
    tempData.push(data)
}

const getIngredientes = () => ingredientesData

module.exports = {
    saveData,
    getIngredientes
}