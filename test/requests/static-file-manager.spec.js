const { getFileContent } = require('../../src/requests/static-file-manager')
const fs = require('fs').promises

jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn(),
    },
}));

describe('DADO o nome de um arquivo', () => {
    const fileName = 'nomeArquivo.js'
    fs.readFile.mockImplementation(() => 'CONTEUDO');

    describe('QUANDO obter conteúdo arquivo duas vezes', () => {
        it('DEVE chamar o FS somente uma vez', async () => {
            await getFileContent(fileName)
            await getFileContent(fileName)
            expect(fs.readFile).toHaveBeenCalledTimes(1);
        })

        it('DEVE o conteudo do arquivo ser o mesmo', async () => {
            const conteudo = await getFileContent(fileName)
            const conteudo2 = await getFileContent(fileName)
            expect(conteudo).toBe(conteudo2);
        })
    })
})