import CONSTANTS from "../config/constants";
//import * as HelpFunctions from "./HelpFunctions";

/**
 * Calculate the sum total scores for the evaluation function
 * 1. expand array
 * 2. calculate sum
 */
export function getScoreSumArray(scoreArrays) {
  let scoreSumArray = [];
  const originalScoreArrays = scoreArrays;

  let expandedArray = [];
  for (let i = originalScoreArrays.length -1; i>=0; i-- ) { // 4

    let tempArray = originalScoreArrays[i];

    let startPos = 0;
   for (let n = 0; n < originalScoreArrays[i].length; ++n) {
    let value = Math.abs(originalScoreArrays[i][n]);
     let endPos = startPos + value;
       for (let k = startPos; k < endPos; ++k) {
        expandedArray[k] = value;
       }
       startPos = endPos;
    
   }
     
  }

  return scoreSumArray;
}
