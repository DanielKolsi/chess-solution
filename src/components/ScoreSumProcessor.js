import _ from "lodash";

/*
  What would be the next move score from this board to a piece?
  Take into account: capture possibilities (e.g. doble threat), check, threats...
*/
export function nextMoveScore(board, piece, white) {}

// MAX-MIN rangeScores, for deep 4 get the one where MAX(deep 4) has the minimum score, e.g. MIN of MAXES

// For even deepnesses: Opponent wants to choose the child node with the SMALLEST value, thus the parent with largest SMALL (MAX of MINS) needs to be selected.
export function getMinMaxScoreIndex(scoreArrays) {
  let minMaxScoreIdx = 0;
  let currentScoreArray = scoreArrays[0];
  let previousScoreArray;
  let even = false; // even deepness, e.g. 2, 4
  if (scoreArrays.length === 1) {
    const min = Math.min(...scoreArrays[0]);
    const index = scoreArrays[0].indexOf(min); // we just want that the opponent has the minimum amount of legal move possibilities for his next move
    return index;
  } else {
    previousScoreArray = scoreArrays[1]; // use this like checkSum
    if (scoreArrays.length % 2 === 0) {
      even = true;
    }
  }

  let currentIdx = 0;
  let minMaxScore = 1000;
  let maxMinScore = 0;

  if (!even) {
    // the branch will be selected whose children had the MINIMUM max score value
    for (let i = 0; i < previousScoreArray.length; ++i) {
      const prevValue = previousScoreArray[i];
      let localMax = 0;

      for (let j = currentIdx; j < currentIdx + prevValue; ++j) {
        if (currentScoreArray[j] > localMax) {
          localMax = currentScoreArray[j];
        }
      } // for

      if (localMax < minMaxScore) {
        minMaxScore = localMax;
        minMaxScoreIdx = currentIdx; // this should guarantee the right index for selecting the correct ROOT board (move)
      }
      currentIdx += prevValue; // for the next value range
    } // for
  } else {
    // EVEN: the branch will be selected that has the MAX minimum score value
    for (let i = 0; i < previousScoreArray.length; ++i) {
      const prevValue = previousScoreArray[i];
      let localMin = 1000;
      // console.log("prevValue = " + prevValue);
      for (let j = currentIdx; j < currentIdx + prevValue; ++j) {
        if (currentScoreArray[j] < localMin) {
          localMin = currentScoreArray[j];
          //console.log("LOCAL MIN = " + localMin);
        }
      } // for
      //console.log("NEXT ROUND *********");
      if (localMin > maxMinScore) {
        maxMinScore = localMin;
        minMaxScoreIdx = currentIdx; // this should guarantee the right index for selecting the correct ROOT board (move)
        //console.log("MAX MIN SCORE = " + maxMinScore + " currentIdx = " + currentIdx);
      }
      currentIdx += prevValue; // for the next value range
      //  console.log("current idx= " + currentIdx);
    } // for
  }
  return minMaxScoreIdx; // this will be used as a seed for the range scores function to get the best board index!
}
/**
 * Calculate the sum total scores for the evaluation function
 * 1. expand array
 * 2. calculate sum
 */
export function getScoreSumArray(scoreArrays) {
  const originalScoreArrays = _.cloneDeep(scoreArrays);
  let arrayOfOriginalAndScoreSumArray = [2];

  let expandedSumArray = []; // mapped from the previous array to have the same size than the upcoming array

  let rootScoresCalculated = false;
  let subtractNegativeOriginalScoreArrayValue = false;

  for (let i = originalScoreArrays.length - 1; i > 0; i--) {
    //console.log("orig score array length = " + originalScoreArrays[i].length);

    expandedSumArray = getExpandedArrayFromPreviousOriginalScoreArray(
      originalScoreArrays[i],
      scoreArrays[i],
      rootScoresCalculated
    );

    if (!rootScoresCalculated) {
      rootScoresCalculated = true;
    }

    console.log("expanded sum array length = " + expandedSumArray.length);
    for (let j = 0; j < expandedSumArray.length; ++j) {
      const originalScoreArrayValue = originalScoreArrays[i - 1][j]; // this should always be from the original NON-MODIFIED score array

      /*   console.log(
        "SCORE ARRAY VALUE = " +
          originalScoreArrayValue +
          " scoreArrayPos = " +
          (i - 1) +
          " j = " +
          j
      );*/

      const expandedSumArrayValue = expandedSumArray[j];

      if (subtractNegativeOriginalScoreArrayValue) {
        scoreArrays[i - 1][j] = expandedSumArrayValue - originalScoreArrayValue; // expandedSumArrayValue can be negative as well
      } else {
        scoreArrays[i - 1][j] = originalScoreArrayValue + expandedSumArrayValue; // this can be negative as well
      }
    } //for
    subtractNegativeOriginalScoreArrayValue =
      !subtractNegativeOriginalScoreArrayValue;
  } // for
  arrayOfOriginalAndScoreSumArray[0] = originalScoreArrays;
  arrayOfOriginalAndScoreSumArray[1] = scoreArrays;
  return arrayOfOriginalAndScoreSumArray;
}

// do the array expansion here
function getExpandedArrayFromPreviousOriginalScoreArray(
  previousOriginalScoreArray,
  previousScoreArray,
  rootScoresCalculated
) {
  //const checkSum = Heuristics.getCheckSum(previousScoreArray); // 734 issue

  let expandedSumArray = [];
  let startPos = 0;
  let endPos = 0;
  //console.log("orig score array length = " + previousOriginalScoreArray.length);

  for (let n = 0; n < previousOriginalScoreArray.length; ++n) {
    let value = rootScoresCalculated
      ? previousScoreArray[n]
      : -previousScoreArray[n]; // if the sum is there, we'll add just it, the initial (i.e. opponent score) is ALWAYS negative!
    endPos = startPos + previousOriginalScoreArray[n];

    for (let k = startPos; k < endPos; ++k) {
      expandedSumArray[k] = value;
    }
    startPos = endPos;
  } // for
  return expandedSumArray;
}
