// Trios: RN-04, RN-05, RN-07.
const { validarGrade } = require("../src/sudoku");
const { gradeDe } = require("./helpers");

describe("Trios", () => {
  test.each([
    "000...",
    ".000..",
    "..000.",
    "...000",
    "111...",
    ".111..",
    "..111.",
    "...111",
  ])("CT11 [RN-05] linha 0 igual a %s tem trio", (linha) => {
    const { violacoes } = validarGrade(gradeDe([linha]));

    expect(violacoes).toContainEqual({
      regra: "trio",
      eixo: "linha",
      indice: 0,
    });
  });

  test.each([
    ["0", 0, ["..0...", "..0...", "..0..."]],
    ["0", 1, ["......", "..0...", "..0...", "..0..."]],
    ["0", 2, ["......", "......", "..0...", "..0...", "..0..."]],
    ["0", 3, ["......", "......", "......", "..0...", "..0...", "..0..."]],
    ["1", 0, ["..1...", "..1...", "..1..."]],
    ["1", 1, ["......", "..1...", "..1...", "..1..."]],
    ["1", 2, ["......", "......", "..1...", "..1...", "..1..."]],
    ["1", 3, ["......", "......", "......", "..1...", "..1...", "..1..."]],
  ])(
    "CT12 [RN-05] coluna 2 com três %s a partir da linha %i tem trio",
    (_, __, linhas) => {
      const { violacoes } = validarGrade(gradeDe(linhas));

      expect(violacoes).toContainEqual({
        regra: "trio",
        eixo: "coluna",
        indice: 2,
      });
    },
  );

  test("CT13 [RN-05] trio na linha 0 e na coluna 5 gera duas violações", () => {
    const grade = gradeDe(["000...", "......", ".....1", ".....1", ".....1"]);
    const { violacoes } = validarGrade(grade);

    expect(violacoes).toHaveLength(2);
    expect(violacoes).toContainEqual({
      regra: "trio",
      eixo: "linha",
      indice: 0,
    });
    expect(violacoes).toContainEqual({
      regra: "trio",
      eixo: "coluna",
      indice: 5,
    });
  });

  test("CT14 [RN-05] dois iguais adjacentes são permitidos", () => {
    expect(validarGrade(gradeDe(["00.11."])).valida).toBe(true);
  });

  test("CT15 [RN-05] iguais separados são permitidos", () => {
    expect(validarGrade(gradeDe(["101..."])).valida).toBe(true);
  });

  test("CT16 [RN-05, RN-07] vazio entre três iguais não forma trio", () => {
    expect(validarGrade(gradeDe(["11.1.."])).valida).toBe(true);
  });

  test("CT17 [RN-05] três iguais na diagonal não formam trio", () => {
    const grade = gradeDe(["1.....", ".1....", "..1..."]);

    expect(validarGrade(grade).valida).toBe(true);
  });

  test("CT18 [RN-04, RN-05] quatro iguais seguidos geram uma única violação de trio", () => {
    const { violacoes } = validarGrade(gradeDe(["0000.."]));
    const trios = violacoes.filter((v) => v.regra === "trio");

    expect(trios).toEqual([{ regra: "trio", eixo: "linha", indice: 0 }]);
    expect(violacoes).toContainEqual({
      regra: "equilibrio",
      eixo: "linha",
      indice: 0,
    });
  });
});
