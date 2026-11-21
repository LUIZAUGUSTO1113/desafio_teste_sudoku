// Tabuleiro e entrada: RN-01, RN-07, RN-08.
const { criarGradeVazia, validarGrade, gradeCompleta } = require('../src/sudoku');
const { gradeDe, S1 } = require('./helpers');

describe('Tabuleiro e entrada', () => {
  test('CT01 [RN-01] criarGradeVazia devolve grades 6 x 6 vazias e independentes', () => {
    const a = criarGradeVazia();
    const b = criarGradeVazia();

    expect(a).toHaveLength(6);
    a.forEach((linha) => expect(linha).toEqual([null, null, null, null, null, null]));
    expect(b).toEqual(a);

    a[0][0] = 1;
    expect(b[0][0]).toBeNull();
  });

  test('CT02 [RN-01, RN-07] grade vazia é válida e não está completa', () => {
    const grade = criarGradeVazia();

    expect(validarGrade(grade)).toEqual({ valida: true, violacoes: [] });
    expect(gradeCompleta(grade)).toBe(false);
  });

  test('CT03 [RN-01, RN-08] gradeCompleta só é verdadeira sem células vazias', () => {
    const comVazia = gradeDe(S1);
    comVazia[3][4] = null;

    expect(gradeCompleta(gradeDe(S1))).toBe(true);
    expect(gradeCompleta(comVazia)).toBe(false);
    expect(gradeCompleta(criarGradeVazia())).toBe(false);
  });

  test.each([
    ['5 linhas', gradeDe(S1).slice(0, 5)],
    ['uma linha com 5 células', [...gradeDe(S1).slice(0, 5), [0, 1, 0, 1, 0]]],
    ['grade 7 x 7', Array.from({ length: 7 }, () => Array(7).fill(null))],
    ['valor que não é array', '010011'],
  ])('CT04 [RN-01] validarGrade lança erro com %s', (_, grade) => {
    expect(() => validarGrade(grade)).toThrow();
  });

  test.each([
    ['2', 2],
    ["'1'", '1'],
    ['true', true],
    ['undefined', undefined],
    ['NaN', NaN],
  ])('CT05 [RN-01] validarGrade lança erro com célula igual a %s', (_, valor) => {
    const grade = criarGradeVazia();
    grade[2][3] = valor;

    expect(() => validarGrade(grade)).toThrow();
  });
});
