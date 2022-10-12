const { handleGetRequest, handlePostRequest } = require('../../../src/requests/request-handler')
const fileContent = require('../../../src/requests/static-file-manager')
const domain = require('../../../src/domain/PizzaDomain')
const auth = require('../../../src/auth')

jest.mock('../../../src/requests/static-file-manager', () => ({
    getFileContent: jest.fn()
}))

jest.mock('../../../src/auth', () => ({
    validateAuthToken: jest.fn()
}))

jest.mock('../../../src/domain/PizzaDomain', () => ({
    savePizzaDomain: jest.fn(),
    getIngredientesListDomain: jest.fn()
}))

describe('DADO uma requisicao GET vinda do front sem query e sem rota', () => {
    const req = { url: '/' };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler GET', () => {
        const conteudoPageHtml = "<html></html>"
        beforeEach(() => {
            fileContent.getFileContent.mockImplementation(() => conteudoPageHtml);
        })

        it('DEVE buscar o conteudo do arquivo page.html', async () => {
            await handleGetRequest(req, res)
            expect(fileContent.getFileContent).toHaveBeenCalledWith('page.html', true)
        })

        it('DEVE salvar no response o conteudo da page.html', async () => {
            await handleGetRequest(req, res)
            expect(res.end).toHaveBeenCalledWith(conteudoPageHtml)
        })

        it('DEVE configurar o header do response de forma correta para HTML', async () => {
            await handleGetRequest(req, res)

            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html; charset=utf-8')
            expect(res.statusCode).toBe(200)
        })

        afterAll(() => {
            fileContent.getFileContent.mockClear()
        })
    })
})

describe('DADO uma requisicao GET vinda do front contendo na rota o nome de um arquivo', () => {
    const nomeArquivo = 'index.js'
    const req = { url: '/' + nomeArquivo };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler GET', () => {
        const conteudoArquivo = "alert('OLA')"
        beforeEach(() => {
            fileContent.getFileContent.mockImplementation(() => conteudoArquivo);
        })

        it('DEVE buscar o conteudo do arquivo', async () => {
            await handleGetRequest(req, res)
            expect(fileContent.getFileContent).toHaveBeenCalledWith(nomeArquivo, true)
        })

        it('DEVE salvar no response o conteudo do arquivo mencionado', async () => {
            await handleGetRequest(req, res)
            expect(res.end).toHaveBeenCalledWith(conteudoArquivo)
        })

        it('DEVE configurar o header do response de forma correta', async () => {
            await handleGetRequest(req, res)
            expect(res.statusCode).toBe(200)
        })

        afterAll(() => {
            fileContent.getFileContent.mockClear()
        })
    })
})

describe('DADO uma requisicao GET vinda do front contendo na rota de uma imagem PNG', () => {
    const nomeArquivo = 'images/teste.png'
    const req = { url: '/' + nomeArquivo };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler GET', () => {
        const conteudoArquivo = "arquivoPNG"
        beforeEach(() => {
            fileContent.getFileContent.mockImplementation(() => conteudoArquivo);
        })

        it('DEVE buscar o conteudo da imagem', async () => {
            await handleGetRequest(req, res)
            expect(fileContent.getFileContent).toHaveBeenCalledWith(nomeArquivo)
        })

        it('DEVE salvar no response o conteudo da imagem mencionada', async () => {
            await handleGetRequest(req, res)
            expect(res.end).toHaveBeenCalledWith(conteudoArquivo)
        })

        it('DEVE configurar o header do response da Imagem de forma correta', async () => {
            await handleGetRequest(req, res)
            expect(res.statusCode).toBe(200)
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png')
        })

        afterAll(() => {
            fileContent.getFileContent.mockClear()
        })
    })
})

describe('DADO uma requisicao GET vinda do front para a API Ingredientes', () => {
    const req = { url: '/api/ingredientes' };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler GET', () => {
        const ingredientesList = [{ nome: 'ingredienteA' }, { nome: 'ingredienteB' }]
        beforeEach(() => {
            domain.getIngredientesListDomain.mockImplementation(() => ingredientesList);
        })

        it('DEVE obter os ingredientes do DOMAIN', async () => {
            await handleGetRequest(req, res)
            expect(domain.getIngredientesListDomain).toHaveBeenCalledTimes(1)
        })

        it('DEVE salvar no response o conteudo do DOMAIN como JSON Stringify', async () => {
            await handleGetRequest(req, res)
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(ingredientesList))
        })

        it('DEVE configurar o header do response da API de forma correta', async () => {
            await handleGetRequest(req, res)
            expect(res.statusCode).toBe(200)
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
        })

        afterAll(() => {
            domain.getIngredientesListDomain.mockClear()
        })
    })
})

