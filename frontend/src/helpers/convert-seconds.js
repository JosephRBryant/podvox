export const convertSeconds = (avgSeconds) => {
  const minutes = Math.floor(avgSeconds / 60);
  console.log('avg seconds from convert helper', avgSeconds)
  let seconds = Math.trunc(avgSeconds % 60);

  String(seconds).length < 2 ? seconds = `0${seconds}` : null;

  return `${minutes}:${seconds}`
}

export default convertSeconds;
