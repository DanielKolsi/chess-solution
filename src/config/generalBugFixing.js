/*
Bug status: resolved
*/
//currentSquare, type, id, n (number-id), white (true/false), value
export default {
  pieces: [
    // black pieces 0-15
    [4, "KingB", "bk", 4, false, -6],
    [51, "BishopBC", "bbc", 2, false, -4],
    
        // white pieces 48-63
  //  [13, "PawnWD", "wpd", 51, true, 1],
   // [11, "KnightWB", "wkb", 57, true, 30],
    [3, "KnightWG", "wkg", 62, true, 3],
    //[12, "BishopWC", "wbc", 58, true, 4],
    [13, "BishopWF", "wbf", 61, true, 4],
   // [5, "PawnWC", "wpc", 0, true, 1],
  
    [60, "KingW", "wk", 60, true, 6],
  ],
};
