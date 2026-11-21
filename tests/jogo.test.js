// Jogo: RN-01, RN-02, RN-03, RN-04, RN-05, RN-07, RN-08, RN-09.
const { Jogo } = require("../src/sudoku");
const { gradeDe, S1, P1, P3 } = require("./helpers");

function preencher(jogo, linhas) {
  gradeDe(linhas).forEach((linha, l) =>
    linha.forEach((valor, c) => {
      if (!jogo.ehPista(l, c)) jogo.jogar(l, c, valor);
    }),
  );
}

describe("Jogo", () => {
  test("CT38 [RN-02] o jogo começa com a grade do puzzle e reconhece as pistas", () => {
    const jogo = new Jogo(gradeDe(P1));

    expect(jogo.grade).toEqual(gradeDe(P1));
    expect(jogo.ehPista(1, 3)).toBe(true);
    expect(jogo.ehPista(0, 0)).toBe(false);
  });

  test("CT39 [RN-03] jogar preenche uma célula vazia", () => {
    const jogo = new Jogo(gradeDe(P1));

    jogo.jogar(0, 0, 0);

    expect(jogo.grade).toEqual(
      gradeDe(["0.....", "...1..", ".....0", "1..0..", ".11...", "..1..."]),
    );
  });

  test("CT40 [RN-03] jogar troca o valor de uma jogada anterior", () => {
    const jogo = new Jogo(gradeDe(P1));

    jogo.jogar(0, 0, 0);
    jogo.jogar(0, 0, 1);

    expect(jogo.grade).toEqual(
      gradeDe(["1.....", "...1..", ".....0", "1..0..", ".11...", "..1..."]),
    );
  });

  test("CT41 [RN-03, RN-07] jogar com null apaga a jogada", () => {
    const jogo = new Jogo(gradeDe(P1));

    jogo.jogar(0, 0, 1);
    jogo.jogar(0, 0, null);

    expect(jogo.grade).toEqual(gradeDe(P1));
  });

  test("CT42 [RN-02] jogar em uma pista lança erro e não muda o jogo", () => {
    const jogo = new Jogo(gradeDe(P1));

    expect(() => jogo.jogar(1, 3, 0)).toThrow();
    expect(() => jogo.jogar(1, 3, null)).toThrow();
    expect(jogo.grade).toEqual(gradeDe(P1));
  });

  test.each([
    ["linha -1", -1, 0, 0],
    ["linha 6", 6, 0, 0],
    ["coluna 6", 0, 6, 0],
    ["linha 1.5", 1.5, 0, 0],
    ["coluna '0'", 0, "0", 0],
    ["valor 2", 0, 0, 2],
    ["valor '1'", 0, 0, "1"],
    ["valor true", 0, 0, true],
    ["valor undefined", 0, 0, undefined],
  ])(
    "CT43 [RN-01] jogar lança erro com %s e não muda o jogo",
    (_, linha, coluna, valor) => {
      const jogo = new Jogo(gradeDe(P1));

      expect(() => jogo.jogar(linha, coluna, valor)).toThrow();
      expect(jogo.grade).toEqual(gradeDe(P1));
    },
  );

  test("CT44 [RN-05, D-03] jogar aceita jogada que forma trio e validar aponta a violação", () => {
    const jogo = new Jogo(gradeDe(P1));

    jogo.jogar(4, 0, 1);
    const { valida, violacoes } = jogo.validar();

    expect(jogo.grade[4][0]).toBe(1);
    expect(valida).toBe(false);
    expect(violacoes).toContainEqual({
      regra: "trio",
      eixo: "linha",
      indice: 4,
    });
  });

  test("CT45 [RN-07, RN-08] no início o jogo é válido e não está resolvido", () => {
    const jogo = new Jogo(gradeDe(P1));

    expect(jogo.validar()).toEqual({ valida: true, violacoes: [] });
    expect(jogo.estaResolvido()).toBe(false);
  });

  test("CT46 [RN-08] preencher as células vazias com S1 resolve o jogo", () => {
    const jogo = new Jogo(gradeDe(P1));

    preencher(jogo, S1);

    expect(jogo.grade).toEqual(gradeDe(S1));
    expect(jogo.estaResolvido()).toBe(true);
  });

  test("CT47 [RN-04, RN-08] grade completa com violação não resolve o jogo", () => {
    const jogo = new Jogo(gradeDe(P1));

    preencher(jogo, [
      "110011",
      "001101",
      "100110",
      "110010",
      "011001",
      "101100",
    ]);
    const { violacoes } = jogo.validar();

    expect(jogo.estaResolvido()).toBe(false);
    expect(violacoes).toContainEqual({
      regra: "equilibrio",
      eixo: "linha",
      indice: 0,
    });
    expect(violacoes).toContainEqual({
      regra: "equilibrio",
      eixo: "coluna",
      indice: 0,
    });
  });

  test("CT48 [RN-02] o jogo guarda uma cópia do puzzle e grade devolve uma cópia", () => {
    const puzzle = gradeDe(P1);
    const jogo = new Jogo(puzzle);

    puzzle[0][0] = 1;
    jogo.grade[0][1] = 0;

    expect(jogo.grade).toEqual(gradeDe(P1));
    expect(jogo.ehPista(0, 0)).toBe(false);
  });

  test.each([
    ["duas soluções", P3],
    [
      "4140 soluções",
      ["......", "......", "......", "......", "......", "......"],
    ],
    ["violação de trio", ["000..."]],
    ["nenhuma solução", ["010011", "01001."]],
  ])("CT49 [RN-09] o construtor recusa puzzle com %s", (_, linhas) => {
    const puzzle = gradeDe(linhas);

    expect(() => new Jogo(puzzle)).toThrow();
    expect(puzzle).toEqual(gradeDe(linhas));
  });
});
