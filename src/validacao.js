const TAMANHO = 6;

function criarGradeVazia() {
  return Array.from({ length: TAMANHO }, () => Array(TAMANHO).fill(null));
}

function conferirFormato(grade) {
  if (!Array.isArray(grade) || grade.length !== TAMANHO) {
    throw new Error("A grade precisa ter 6 linhas");
  }
  for (const linha of grade) {
    if (!Array.isArray(linha) || linha.length !== TAMANHO) {
      throw new Error("Cada linha precisa ter 6 células");
    }
    for (const celula of linha) {
      if (celula !== null && celula !== 0 && celula !== 1) {
        throw new Error(`Valor inválido na grade: ${celula}`);
      }
    }
  }
}

function colunasDe(grade) {
  return grade[0].map((_, coluna) => grade.map((linha) => linha[coluna]));
}

function temTrio(celulas) {
  for (let i = 0; i + 2 < celulas.length; i++) {
    if (
      celulas[i] !== null &&
      celulas[i] === celulas[i + 1] &&
      celulas[i] === celulas[i + 2]
    ) {
      return true;
    }
  }
  return false;
}

function passaDoLimite(celulas) {
  const uns = celulas.filter((c) => c === 1).length;
  const zeros = celulas.filter((c) => c === 0).length;
  return uns > TAMANHO / 2 || zeros > TAMANHO / 2;
}

function violacoesDoEixo(sequencias, eixo) {
  const violacoes = [];
  sequencias.forEach((celulas, indice) => {
    if (passaDoLimite(celulas))
      violacoes.push({ regra: "equilibrio", eixo, indice });
    if (temTrio(celulas)) violacoes.push({ regra: "trio", eixo, indice });
  });

  const completas = sequencias.map((celulas) =>
    celulas.includes(null) ? null : celulas.join(""),
  );
  for (let i = 0; i < TAMANHO; i++) {
    for (let j = i + 1; j < TAMANHO; j++) {
      if (completas[i] !== null && completas[i] === completas[j]) {
        violacoes.push({ regra: "duplicada", eixo, indices: [i, j] });
      }
    }
  }
  return violacoes;
}

function validarGrade(grade) {
  conferirFormato(grade);
  const violacoes = [
    ...violacoesDoEixo(grade, "linha"),
    ...violacoesDoEixo(colunasDe(grade), "coluna"),
  ];
  return { valida: violacoes.length === 0, violacoes };
}

function gradeCompleta(grade) {
  conferirFormato(grade);
  return grade.every((linha) => linha.every((celula) => celula !== null));
}

module.exports = { criarGradeVazia, validarGrade, gradeCompleta };
