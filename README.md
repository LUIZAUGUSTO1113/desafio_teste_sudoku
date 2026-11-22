# Desafio de Testes - Sudoku Binário 6 x 6 (`desafio_teste_sudoku`)

## 1. Identificação do Desafio

Este repositório é a entrega do **Desafio de Testes: Sudoku**, proposto na disciplina de Projeto, Implementação e Teste de Software da **Unicesumar**. O objetivo é escrever, em JavaScript (Jest), casos de teste para o **Sudoku binário 6 x 6** (também conhecido como Takuzu ou Binairo), junto com uma implementação de referência que passa em todos eles.

A suíte testa a validação de grades, o solucionador e um jogo com pistas fixas. Os testes são determinísticos: toda grade é escrita no próprio teste, e nada depende de `Math.random`.

---

## 2. Como instalar e executar os testes

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm 9 ou superior (já vem com o Node.js)

### Instalação

```bash
npm install
```

### Executar a suíte completa

```bash
npm test
```

Roda o Jest nos sete arquivos de `tests/`.

### Outras formas de executar

```bash
npx jest tests/trios.test.js   # apenas um arquivo
npx jest -t "CT31"             # apenas um caso de teste
npx jest --coverage            # com relatório de cobertura em coverage/
```

---

## 3. Estrutura do Projeto

```text
desafio_teste_sudoku/
├── src/
│   ├── validacao.js                  # Grade vazia, formato, equilíbrio, trios e duplicadas
│   ├── solucionador.js               # Grade resolvida, valores possíveis, contagem de soluções e resolução
│   ├── jogo.js                       # Classe Jogo: pistas, jogadas, validação e fim de jogo
│   └── sudoku.js                     # Ponto de entrada (reexporta a API)
├── tests/
│   ├── helpers.js                    # Fixtures e funções auxiliares
│   ├── grade.test.js                 # CT01–CT05 (tabuleiro e entrada)
│   ├── equilibrio.test.js            # CT06–CT10 (equilíbrio)
│   ├── trios.test.js                 # CT11–CT18 (trios)
│   ├── unicidade.test.js             # CT19–CT22 (linhas e colunas únicas)
│   ├── valores-possiveis.test.js     # CT23–CT30 (valores possíveis e resolução)
│   ├── solucionador.test.js          # CT31–CT37 (solucionador)
│   └── jogo.test.js                  # CT38–CT49 (jogo)
├── package.json
└── README.md
```

---

## 4. Como os testes funcionam

### Modelo da grade usado pela engine

A grade é uma matriz 6 x 6 (`grade[linha][coluna]`), com linhas e colunas numeradas de `0` a `5`. Cada célula vale `0`, `1` ou `null` (vazia). Qualquer outro valor, inclusive `'1'`, `true`, `undefined` ou `NaN`, torna a grade inválida.

O enunciado não define uma API. A que os testes usam, exportada por `src/sudoku.js`, é:

- `criarGradeVazia()` devolve uma grade 6 x 6 nova, com todas as células `null`.
- `validarGrade(grade)` devolve `{ valida, violacoes }`. Lança `Error` se a grade não tiver o formato 6 x 6 ou tiver valor inválido.
- `gradeCompleta(grade)` é `true` quando nenhuma célula está vazia.
- `estaResolvida(grade)` é `true` quando a grade está completa e sem violações.
- `valoresPossiveis(grade, linha, coluna)` devolve os valores (`[0, 1]`, `[0]`, `[1]` ou `[]`) que não criam violação na célula vazia indicada.
- `contarSolucoes(grade, limite = 2)` conta as soluções da grade e para de contar ao chegar em `limite`.
- `resolver(grade)` devolve uma grade nova resolvida, ou `null` se não houver solução.
- `new Jogo(puzzle)` cria um jogo. As células preenchidas do puzzle viram pistas. Lança `Error` se o puzzle não tiver exatamente uma solução.
- `jogo.grade` é uma cópia da grade atual.
- `jogo.ehPista(linha, coluna)` diz se a célula é uma pista.
- `jogo.jogar(linha, coluna, valor)` escreve `0`, `1` ou `null` (apaga) em uma célula que não é pista.
- `jogo.validar()` e `jogo.estaResolvido()` aplicam `validarGrade` e `estaResolvida` à grade atual.

Nenhuma função altera a grade recebida. Ações inválidas lançam `Error` e não alteram o jogo. As violações têm este formato:

