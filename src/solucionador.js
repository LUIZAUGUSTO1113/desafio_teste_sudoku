const { validarGrade, gradeCompleta } = require("./validacao");

const TAMANHO = 6;

function copiar(grade) {
  return grade.map((linha) => [...linha]);
}

function posicaoValida(indice) {
  return Number.isInteger(indice) && indice >= 0 && indice < TAMANHO;
}

function estaResolvida(grade) {
  return gradeCompleta(grade) && validarGrade(grade).valida;
}

function valoresPossiveis(grade, linha, coluna) {
  if (!validarGrade(grade).valida) {
    throw new Error("A grade já tem violações");
  }
  if (!posicaoValida(linha) || !posicaoValida(coluna)) {
    throw new Error("A posição precisa ser um inteiro de 0 a 5");
  }
  if (grade[linha][coluna] !== null) {
    throw new Error("A célula já está preenchida");
  }

  const tentativa = copiar(grade);
  return [0, 1].filter((valor) => {
    tentativa[linha][coluna] = valor;
    return validarGrade(tentativa).valida;
  });
}

module.exports = { estaResolvida, valoresPossiveis };
