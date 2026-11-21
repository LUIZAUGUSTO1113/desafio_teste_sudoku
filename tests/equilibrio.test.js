// Equilíbrio: RN-04, RN-07.
const { validarGrade } = require("../src/sudoku");
const { gradeDe } = require("./helpers");

describe("Equilíbrio", () => {
  test("CT06 [RN-04, RN-07] linha com quatro 1 viola o equilíbrio", () => {
    const { violacoes } = validarGrade(gradeDe(["1101.1"]));

    expect(violacoes).toContainEqual({
      regra: "equilibrio",
      eixo: "linha",
      indice: 0,
    });
    expect(violacoes.some((v) => v.regra === "trio")).toBe(false);
  });

  test("CT07 [RN-04, RN-07] coluna com quatro 0 viola o equilíbrio", () => {
    const grade = gradeDe([
      "0.....",
      "0.....",
      "1.....",
      "0.....",
      "......",
      "0.....",
    ]);
    const { violacoes } = validarGrade(grade);

    expect(violacoes).toContainEqual({
      regra: "equilibrio",
      eixo: "coluna",
      indice: 0,
    });
    expect(violacoes.some((v) => v.regra === "trio")).toBe(false);
  });

  test("CT08 [RN-04] linha com três 0 e três 1 é válida", () => {
    expect(validarGrade(gradeDe(["100110"]))).toEqual({
      valida: true,
      violacoes: [],
    });
  });

  test("CT09 [RN-04, RN-07] linha parcial com três 1 ainda pode ser completada", () => {
    expect(validarGrade(gradeDe(["1.01.1"])).valida).toBe(true);
  });

  test("CT10 [RN-04] coluna com três 0 e três 1 é válida", () => {
    const grade = gradeDe([
      "...0..",
      "...1..",
      "...1..",
      "...0..",
      "...0..",
      "...1..",
    ]);

    expect(validarGrade(grade)).toEqual({ valida: true, violacoes: [] });
  });
});
