const CONSTANTS = {
  NUMBER_OF_SQUARES: 64,
  WHITE_STARTS: true,
  
  WHITE_KNIGHT_CODE: 3,
  WHITE_BISHOP_CODE: 4,
  WHITE_ROOK_CODE: 5,
  WHITE_KING_CODE: 6,
  WHITE_QUEEN_CODE: 9,
  
  BLACK_KNIGHT_CODE: -3,
  BLACK_BISHOP_CODE: -4,
  BLACK_ROOK_CODE: -5,
  BLACK_KING_CODE: -6,
  BLACK_QUEEN_CODE: -9,
  defaultDelim: "⇒",
  WHITE_KING: "KingW",
  BLACK_KING: "KingB",
  WHITE_PAWN_CODE: 1,
  BLACK_PAWN_CODE: -1,
  
  minWhite: 48, // white piece minimum value
  maxWhite: 63, // 0..63
  maxBlack: 15, // black piece max value
  squaresInRow: 8,
  minBlackPawn: 8,
  minRow: 0,
  maxRow: 7,
  minCol: 0,
  maxCol: 7,
  whitePawnInitialRow: 6,
  blackPawnInitialRow: 1,
  up: 8,
  up2: 16,
  down: -8,
  down2: -16,
  right: 1,
  left: -1,
  downRight: -7,
  downLeft: -9,
  upRight: 9,
  upLeft: 7,
  // en passant codes
  EN_PASSANT_DOWN_LEFT: -9,
  EN_PASSANT_DOWN_RIGHT: -7,
  EN_PASSANT_UP_LEFT: 7,
  EN_PASSANT_UP_RIGHT: 9,

  twoRightOneUp: 10,
  twoRightOneDown: -6,
  twoUpOneRight: 17,
  twoUpOneLeft: 15,
  twoLeftOneUp: 6,
  twoLeftOneDown: -10,
  twoDownOneRight: -15,
  twoDownOneLeft: -17,
  
  maxKnightRowUp: 6,
  minKnightRowDown: 1,
  minTwoDigitNumber: 10,
  numberOfExtraPieces: 2,
  whiteKingId: 60,
  blackKingId: 4,
  whiteLeftRookId: 56,
  whiteRightRookId: 63,
  blackLeftRookId: 0,
  blackRightRookId: 7,

  whitePawnInThisRowCanCaptureWithEnPassant: 3, // rows start from 0
  blackPawnInThisRowCanCaptureWithEnPassant: 4,

  // special moves
  EN_PASSANT: "P",
  CHECK: "+",
  CASTLING_KING_SIDE: ">", // King side
  CASTLING_QUEEN_SIDE: "<", // Queen side
  PROMOTION_TO_QUEEN: "Q",
  PROMOTION_TO_ROOK: "R",
  PROMOTION_TO_BISHOP: "B",
  PROMOTION_TO_KNIGHT: "N",

  // castling constants
  //blackRookCastlingRightSrc: 7,
  //blackRookCastlingRightDst: 5,
  // add other castling square position constants, black & white
  DOBLE_PAWN_STRING:'48⇒3249⇒3350⇒3451⇒3552⇒3653⇒3754⇒3855⇒39',
};
export default CONSTANTS;
