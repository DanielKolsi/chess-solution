/*
Bug status: RESOLVED
Reason: parseInt(move[0], 10); was missing in MoveFunctions (i.e. was not handled as integer!)
last update: 12.10.2020
*/

export default {
  pieces: [
    // black pieces 0-15
    [4, "KingB", "bk", 4, false, -6],
   
    // white pieces 48-63
    [51, "PawnWD", "wpd", 51, true, 1],

    [30, "QueenW", "wq", 59, true, 9],
    [60, "KingW", "wk", 60, true, 6],
  ],
};
