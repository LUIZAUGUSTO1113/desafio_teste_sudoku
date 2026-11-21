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

function buscarSolucoes(grade, limite) {
  const solucoes = [];
  if (!validarGrade(grade).valida) return solucoes;

  const atual = copiar(grade);
  const preencher = (indice) => {
    if (solucoes.length >= limite) return;
    if (indice === TAMANHO * TAMANHO) {
      solucoes.push(copiar(atual));
      return;
    }

    const linha = Math.floor(indice / TAMANHO);
    const coluna = indice % TAMANHO;
    if (atual[linha][coluna] !== null) {
      preencher(indice + 1);
      return;
    }

    for (const valor of [0, 1]) {
      atual[linha][coluna] = valor;
      if (validarGrade(atual).valida) preencher(indice + 1);
    }
    atual[linha][coluna] = null;
  };

  preencher(0);
  return solucoes;
}

function contarSolucoes(grade, limite = 2) {
  return buscarSolucoes(grade, limite).length;
}

function resolver(grade) {
  const [solucao] = buscarSolucoes(grade, 1);
  return solucao ?? null;
}

module.exports = {
  estaResolvida,
  valoresPossiveis,
  contarSolucoes,
  resolver,
};
