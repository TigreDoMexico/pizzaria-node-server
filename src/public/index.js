const btn_montar = document.getElementById('btn-montar')
const btn_escolher_ingrediente = document.getElementById('btn-escolher-ingrediente')

const input_sabor = document.getElementById('input-sabor')
const select_ingr = document.getElementById('select-ingr')
const p_error = document.getElementById('p-error')

let listaIngredientes = []
let ingredientesEscolhidos = []

btn_escolher_ingrediente.addEventListener('click', async () => {
    const ingrediente = listaIngredientes.find((el) => el.id == select_ingr.value);
    const ingredienteJaEscolhido = ingredientesEscolhidos.some((el) => el.id === ingrediente?.id)

    if(ingrediente && !ingredienteJaEscolhido) {
        ingredientesEscolhidos.push(ingrediente)
        console.log(ingredientesEscolhidos)
    }

    select_ingr.value = ''
})

btn_montar.addEventListener('click', async () => {
    const sabor = input_sabor.value;
    const data = {
        sabor,
        ingredientes: ingredientesEscolhidos
    }

    try {
        await sendPizzaData(data)
        ingredientesEscolhidos = []
    } catch (error) {
        const errorMessage = await error.response.text()
        p_error.textContent = errorMessage
    }
})

const sendPizzaData = (data) => new Promise((resolve, reject) => {
    fetch('/', { method: 'POST', body: JSON.stringify(data) })
        .then(response => {
            if (!response.ok) {
                let err = new Error("HTTP status code: " + response.status)
                err.response = response
                err.status = response.status
                throw err
            }

            resolve(response)
        })
        .catch((error) => reject(error))
});

const getIngredientesList = () => new Promise((resolve, reject) => {
    fetch('/api/ingredientes', { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                let err = new Error("HTTP status code: " + response.status)
                err.response = response
                err.status = response.status
                throw err
            }

            resolve(response)
        })
        .catch((error) => reject(error))
});

window.addEventListener('load', async () => {
    const response = await getIngredientesList()
    listaIngredientes = await response.json()

    listaIngredientes.forEach(el => {
        const option = document.createElement('option')
        option.text = `${el.nome} (+ R$${el.preco})`
        option.value = el.id;
        select_ingr.add(option)
    })
}, false);