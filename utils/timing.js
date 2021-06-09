/**
 * check if closing time is after opening time
 * * On invalid opening and closing returns false
 * @param {String} opening Opening time(in format hh:mm:ss)
 * @param {String} closing Closing time(in format hh:mm:ss)
 * @param {{differenceInSeconds: Number}} options Options to consider
 * * options.differenceInSeconds: Difference to consider in seconds
 */
exports.isClosingAfterOpening = function isClosingAfterOpening(
  opening,
  closing,
  options = {}
) {
  const { differenceInSeconds = 0 } = options;

  if (closing === opening) return false;
  try {
    const openingInSeconds = changeTimeToSeconds(opening);
    const closingInSeconds = changeTimeToSeconds(closing);

    if (closingInSeconds - differenceInSeconds < openingInSeconds) return false;
  } catch (err) {
    return false;
  }

  return true;
};

/**
 * Change a time in format hh:mm:ss to seconds
 * @param {String} time The time to change to seconds
 */
function changeTimeToSeconds(time) {
  const SEPERATOR = ":";
  const timeFractions = time.split(SEPERATOR).map((timeFractionString) => {
    const timeFractionInteger = Number.parseInt(timeFractionString);

    if (Number.isNaN(timeFractionInteger))
      throw new Error("Time Fraction not a number");

    return timeFractionInteger;
  });

  console.assert(
    timeFractions.length === 3,
    "Time should have seconds, minutes, and hours format hh:mm:ss"
  );
  return timeFractions[0] * 3600 + timeFractions[1] * 60 + timeFractions[2];
}

exports.changeTimeToSeconds = changeTimeToSeconds;
