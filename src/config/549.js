//https://tb7.chessok.com/probe/3/61
/*
# TODO: 11/12/2024
# Opp-King-NoMoves-IF-Checked (Free a strategic checking square by a SAC to mate) #freeBySac
# Check INDIVIDUAL starting positions, which ones (1-7/549) will go correct with a VERY simple (OWN-OPPONENT) scoring function?
# Rule out outright bad NEXT moves, e.g. threatning piece can be captured by next opponent move 
# Smothered mate; check + zero King moves!
1. KF5   #  King moves?
2. RB5+  #
3. KG4   #
4. RB4+  #
5. KF3   # KF3 vs. KH5  difference in BEST move between Probe (+OWN) and Lichess
  Why KF3 is the best alternative and better than KH5? (Allowed moves: KF3, KF5, KH3, KH5)
+ KF3: Number of allowed next own King moves++ (+ N points score)
- KH5: Threatscore (attacks black bishop in H4, pins rook, -1/-2 own king next moves)
- Number of next opponent GOOD checks? (GOOD check = checking piece cannot be captured)
+ Number of next own GOOD checks?
## Best simplest strategy for 5.: MAX OWN NEXT ALLOWED MOVES

6. ND7   #
7. QH8 Probe vs. QD7 # OWN blunder # what causes the difference/deviation?
*
* TRIVIAL SCORE FORMULA FOR FIRST 7 PLIES (1=CORRECT, 0=WRONG)
* 1. 1 
* 2. 0 (RF3)
* 3.  
* 4. 
* 5. 
* 6. 
* 7.
*/

import CONSTANTS from "../config/constants";
//board[0..63].piece.currentSquare|type|id|n|white|value;
export default {
  pieces: [
    // black pieces 0-15
    [41, "RookBA", "bra", 0, false, -5], //currentSquare, type, id, n (number-id), white (true/false), value
    [1, "KnightBB", "bka", 1, false, -3],

    [3, "KingB", "bk", 4, false, CONSTANTS.BLACK_KING_CODE],
    [39, "BishopBF", "bbf", 5, false, CONSTANTS.BLACK_BISHOP_CODE],

    // white pieces 48-63
    [22, "PawnWG", "wpg", 54, true, 1],

    [14, "QueenW", "wq", 59, true, 9],
    [21, "KingW", "wk", 60, true, 6],

    // additional promoted pieces, need to add all underpromotions for white & black!
    [64, "QueenW2", "wq2", 64, true, 9],
    [65, "QueenW3", "wq3", 65, true, 9],
    [66, "QueenW4", "wq4", 66, true, 9],
    [67, "QueenW5", "wq5", 67, true, 9],
    [68, "QueenW6", "wq6", 68, true, 9],
    [69, "QueenW7", "wq7", 69, true, 9],
    // white underpromotions
    [70, "RookW3", "wr3", 70, true, 5],
    [80, "BishopW3", "wb3", 80, true, CONSTANTS.WHITE_BISHOP_CODE],
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
    [-20, "BishopB3", "bb3", -4, false, CONSTANTS.BLACK_BISHOP_CODE],
    [-30, "KnightB3", "bn3", -3, false, -3],
  ],
};
