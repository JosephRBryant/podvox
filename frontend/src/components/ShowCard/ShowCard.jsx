import './ShowCard.css'
import getAvgLength from '../../helpers/get-avg-length';

const ShowCard = ({show}) => {
  const episodes = show.Episodes;
  let hasEpisodes = true;
  if (episodes.length === 0) {
    hasEpisodes = false;
  }
  console.log('episode lengths', episodes.length, show.showTitle, episodes)
  if (episodes.length === undefined) {
    console.log('the following episode has no duration: ', show.showTitle)
  }

  let pubEpisodes = [];
  for (let episode of episodes) {
    episode.pubDate !== null ? pubEpisodes.push(episode) : null;
  }

  return (
    <>

      <img className="show-card-img" src={show.showImage} alt="" />
      <div className="show-card-content">
        <p>{show.showTitle}</p>
        <p>{show.showDesc}</p>
        <div className="show-card-stats">
          <div className="show-card-ep-count">
            {!show.Episodes || show.Episodes.length === 0 ? (
              `No published episodes`
            ) : (
              pubEpisodes.length === 1 ? (
                `${pubEpisodes.length} episode`

              ) : (
                `${pubEpisodes.length} episodes`
              )
            )}
          </div>
          {!hasEpisodes ? (
            null
          ) : (
            <div className="show-card-avg-length">
              {`Average Length ${getAvgLength(episodes)}`}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ShowCard;
