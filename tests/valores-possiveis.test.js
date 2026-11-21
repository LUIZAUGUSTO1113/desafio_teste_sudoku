// Valores possíveis e resolução: RN-01, RN-04, RN-05, RN-06, RN-07, RN-08.
const { estaResolvida, valoresPossiveis } = require("../src/sudoku");
const { gradeDe, S1, P1 } = require("./helpers");

describe("Valores possíveis e resolução", () => {
  test("CT23 [RN-08] grade completa e sem violações está resolvida", () => {
    expect(estaResolvida(gradeDe(S1))).toBe(true);
  });

  test("CT24 [RN-07, RN-08] grade com células vazias não está resolvida", () => {
    const comVazia = gradeDe(S1);
    comVazia[2][4] = null;

    expect(estaResolvida(comVazia)).toBe(false);
    expect(estaResolvida(gradeDe(P1))).toBe(false);
  });

  test("CT25 [RN-06, RN-08] grade completa com linha duplicada não está resolvida", () => {
    const grade = gradeDe([
      "001011",
      "001101",
      "110010",
      "010101",
      "101100",
      "110010",
    ]);

    expect(estaResolvida(grade)).toBe(false);
  });

  test("CT26 [RN-07, D-07] valoresPossiveis olha só um passo à frente e não altera a grade", () => {
    const grade = gradeDe(P1);

    expect(valoresPossiveis(grade, 0, 0)).toEqual([0, 1]);
    expect(grade).toEqual(gradeDe(P1));
  });

  test("CT27 [RN-05, D-07] valoresPossiveis exclui o valor que formaria trio", () => {
    expect(valoresPossiveis(gradeDe(["00...."]), 0, 2)).toEqual([1]);
    expect(valoresPossiveis(gradeDe(["1.1..."]), 0, 1)).toEqual([0]);
  });

  test("CT28 [RN-04, D-07] valoresPossiveis exclui o valor que quebraria o equilíbrio", () => {
    expect(valoresPossiveis(gradeDe(["1.01.1"]), 0, 1)).toEqual([0]);
  });

  test("CT29 [RN-04, RN-06, D-07] valoresPossiveis devolve lista vazia quando nenhum valor serve", () => {
    const grade = gradeDe(["010011", "01001."]);

    expect(valoresPossiveis(grade, 1, 5)).toEqual([]);
  });

  test.each([
    ["grade com trio", ["000..."], 1, 0],
    ["linha -1", P1, -1, 0],
    ["linha 6", P1, 6, 0],
    ["coluna 6", P1, 0, 6],
    ["linha 1.5", P1, 1.5, 0],
    ["coluna '0'", P1, 0, "0"],
    ["célula preenchida", P1, 1, 3],
  ])(
    "CT30 [RN-01, D-07] valoresPossiveis lança erro com %s",
    (_, linhas, linha, coluna) => {
      const grade = gradeDe(linhas);

      expect(() => valoresPossiveis(grade, linha, coluna)).toThrow();
      expect(grade).toEqual(gradeDe(linhas));
    },
  );
});
