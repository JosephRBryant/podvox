import convertSeconds from "./convert-seconds";

export const getAvgLength = (episodeArray) => {
  console.log('epArray', episodeArray)
  let totalSeconds = 0;
  console.log('ep arr', episodeArray.length)
  for (let episode of episodeArray) {
    if (!episode.duration) {
      continue;
    }
    console.log('ep dur', episode.duration)
    totalSeconds += episode.duration;
  }
  const avgSeconds = totalSeconds / episodeArray.length;
  return convertSeconds(avgSeconds)
}

export default getAvgLength;
