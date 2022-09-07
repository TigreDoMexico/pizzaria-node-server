const pizzaMapper = (requestData) => ({
    sabor: requestData.sabor,
    valor: requestData.preco ?? 0,
    ingredientes: requestData.ingredientes?.map((el) => ({
        nome: el.nome,
        valor: el.preco ?? 0
    })) ?? []
})

module.exports = pizzaMapper