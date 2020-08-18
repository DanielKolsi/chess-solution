export default {
  setupPieceData: [
    // black pieces 0-15
    [0, "RookBA", "bra", 0, false, -5], //currentSquare, type, id, n (number-id), white (true/false), value
    [1, "KnightBB", "bka", 1, false, -3],
    [2, "BishopBC", "bbc", 2, false, -4],
    [3, "QueenB", "bq", 3, false, -9],
    [4, "KingB", "bk", 4, false, -6],
    [5, "BishopBF", "bbf", 5, false, -4],
    [6, "KnightBG", "bkg", 6, false, -3],
    [7, "RookBH", "brh", 7, false, -5],
    [8, "PawnBA", "bpa", 8, false, -1],
    [9, "PawnBB", "bpb", 9, false, -1],
    [10, "PawnBC", "bpc", 10, false, -1],
    [11, "PawnBD", "bpd", 11, false, -1],
    [12, "PawnBE", "bpe", 12, false, -1],
    [13, "PawnBF", "bpf", 13, false, -1],
    [14, "PawnBG", "bpg", 14, false, -1],
    [15, "PawnBH", "bph", 15, false, -1],

    // white pieces 48-63
    [48, "PawnWA", "wpa", 48, true, 1],
    [49, "PawnWB", "wpb", 49, true, 1],
    [50, "PawnWC", "wpc", 50, true, 1],
    [51, "PawnWD", "wpd", 51, true, 1],
    [52, "PawnWE", "wpe", 52, true, 1],
    [53, "PawnWF", "wpf", 53, true, 1],
    [54, "PawnWG", "wpg", 54, true, 1],
    [55, "PawnWH", "wph", 55, true, 1],
    [56, "RookWA", "wra", 56, true, 5],
    [57, "KnightWB", "wkb", 57, true, 3],
    [58, "BishopWC", "wbc", 58, true, 4],
    [59, "QueenW", "wq", 59, true, 9],
    [60, "KingW", "wk", 60, true, 6],
    [61, "BishopWF", "wbf", 61, true, 4],
    [62, "KnightWG", "wkg", 62, true, 3],
    [63, "RookWH", "wrh", 63, true, 5],

    // additional promoted pieces, need to add all underpromotions for white & black!
    [64, "QueenW2", "wq2", 64, true, 9],
    [65, "QueenW3", "wq3", 65, true, 9],
    [66, "QueenW4", "wq4", 66, true, 9],
    [67, "QueenW5", "wq5", 67, true, 9],
    [68, "QueenW6", "wq6", 68, true, 9],
    [69, "QueenW7", "wq7", 69, true, 9],    
    // white underpromotions
    [70, "RookW3", "wr3", 70, true, 5],
    [80, "BishopW3", "wb3", 80, true, 4],
    [90, "KnightW3", "wn3", 90, true, 3],

    // black promotions
    [-1, "QueenB2", "bq2", -1, false, -9],
    [-2, "QueenB3", "bq3", -2, false, -9],
    [-3, "QueenB4", "bq4", -3, false, -9],
    [-4, "QueenB5", "bq5", -4, false, -9],
    [-5, "QueenB6", "bq6", -5, false, -9],
    [-6, "QueenB7", "bq7", -6, false, -9],
    [-7, "QueenB8", "bq8", -7, false, -9],
    [-8, "QueenB9", "bq9", -8, false, -9],
    // black underpromotions
    [-10, "RookB3", "br3", -5, false, -5],
    [-20, "BishopB3", "bb3", -4, false, -4],
    [-30, "KnightB3", "bn3", -3, false, -3],    
  ],
};
