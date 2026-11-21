const CELULAS = { 0: 0, 1: 1, ".": null };

function gradeDe(linhas) {
  const completas = [...linhas];
  while (completas.length < 6) completas.push("......");
  return completas.map((linha) => [...linha].map((c) => CELULAS[c]));
}

const S1 = Object.freeze([
  "010011",
  "001101",
  "100110",
  "110010",
  "011001",
  "101100",
]);

const P1 = Object.freeze([
  "......",
  "...1..",
  ".....0",
  "1..0..",
  ".11...",
  "..1...",
]);

const P3 = Object.freeze([
  "......",
  "......",
  ".....0",
  "1..0..",
  ".11...",
  "..1...",
]);

module.exports = { gradeDe, S1, P1, P3 };
