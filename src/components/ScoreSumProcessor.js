//import CONSTANTS from "../config/constants";
import _ from "lodash";
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
  //let scoreArrayPos = scoreArrays.length - 1;
  for (let i = originalScoreArrays.length - 1; i > 0; i--) {
    let startPos = 0;

    for (let n = 0; n < originalScoreArrays[i].length; ++n) {
      let value = scoreArrays[i][n]; // if the sum is there, we'll add just it! // originalScoreArrays[i][n];
      const endPos = startPos + Math.abs(value);

      for (let k = startPos; k < endPos; ++k) {
        expandedSumArray[k] = value; // value can be negative here
      }
      startPos = endPos;
    }

    for (let j = 0; j < expandedSumArray.length; ++j) {
      const originalScoreArrayValue = originalScoreArrays[i - 1][j]; // this should always be from the original NON-MODIFIED score array

      console.log(
        "SCORE ARRAY VALUE = " +
          originalScoreArrayValue +
          " scoreArrayPos = " +
          (i - 1) +
          " j = " +
          j
      );
     
      const expandedSumArrayValue = expandedSumArray[j];
      scoreArrays[i - 1][j] = originalScoreArrayValue + expandedSumArrayValue; // this can be negative as well
    } //for
    // scoreArrayPos--;
   
  } // for
  arrayOfOriginalAndScoreSumArray[0] = originalScoreArrays;
  arrayOfOriginalAndScoreSumArray[1] = scoreArrays;
 
  
  return arrayOfOriginalAndScoreSumArray;
}
