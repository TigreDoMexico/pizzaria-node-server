const { onLoginHandler } = require('../../../src/requests/request-handler/post')
const auth = require('../../../src/auth')

jest.mock('../../../src/auth', () => ({
    generateAuthToken: jest.fn()
}))

describe('DADO um usuário e senha vindos do Handler para autenticar', () => {
    const dadosUsuario = { usuario: "usuario", senha: "senha" }
    const req = { url: '/login' };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };
    
    describe('QUANDO chamar o LoginHandler', () => {
        const respostaEsperada = { auth: true, token: "TOKEN" }

        beforeAll(() => {            
            auth.generateAuthToken.mockImplementation(() => respostaEsperada);
            onLoginHandler(dadosUsuario, req, res)
        })

        it('DEVE chamar o gerador de token JWT', () => {
            expect(auth.generateAuthToken).toHaveBeenCalledWith(dadosUsuario)
        })

        it('DEVE chamar o response.end passando o token gerado', async () => {
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(respostaEsperada))
        })

        it('DEVE configurar o header do response como Sucesso', async () => {            
            expect(res.statusCode).toBe(200)
        })
    })
})

describe('DADO um usuário invalido vindos do Handler para autenticar', () => {
    const dadosUsuario = { usuario: "usuario_invalido" }
    const req = { url: '/login' };
    const res = {
        setHeader: jest.fn(),
        end: jest.fn()
    };
    
    describe('QUANDO chamar o LoginHandler', () => {
        const respostaEsperada = { auth: false, token: null }

        beforeAll(() => {            
            auth.generateAuthToken.mockImplementation(() => respostaEsperada);
            onLoginHandler(dadosUsuario, req, res)
        })

        it('DEVE chamar o gerador de token JWT', () => {
            expect(auth.generateAuthToken).toHaveBeenCalledWith(dadosUsuario)
        })

        it('DEVE chamar o response.end passando que não foi possível autenticar', async () => {
            expect(res.end).toHaveBeenCalledWith(JSON.stringify(respostaEsperada))
        })

        it('DEVE configurar o header do response como Unauthorized', async () => {            
            expect(res.statusCode).toBe(401)
        })
    })
})