const btn_montar = document.getElementById('btn-montar')
const input_sabor = document.getElementById('input-sabor')
const select_ingr = document.getElementById('select-ingr')
const p_error = document.getElementById('p-error')

btn_montar.addEventListener('click', async () => {
    const sabor = input_sabor.value;
    const ingrediente = select_ingr.value;

    const data = {
        sabor,
        ingredientes: [{ nome: ingrediente }]
    }

    try {
        await sendPizzaData(data)
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