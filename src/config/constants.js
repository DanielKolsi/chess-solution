const CONSTANTS = {
  defaultDelim: '#',
  whitePawn: 1,
  blackPawn: -1,
  minWhite: 48, // white piece minimum value
  maxWhite: 63,
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
  enPasseDownLeft: -9,
  enPasseDownRight: -7,
  enPasseUpLeft: 7,
  enPasseUpRight: 9,
  twoRightOneUp: 10,
  twoRightOneDown: -6,
  twoUpOneRight: 17,
  twoUpOneLeft: 15,
  twoLeftOneUp: 6,
  twoLeftOneDown: -10,
  twoDownOneRight: -15,
  twoDownOneLeft: -17,
  whitePawnValue: 1,
  blackPawnValue: -1,
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

  whiteEnPasseAllowedRow: 3,
  blackEnPasseAllowedRow: 4,
  enPasse: 'P',
  castlingShortWhite: '(',
  castlingShortBlack: ')',
  castlingLongWhite: '[',
  castlingLongBlack: ']',
  blackRookCastlingRightSrc: 7,
  blackRookCastlingRightDst: 5
  // add other castling square position constants, black & white


}

export default CONSTANTS;
