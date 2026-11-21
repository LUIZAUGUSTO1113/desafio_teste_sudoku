const { validarGrade } = require("./validacao");
const { contarSolucoes, estaResolvida } = require("./solucionador");

const TAMANHO = 6;

function copiar(grade) {
  return grade.map((linha) => [...linha]);
}

function conferirPosicao(linha, coluna) {
  for (const indice of [linha, coluna]) {
    if (!Number.isInteger(indice) || indice < 0 || indice >= TAMANHO) {
      throw new Error("A posição precisa ser um inteiro de 0 a 5");
    }
  }
}

class Jogo {
  #puzzle;
  #grade;

  constructor(puzzle) {
    if (contarSolucoes(puzzle, 2) !== 1) {
      throw new Error("O puzzle precisa ter exatamente uma solução");
    }
    this.#puzzle = copiar(puzzle);
    this.#grade = copiar(puzzle);
  }

  get grade() {
    return copiar(this.#grade);
  }

  ehPista(linha, coluna) {
    conferirPosicao(linha, coluna);
    return this.#puzzle[linha][coluna] !== null;
  }

  jogar(linha, coluna, valor) {
    if (this.ehPista(linha, coluna)) {
      throw new Error("Pistas não podem ser alteradas");
    }
    if (valor !== null && valor !== 0 && valor !== 1) {
      throw new Error(`Valor inválido: ${valor}`);
    }
    this.#grade[linha][coluna] = valor;
  }

  validar() {
    return validarGrade(this.#grade);
  }

  estaResolvido() {
    return estaResolvida(this.#grade);
  }
}

module.exports = { Jogo };
