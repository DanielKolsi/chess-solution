export default {
  setupPieceData: [
    [15, "KingB", "bk", 4, false, -6],
    [30, "QueenW", "wq", 59, true, 9],
    [13, "PawnWF", "wpf", 53, true, 1],
    [56, "BishopWC", "wbc", 58, true, 4],
    [60, "KingW", "wk", 60, true, 6],

    // additional promoted pieces
    [64, "QueenW2", "wq2", 64, true, 9],
    [65, "QueenW3", "wq3", 65, true, 9],
    [66, "QueenW4", "wq4", 66, true, 9],
    [67, "QueenW5", "wq5", 67, true, 9],
    [68, "QueenW6", "wq6", 68, true, 9],
    [69, "QueenW7", "wq7", 69, true, 9],
    [70, "QueenW8", "wq8", 70, true, 9],
    [71, "QueenW9", "wq9", 71, true, 9],
    [72, "KnightW3", "wk3", 72, true, 3],
    
    [-1, "QueenB2", "bq2", -1, false, -9],
    [-2, "QueenB3", "bq3", -2, false, -9],
    [-3, "QueenB4", "bq4", -3, false, -9],
    [-4, "QueenB5", "bq5", -4, false, -9],
    [-5, "QueenB6", "bq6", -5, false, -9],
    [-6, "QueenB7", "bq7", -6, false, -9],
    [-7, "QueenB8", "bq8", -7, false, -9],
    [-8, "QueenB9", "bq9", -8, false, -9],
    [-9, "KnightB3", "bk3", -9, false, -3], // black knight underpromotion
  ],
};
