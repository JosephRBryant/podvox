export const getDownloads = (arr) => {
  return arr.sort((a,b) => b.showDownloadTotal - a.showDownloadTotal)
}

export const sortEpisodes = (arr) => {
  return arr.sort((a,b) => b.downloads - a.downloads)
}

export default getDownloads;