describe('DADO uma requisicao POST vinda do front sem rota e com body correto', () => {
    const dadosRequisicao = { sabor: "Mussarela" }
    const bodyRequisicao = JSON.stringify(dadosRequisicao)
    const req = {
        url: '/',
        headers: { authorization: "Bearer TOKEN" },
        on: jest.fn((_, callback) => callback(bodyRequisicao)),
    };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler POST', () => {
        beforeEach(() => {
            domain.savePizzaDomain.mockImplementation(() => true);
            auth.validateAuthToken.mockImplementation(() => ({ auth: true }));
        })

        it('DEVE enviar os dados do body para o domain', async () => {
            await handlePostRequest(req, res)
            expect(domain.savePizzaDomain).toHaveBeenCalledWith(dadosRequisicao)
        })

        it('DEVE chamar o response.end sem passar nenhum conteudo', async () => {
            await handlePostRequest(req, res)
            expect(res.end).toHaveBeenCalledWith()
        })

        it('DEVE configurar o header do response com o CORS', async () => {
            await handlePostRequest(req, res)
            expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
            expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'OPTIONS, POST, GET')
            expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
            expect(res.statusCode).toBe(200)
        })

        afterAll(() => {
            domain.savePizzaDomain.mockClear()
            auth.validateAuthToken.mockClear()
        })
    })
})

describe('DADO uma requisicao POST vinda do front sem rota e com body incorreto', () => {
    const dadosRequisicao = { sabor: "Mussarela" }
    const bodyRequisicao = JSON.stringify(dadosRequisicao)
    const req = {
        url: '/',
        headers: { authorization: "Bearer TOKEN" },
        on: jest.fn((_, callback) => callback(bodyRequisicao)),
    };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler POST e o Domain retornar um erro', () => {
        const erroDomain = 'ERRO DOMAIN'
        beforeEach(() => {
            domain.savePizzaDomain.mockImplementation(() => { throw erroDomain });
            auth.validateAuthToken.mockImplementation(() => ({ auth: true }));
        })

        it('DEVE configurar o header como 400', async () => {
            await handlePostRequest(req, res)
            expect(res.statusCode).toBe(400)
        })

        it('DEVE salvar no response o erro enviado pelo Domain', async () => {
            await handlePostRequest(req, res)
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(erroDomain))
        })

        afterAll(() => {
            domain.savePizzaDomain.mockClear()
            auth.validateAuthToken.mockClear()
        })
    })
})

describe('DADO uma requisicao POST vinda do front com uma rota inexistente', () => {
    const req = {
        url: '/rota_inexistente',
        headers: { authorization: "Bearer TOKEN" },
    };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler POST', () => {
        beforeEach(() => {
            auth.validateAuthToken.mockImplementation(() => ({ auth: true }));
        })

        it('DEVE configurar o header como BadRequest', async () => {
            await handlePostRequest(req, res)    
            expect(res.statusCode).toBe(405)
        })

        it('DEVE chamar o response.end sem passar nada', async () => {
            await handlePostRequest(req, res)
            expect(res.end).toHaveBeenCalledWith()
        })
    })
})

describe('DADO uma requisicao POST vinda do front com o Token de Autenticação inválido', () => {
    const req = {
        url: '/',
        headers: { authorization: "Bearer TOKEN_INVALIDO" },
    };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };

    describe('QUANDO executar o Handler POST', () => {
        beforeEach(() => {
            auth.validateAuthToken.mockImplementation(() => ({ auth: false }));
        })

        it('DEVE configurar o header como Unauthorized', async () => {
            await handlePostRequest(req, res)    
            expect(res.statusCode).toBe(401)
        })

        it('DEVE chamar o response.end', async () => {
            await handlePostRequest(req, res)
            expect(res.end).toHaveBeenCalled()
        })
    })
})