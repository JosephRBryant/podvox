import './ShowCard.css'
import getAvgLength from '../../helpers/get-avg-length';
import formatDate from '../../helpers/format-date';

const ShowCard = ({show}) => {
  const episodes = show.Episodes;

  let pubEpisodes = [];
  for (let episode of episodes) {
    episode.pubDate !== null ? pubEpisodes.push(episode) : null;
  }

  let hasEpisodes = true;
  if (pubEpisodes.length === 0) {
    hasEpisodes = false;
  }

  const getNewestEpisodeDate = () => {
    let newestDate = "0000-01-01T00:00:00.000Z";
    for (let episode of pubEpisodes) {
      episode.pubDate > newestDate ? newestDate = episode.pubDate : null;
    }
    return newestDate;
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
            <>
              <div className="show-card-avg-length">
                {`Average Length ${getAvgLength(pubEpisodes)}`}
              </div>
              <div className="show-card-newest-date">
                {`Latest episode ${formatDate(getNewestEpisodeDate())}`}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default ShowCard;
