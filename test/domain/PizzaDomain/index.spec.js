const { savePizzaDomain, getIngredientesListDomain } = require('../../../src/domain/PizzaDomain')
const mapper = require('../../../src/domain/PizzaDomain/mapper')
const repository = require('../../../src/repository/PizzaRepository')

jest.mock('../../../src/repository/PizzaRepository', () => {
  const originalModule = jest.requireActual('../../../src/repository/PizzaRepository');
  return { __esModule: true, ...originalModule, saveData: jest.fn(), getIngredientes: jest.fn() };
})

jest.mock('../../../src/domain/PizzaDomain/mapper', () => jest.fn())

describe('DADO uma pizza vinda do front de forma correta', () => {
  const dadoCorretoFront = {
    sabor: "Mussarela",
    ingredientes: [{
      nome: "queijo mussarela",
      preco: "15.00"
    }]
  }

  describe('QUANDO salvar dados', () => {
    const dadoCorretoSave = {
      sabor: "Mussarela",
      valor: 0,
      ingredientes: [{
        nome: "queijo mussarela",
        valor: "15.00"
      }]
    }

    mapper.mockImplementation(() => dadoCorretoSave);
    savePizzaDomain(dadoCorretoFront)

    it('DEVE salvar o dado no repositório', () => {
      expect(repository.saveData).toHaveBeenCalledTimes(1);
    })

    it('DEVE chamar o mapper da Pizza', () => {
      expect(mapper).toHaveBeenCalledTimes(1);
    })

    it('DEVE salvar o dado de forma correta', () => {
      expect(repository.saveData).toHaveBeenCalledWith(dadoCorretoSave);
    })
  })

  afterAll(() => {
    mapper.mockClear();
  })
})

describe('DADO uma pizza vinda do front sem sabor', () => {
  const dadoIncorretoFront = {
    ingredientes: [{
      nome: "queijo mussarela",
      preco: "15.00"
    }]
  }

  describe('QUANDO salvar dados', () => {
    it('DEVE gerar uma exceção', () => {
      expect(() => { savePizzaDomain(dadoIncorretoFront) }).toThrowError('Sabor da Pizza não pode ser vazio');
    })

    it('NÃO DEVE chamar o mapper', () => {
      expect(mapper).not.toHaveBeenCalled();
    })
  })
})

describe('DADO uma pizza vinda do front sem ingredientes', () => {
  const dadoIncorretoFront = {
    sabor: "Mussarela",
    ingredientes: []
  }

  describe('QUANDO salvar dados', () => {
    it('DEVE gerar uma exceção', () => {
      expect(() => { savePizzaDomain(dadoIncorretoFront) }).toThrowError('Não é possível salvar uma pizza sem ingredientes');
    })

    it('NÃO DEVE chamar o mapper', () => {
      expect(mapper).not.toHaveBeenCalled();
    })
  })
})

describe('DADO uma chamada para obter os ingredientes', () => {
  describe('QUANDO obter ingredientes', () => {
    getIngredientesListDomain()

    it('DEVE chamar o repositório para obter os ingredientes', () => {
      expect(repository.getIngredientes).toHaveBeenCalled();
    })
  })
})