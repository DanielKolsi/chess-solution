//board[0..63].piece.currentSquare|type|id|n|white|value;
export default {
  pieces: [
    // black pieces 0-15
    //[41, "RookBA", "bra", 0, false, -5], //currentSquare, type, id, n (number-id), white (true/false), value
    [1, "KnightBB", "bka", 1, false, -3],
    
    
    [3, "KingB", "bk", 4, false, -6],
    //[39, "BishopBF", "bbf", 5, false, -4],
    
    // white pieces 48-63
    [22, "PawnWG", "wpg", 54, true, 1],
    
    [14, "QueenW", "wq", 59, true, 9],
    [13, "KingW", "wk", 60, true, 6],
    
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