```js
{
  valida: false,
  violacoes: [
    { regra: "equilibrio", eixo: "linha", indice: 0 },        // mais de três 0 ou três 1
    { regra: "trio", eixo: "coluna", indice: 2 },             // três iguais seguidos
    { regra: "duplicada", eixo: "linha", indices: [0, 1] },   // duas linhas completas iguais
  ],
}
```

### Regras de negócio

Cada regra tem um ID que aparece no nome dos testes que a validam, por exemplo `CT19 [RN-06] duas linhas completas iguais geram violação`.

| ID    | Regra                                                                                                                                | Testada em                                               |
| :---- | :----------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------- |
| RN-01 | A grade tem 6 linhas e 6 colunas. Cada célula vale `0`, `1` ou fica vazia (`null`). Posições são inteiros de `0` a `5`.               | CT01 a CT05, CT30, CT43                                  |
| RN-02 | As células preenchidas do puzzle são pistas e não podem ser alteradas.                                                               | CT38, CT42, CT48                                         |
| RN-03 | O jogador preenche as células vazias com `0` ou `1`, e pode trocar ou apagar as próprias jogadas.                                    | CT36, CT39 a CT41                                        |
| RN-04 | Equilíbrio: cada linha e cada coluna tem três `0` e três `1`. Mais de três de um mesmo valor é violação.                             | CT06 a CT10, CT18, CT28, CT29, CT47                      |
| RN-05 | Sem trios: não pode haver três valores iguais seguidos na horizontal ou na vertical. Diagonais não contam.                           | CT11 a CT18, CT27, CT35, CT44                            |
| RN-06 | Duas linhas completas não podem ser iguais, e duas colunas completas também não.                                                     | CT19 a CT22, CT25, CT29                                  |
| RN-07 | Células vazias não geram violação: uma grade parcial é válida enquanto o que está preenchido respeita as regras.                     | CT02, CT06, CT07, CT09, CT16, CT22, CT24, CT26, CT41, CT45 |
| RN-08 | A grade está resolvida quando está completa e não tem violações.                                                                     | CT03, CT23 a CT25, CT36, CT37, CT45 a CT47               |
| RN-09 | Um puzzle válido tem exatamente uma solução.                                                                                         | CT31 a CT34, CT49                                        |

### Como os cenários são montados

As grades são escritas como listas de strings, uma por linha, para que o teste mostre o tabuleiro de forma legível. `tests/helpers.js` oferece:

- `gradeDe(linhas)` converte as strings em grade: `'0'` e `'1'` viram números e `'.'` vira `null`. Linhas que faltarem são completadas com `"......"`, então `gradeDe(["000..."])` monta uma grade com só a primeira linha preenchida.
- `S1` é uma grade completa e válida, usada como solução de referência.
- `P1` é um puzzle com 7 pistas cuja única solução é `S1`.
- `P3` é o `P1` sem a pista da posição `(1, 3)`, e por isso tem duas soluções.

```text
     S1           P1           P3
   010011       ......       ......
   001101       ...1..       ......
   100110       .....0       .....0
   110010       1..0..       1..0..
   011001       .11...       .11...
   101100       ..1...       ..1...
```

Exemplo de uso:

```js
const jogo = new Jogo(gradeDe(P1));
jogo.jogar(4, 0, 1); // forma 111 na linha 4
jogo.validar();
// { valida: false, violacoes: [{ regra: "trio", eixo: "linha", indice: 4 }] }
```

### Convenções

- Cada arquivo começa com uma linha que lista as regras que cobre, por exemplo `// Trios: RN-04, RN-05, RN-07.`.
- Um `describe` por grupo e um `test` por caso, com o ID e as regras no nome. As tabelas deste README fazem o mapa inverso, de regra para caso.
- Cada teste monta as próprias grades; nenhum depende de outro nem da ordem de execução.
- Ações inválidas são verificadas com `expect(() => ...).toThrow()` seguido de uma comparação com a grade original, que confirma que nada mudou.

### O que cada grupo verifica

- **CT01–CT05:** a grade vazia 6 x 6, a grade completa, e a recusa de formatos e valores inválidos.
- **CT06–CT10:** o limite de três `0` e três `1` em linhas e colunas, completas ou parciais.
- **CT11–CT18:** o trio em todas as posições de linha e coluna, os casos permitidos (pares, iguais separados, vazio no meio, diagonal) e o trio longo contado uma vez.
- **CT19–CT22:** linhas e colunas completas duplicadas, a linha igual a uma coluna e as linhas incompletas iguais.
- **CT23–CT30:** a grade resolvida e não resolvida, e os valores possíveis de uma célula, com seus erros.
- **CT31–CT37:** a contagem de soluções (única, duas, 4140 na grade vazia, nenhuma), o limite da contagem e a resolução sem alterar a entrada.
- **CT38–CT49:** o jogo: pistas, jogar, trocar e apagar, jogadas inválidas, validação, fim de jogo e a recusa de puzzles sem solução única.

