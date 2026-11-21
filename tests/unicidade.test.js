// Linhas e colunas únicas: RN-06, RN-07.
const { validarGrade } = require("../src/sudoku");
const { gradeDe } = require("./helpers");

describe("Linhas e colunas únicas", () => {
  test("CT19 [RN-06] duas linhas completas iguais geram violação", () => {
    const { violacoes } = validarGrade(gradeDe(["010011", "010011"]));

    expect(violacoes).toEqual([
      { regra: "duplicada", eixo: "linha", indices: [0, 1] },
    ]);
  });

  test("CT20 [RN-06] duas colunas completas iguais geram violação", () => {
    const grade = gradeDe([
      "00....",
      "11....",
      "00....",
      "00....",
      "11....",
      "11....",
    ]);
    const { violacoes } = validarGrade(grade);

    expect(violacoes).toEqual([
      { regra: "duplicada", eixo: "coluna", indices: [0, 1] },
    ]);
  });

  test("CT21 [RN-06, D-01] linha igual a uma coluna não é violação", () => {
    const grade = gradeDe([
      "010011",
      "1.....",
      "0.....",
      "0.....",
      "1.....",
      "1.....",
    ]);

    expect(validarGrade(grade).valida).toBe(true);
  });

  test("CT22 [RN-06, RN-07] linhas incompletas iguais não são duplicadas", () => {
    expect(validarGrade(gradeDe(["010...", "010..."])).valida).toBe(true);
  });
});
