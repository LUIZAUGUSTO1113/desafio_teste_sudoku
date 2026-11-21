const TAMANHO = 6;

function criarGradeVazia() {
  return Array.from({ length: TAMANHO }, () => Array(TAMANHO).fill(null));
}

function conferirFormato(grade) {
  if (!Array.isArray(grade) || grade.length !== TAMANHO) {
    throw new Error('A grade precisa ter 6 linhas');
  }
  for (const linha of grade) {
    if (!Array.isArray(linha) || linha.length !== TAMANHO) {
      throw new Error('Cada linha precisa ter 6 células');
    }
    for (const celula of linha) {
      if (celula !== null && celula !== 0 && celula !== 1) {
        throw new Error(`Valor inválido na grade: ${celula}`);
      }
    }
  }
}

function validarGrade(grade) {
  conferirFormato(grade);
  return { valida: true, violacoes: [] };
}

function gradeCompleta(grade) {
  conferirFormato(grade);
  return grade.every((linha) => linha.every((celula) => celula !== null));
}

module.exports = { criarGradeVazia, validarGrade, gradeCompleta };