---

## 5. Variações de regras validadas

O enunciado não detalha todas as regras, e as fontes sobre o Takuzu e o Binairo nem sempre concordam. Cada divergência foi resolvida assim:

| ID   | Decisão                                                                                                                                                | Testada em  |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
| D-01 | A unicidade vale dentro de cada eixo: uma linha igual a uma coluna não é violação.                                                                     | CT21        |
| D-02 | O tamanho é fixo em 6 x 6. Grades 8 x 8, 10 x 10 ou de outros tamanhos ficam fora do escopo.                                                           | -           |
| D-03 | `jogar` aceita qualquer jogada que respeite o formato, mesmo que crie violação. As regras só são conferidas quando se chama `validar`.                  | CT44        |
| D-04 | `contarSolucoes` para no limite (2 por padrão), o suficiente para saber se a solução é única sem enumerar todas.                                       | CT31        |
| D-05 | Um trio longo (quatro ou mais iguais seguidos) gera uma única violação de trio por linha ou coluna.                                                    | -           |
| D-06 | Fora do escopo: geração de puzzles, níveis de dificuldade, dicas, desfazer jogadas e interface.                                                        | -           |
| D-07 | `valoresPossiveis` olha só um passo à frente: devolve os valores que não criam violação agora, sem garantir que a grade continue tendo solução depois. | CT26 a CT30 |

---

## 6. Observações sobre a engine

- **Contagem de testes:** são 49 casos de teste, mas os parametrizados (`test.each`) geram um teste Jest por linha, por isso o Jest mostra 87 testes.
- **Solucionador por busca com retrocesso:** `resolver` e `contarSolucoes` preenchem as células vazias em ordem, testando `0` e depois `1`, e voltam assim que a grade fica inválida. Na grade 6 x 6 isso é rápido o bastante para contar as 4140 soluções da grade vazia (CT32).
- **Cópias por fora:** `jogo.grade` e `resolver` devolvem grades novas, e o `Jogo` guarda uma cópia do puzzle recebido. Alterar esses objetos não muda o jogo, e é isso que permite comparar a grade antes e depois de uma ação inválida.
- **Cobertura:** a suíte cobre 100% das linhas, ramos e funções de `src/`.

---

## 7. Casos de Teste Cobertos

