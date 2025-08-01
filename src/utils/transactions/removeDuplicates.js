import normalizeString from "./normalizeString";
import calculateSimilarity from "./calculateSimilarity";
export default function({existing_txns, extracted_txns}) {
  let new_txns = [];
  // Create a copy of existing transactions to avoid modifying the original array
  // let existing_txns_copy = [...existing_txns];

  extracted_txns.forEach(function(nt) {
    let exists = false;
    // console.log('\n\n\n=====');
    // console.log(nt.fingerprint)
    // console.log('=====');
    // Check against all existing transactions
    for (const et of existing_txns) {
      if(et.date==nt.date){
        if(et.inflow==nt.inflow && et.outflow==nt.outflow){
          exists=true;
          break;
        }
      }
      // exists=true;

      // if(et.date!=nt.date)
      //   continue;
      // if(et.inflow!=nt.inflow)
      //   continue;

      // const compare = calculateSimilarity(nt.fingerprint, et.fingerprint);
      // if (compare.similarity > 0.9) {
      //   console.log(et.fingerprint, '-', compare.similarity);
      //   exists = true;
      //   break; // Exit loop once a match is found
      // }
    }

    if (!exists) 
      new_txns.push(nt);
  });

  return new_txns;
}