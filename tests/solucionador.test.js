// Solucionador: RN-03, RN-05, RN-08, RN-09.
const {
  criarGradeVazia,
  contarSolucoes,
  resolver,
  estaResolvida,
} = require("../src/sudoku");
const { gradeDe, S1, P1, P3 } = require("./helpers");

describe("Solucionador", () => {
  test("CT31 [RN-09, D-04] P1 tem uma única solução", () => {
    const grade = gradeDe(P1);

    expect(contarSolucoes(grade)).toBe(1);
    expect(grade).toEqual(gradeDe(P1));
  });

  test("CT32 [RN-09] grade vazia tem 4140 soluções", () => {
    expect(contarSolucoes(criarGradeVazia(), 10000)).toBe(4140);
  });

  test("CT33 [RN-09] P3 tem duas soluções", () => {
    expect(contarSolucoes(gradeDe(P3))).toBe(2);
    expect(contarSolucoes(gradeDe(P3), 10)).toBe(2);
  });

  test("CT34 [RN-09] contarSolucoes para de contar ao chegar no limite", () => {
    expect(contarSolucoes(criarGradeVazia())).toBe(2);
    expect(contarSolucoes(criarGradeVazia(), 1)).toBe(1);
    expect(contarSolucoes(criarGradeVazia(), 100)).toBe(100);
  });

  test("CT35 [RN-05] grade com trio tem 0 soluções e resolver devolve null", () => {
    const parcial = gradeDe(["000..."]);
    const completa = gradeDe([
      "010111",
      "001101",
      "100110",
      "110010",
      "011001",
      "101100",
    ]);

    expect(contarSolucoes(parcial)).toBe(0);
    expect(contarSolucoes(completa)).toBe(0);
    expect(resolver(parcial)).toBeNull();
    expect(resolver(completa)).toBeNull();
  });

  test("CT36 [RN-03, RN-08] resolver preenche as células vazias de P1 e chega em S1", () => {
    const solucao = resolver(gradeDe(P1));

    expect(solucao).toEqual(gradeDe(S1));
    expect(estaResolvida(solucao)).toBe(true);
  });

  test("CT37 [RN-08] resolver devolve uma grade nova e não altera a recebida", () => {
    const puzzle = gradeDe(P1);
    const completa = gradeDe(S1);

    const solucao = resolver(puzzle);
    const copia = resolver(completa);
    copia[0][0] = 1;

    expect(solucao).not.toBe(puzzle);
    expect(puzzle).toEqual(gradeDe(P1));
    expect(completa).toEqual(gradeDe(S1));
  });
});