| ID   | Categoria          | Cenário                                                          | Arquivo                     |
| :--- | :----------------- | :--------------------------------------------------------------- | :-------------------------- |
| CT01 | Tabuleiro          | `criarGradeVazia` devolve grades 6 x 6 vazias e independentes    | `grade.test.js`             |
| CT02 | Tabuleiro          | Grade vazia é válida e não está completa                         | `grade.test.js`             |
| CT03 | Tabuleiro          | `gradeCompleta` só é verdadeira sem células vazias               | `grade.test.js`             |
| CT04 | Tabuleiro          | Formato diferente de 6 x 6 lança erro                            | `grade.test.js`             |
| CT05 | Tabuleiro          | Célula com valor diferente de `0`, `1` ou `null` lança erro      | `grade.test.js`             |
| CT06 | Equilíbrio         | Linha com quatro `1` viola o equilíbrio                          | `equilibrio.test.js`        |
| CT07 | Equilíbrio         | Coluna com quatro `0` viola o equilíbrio                         | `equilibrio.test.js`        |
| CT08 | Equilíbrio         | Linha com três `0` e três `1` é válida                           | `equilibrio.test.js`        |
| CT09 | Equilíbrio         | Linha parcial com três `1` ainda pode ser completada             | `equilibrio.test.js`        |
| CT10 | Equilíbrio         | Coluna com três `0` e três `1` é válida                          | `equilibrio.test.js`        |
| CT11 | Trios              | Trio em cada posição da linha                                    | `trios.test.js`             |
| CT12 | Trios              | Trio em cada posição da coluna                                   | `trios.test.js`             |
| CT13 | Trios              | Trio em uma linha e em uma coluna gera duas violações            | `trios.test.js`             |
| CT14 | Trios              | Dois iguais adjacentes são permitidos                            | `trios.test.js`             |
| CT15 | Trios              | Iguais separados são permitidos                                  | `trios.test.js`             |
| CT16 | Trios              | Vazio entre três iguais não forma trio                           | `trios.test.js`             |
| CT17 | Trios              | Três iguais na diagonal não formam trio                          | `trios.test.js`             |
| CT18 | Trios              | Quatro iguais seguidos geram uma única violação de trio          | `trios.test.js`             |
| CT19 | Unicidade          | Duas linhas completas iguais geram violação                      | `unicidade.test.js`         |
| CT20 | Unicidade          | Duas colunas completas iguais geram violação                     | `unicidade.test.js`         |
| CT21 | Unicidade          | Linha igual a uma coluna não é violação                          | `unicidade.test.js`         |
| CT22 | Unicidade          | Linhas incompletas iguais não são duplicadas                     | `unicidade.test.js`         |
| CT23 | Resolução          | Grade completa e sem violações está resolvida                    | `valores-possiveis.test.js` |
| CT24 | Resolução          | Grade com células vazias não está resolvida                      | `valores-possiveis.test.js` |
| CT25 | Resolução          | Grade completa com linha duplicada não está resolvida            | `valores-possiveis.test.js` |
| CT26 | Valores possíveis  | Olha só um passo à frente e não altera a grade                   | `valores-possiveis.test.js` |
| CT27 | Valores possíveis  | Exclui o valor que formaria trio                                 | `valores-possiveis.test.js` |
| CT28 | Valores possíveis  | Exclui o valor que quebraria o equilíbrio                        | `valores-possiveis.test.js` |
| CT29 | Valores possíveis  | Devolve lista vazia quando nenhum valor serve                    | `valores-possiveis.test.js` |
| CT30 | Valores possíveis  | Grade inválida, posição inválida ou célula preenchida lança erro | `valores-possiveis.test.js` |
| CT31 | Solucionador       | P1 tem uma única solução                                         | `solucionador.test.js`      |
| CT32 | Solucionador       | Grade vazia tem 4140 soluções                                    | `solucionador.test.js`      |
| CT33 | Solucionador       | P3 tem duas soluções                                             | `solucionador.test.js`      |
| CT34 | Solucionador       | `contarSolucoes` para de contar ao chegar no limite              | `solucionador.test.js`      |
| CT35 | Solucionador       | Grade com trio tem 0 soluções e `resolver` devolve `null`        | `solucionador.test.js`      |
| CT36 | Solucionador       | `resolver` preenche as células vazias de P1 e chega em S1        | `solucionador.test.js`      |
| CT37 | Solucionador       | `resolver` devolve uma grade nova e não altera a recebida        | `solucionador.test.js`      |
| CT38 | Jogo               | O jogo começa com a grade do puzzle e reconhece as pistas        | `jogo.test.js`              |
| CT39 | Jogo               | Jogar preenche uma célula vazia                                  | `jogo.test.js`              |
| CT40 | Jogo               | Jogar troca o valor de uma jogada anterior                       | `jogo.test.js`              |
| CT41 | Jogo               | Jogar com `null` apaga a jogada                                  | `jogo.test.js`              |
| CT42 | Jogo               | Jogar em uma pista lança erro e não muda o jogo                  | `jogo.test.js`              |
| CT43 | Jogo               | Posição ou valor inválido lança erro e não muda o jogo           | `jogo.test.js`              |
| CT44 | Jogo               | Jogada que forma trio é aceita e `validar` aponta a violação     | `jogo.test.js`              |
| CT45 | Jogo               | No início o jogo é válido e não está resolvido                   | `jogo.test.js`              |
| CT46 | Jogo               | Preencher as células vazias com S1 resolve o jogo                | `jogo.test.js`              |
| CT47 | Jogo               | Grade completa com violação não resolve o jogo                   | `jogo.test.js`              |
| CT48 | Jogo               | O jogo guarda uma cópia do puzzle e `grade` devolve uma cópia    | `jogo.test.js`              |
| CT49 | Jogo               | O construtor recusa puzzle sem solução única                     | `jogo.test.js`              |

---

## 8. Colaboradores

| Nome                 | GitHub          | E-mail                    |
| :------------------- | :-------------- | :------------------------ |
| Luiz Augusto Holanda | LUIZAUGUSTO1113 | luizholanda.dev@gmail.com |
| Vinicius Almeida     | ViniciusAlmeid4 | cmpalmeidaa@gmail.com     |
