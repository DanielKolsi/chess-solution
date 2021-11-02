
  export function getPieceThreatScore(piece) {

    const value = piece.value;
    const pos = piece.pos;
    let threatScore = 0;
    switch (value) {
        case CONSTANTS.WHITE_PAWN_CODE: 
          //MoveFunctions.getThreatScoreByBlackPawn(           );
          const upLeft = pos + CONSTANTS.upLeft;
          const upRight = pos + CONSTANTS.upRight;
          // if (board[upLeft] == white_queen) threatScore +=9;
          // getPieceThreatScore // how much threat score this piece can increment?
          break;
        case CONSTANTS.WHITE_KNIGHT_CODE:
        //  
        break;
        case CONSTANTS.WHITE_BISHOP_CODE:
          //
          break;
        case CONSTANTS.WHITE_ROOK_CODE:
          //
          break;
        case CONSTANTS.WHITE_KING_CODE:
          //
          break;
        case CONSTANTS.WHITE_QUEEN_CODE:
          //
          break;
        default:
          break;
      }
    return 0;
}