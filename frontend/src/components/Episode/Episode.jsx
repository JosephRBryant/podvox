import './Episode.css';
import { FaRegCirclePlay } from "react-icons/fa6";

const Episode = ({ episode, show}) => {

  return (
    <div className="episode-block-container">
      {episode.episodeImage ? (
        <img className="episode-image" src={episode.episodeImage}/>
      ) : (
        <img className="episode-image" src={show.showImage}/>
      )}
      <div className="episode-text-block">
        <div className="episode-play-guest">
          <button className="play-button">
            <FaRegCirclePlay />
          </button>
          {episode.guestInfo.length > 0 ? (
            `Episode # ${episode.id}  with guest ${JSON.parse(episode.guestInfo)}`
          ) : (
            `Episode # ${episode.id}`
          )}
        </div>
        <div className="episode-description">
          {episode.episodeDesc}
        </div>
      </div>
    </div>
  )
}

export default Episode;
