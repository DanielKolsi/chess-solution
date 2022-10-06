//import CONSTANTS from "../config/constants";
import _ from "lodash";
//import * as Heuristics from "./Heuristics";
//import * as HelpFunctions from "./HelpFunctions";

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

  for (let i = originalScoreArrays.length - 1; i > 0; i--) {
    console.log("orig score array length = " + originalScoreArrays[i].length);

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

      if (i % 2 !== 0) {
        scoreArrays[i - 1][j] =
          -originalScoreArrayValue + expandedSumArrayValue; // this can be negative as well
      } else {
        scoreArrays[i - 1][j] = originalScoreArrayValue + expandedSumArrayValue; // this can be negative as well
      }
    } //for
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
    let value = rootScoresCalculated ? previousScoreArray[n] : -previousScoreArray[n]; // if the sum is there, we'll add just it, the initial (i.e. opponent score) is ALWAYS negative!
    endPos = startPos + previousOriginalScoreArray[n];

    for (let k = startPos; k < endPos; ++k) {
      expandedSumArray[k] = value;
    }
    startPos = endPos;
  } // for

  return expandedSumArray;
}
