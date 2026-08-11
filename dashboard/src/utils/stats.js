import { jStat } from 'jstat';

export function calculateStats(group1, group2) {
  if (!group1 || !group2 || group1.length < 2 || group2.length < 2) {
    return {
      tScore: 0,
      pValue: 1,
      df: 0,
      meanA: 0,
      meanB: 0,
      sdA: 0,
      sdB: 0,
      seA: 0,
      seB: 0,
      cohensD: 0,
      ciLower: 0,
      ciUpper: 0,
      valid: false
    };
  }

  const meanA = jStat.mean(group1);
  const meanB = jStat.mean(group2);
  const varA = jStat.variance(group1, true); // sample variance
  const varB = jStat.variance(group2, true);
  const sdA = Math.sqrt(varA);
  const sdB = Math.sqrt(varB);
  
  const nA = group1.length;
  const nB = group2.length;

  const seA = sdA / Math.sqrt(nA);
  const seB = sdB / Math.sqrt(nB);

  const seDiff = Math.sqrt((varA / nA) + (varB / nB));

  // Welch's t-test formula
  const tScore = seDiff > 0 ? (meanA - meanB) / seDiff : 0;
  
  // Welch-Satterthwaite equation for degrees of freedom
  const dfNumerator = Math.pow((varA / nA) + (varB / nB), 2);
  const dfDenominator = (Math.pow(varA / nA, 2) / (nA - 1)) + (Math.pow(varB / nB, 2) / (nB - 1));
  const df = dfDenominator > 0 ? dfNumerator / dfDenominator : (nA + nB - 2);

  // Two-tailed p-value
  const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tScore), df));

  // Cohen's d (pooled standard deviation)
  const pooledVar = ((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2);
  const pooledSD = Math.sqrt(pooledVar);
  const cohensD = pooledSD > 0 ? (meanA - meanB) / pooledSD : 0;

  // 95% Confidence Interval for mean difference
  const tCritical = jStat.studentt.inv(0.975, df);
  const diffMean = meanA - meanB;
  const ciLower = diffMean - (tCritical * seDiff);
  const ciUpper = diffMean + (tCritical * seDiff);

  return {
    tScore,
    pValue,
    df,
    meanA,
    meanB,
    sdA,
    sdB,
    seA,
    seB,
    cohensD,
    ciLower,
    ciUpper,
    valid: true
  };
}
