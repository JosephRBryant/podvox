import './ShowCard.css';
import getAvgLength from '../../helpers/get-avg-length';
import formatDate from '../../helpers/format-date';
import { IoPlayOutline } from "react-icons/io5";
import { getOneEpisodeThunk } from '../../redux/episode';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const ShowCard = ({show}) => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const episodes = show.Episodes;
  let newestEpisodeId;
  let newestEpisode = useSelector(state => state.episodeT)

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      setLoaded(true);
      await dispatch(getOneEpisodeThunk(newestEpisodeId));
      setLoaded(false);
    }

    if (!newestEpisode || newestEpisode.id !== newestEpisodeId) {
      fetchEpisodeDetails();
    } else {
      setLoaded(false);
    }

  }, [dispatch, loaded, newestEpisode, newestEpisodeId]);
  console.log('newest Episode title:', newestEpisode)

  // Get published Episodes
  let pubEpisodes = [];
  for (let episode of episodes) {
    episode.pubDate !== null ? pubEpisodes.push(episode) : null;
  }

  let hasEpisodes = true;
  if (pubEpisodes.length === 0) {
    hasEpisodes = false;
  }

  // Get Newest Episode Date and Id
  const getNewestEpisodeDate = () => {
    let newestDate = "0000-01-01T00:00:00.000Z";

    for (let episode of pubEpisodes) {
      if (episode.pubDate > newestDate) {
        newestDate = episode.pubDate;
        newestEpisodeId = episode.id;
      }
    }
    console.log('newest Episode for ', show.showTitle, ' is: ', newestEpisodeId)
    return newestDate;
  }
  console.log('newest Episode title:', newestEpisode)

  return (
    <>

      <img className="show-card-img" src={show.showImage} alt="" />
      <div className="show-card-content">
        <div className="show-card-copy">
          <h3 className='show-card-title'>{show.showTitle}</h3>
          {show.showDesc.length > 433 ? (
            <>
            <p className='show-card-desc'>
              {`${show.showDesc} `}
            </p>
            {show.showDesc.length > 300 && (
              <a className="show-card-more-link" href={`/shows/${show.id}`}>...more</a>
            )
            }
          </>

          ) : (
            <p className='show-card-desc'>{show.showDesc}</p>

          )}

        </div>
        <div className="show-card-stats-listen">
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
                |
                <div className="show-card-avg-length">
                  {`Avg Length: ${getAvgLength(pubEpisodes)}`}
                </div>
                |
                <div className="show-card-newest-date">
                  {`Last: ${formatDate(getNewestEpisodeDate())}`}
                </div>
              </>
            )}
          </div>
          <button className="show-card-listen-btn">
          <IoPlayOutline className='show-card-play-icon'/>
          Listen Now
          </button>
        </div>
      </div>
    </>
  )
}

export default ShowCard;
