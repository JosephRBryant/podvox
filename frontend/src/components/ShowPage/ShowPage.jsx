import { getOneShowThunk } from '../../redux/show';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Episode from '../Episode';
import { sortEpisodes } from '../../helpers/sort-array';
import './ShowPage.css';
import React from 'react';

const ShowPage = () => {
  const dispatch = useDispatch();
  const { showId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [activeSort, setActiveSort] = useState('newest');
  const show = useSelector(state => state.showState.showDetails);

  useEffect(() => {
    window.scrollTo(0, 0)
    const getData = async () => {
      setLoading(true);
      await dispatch(getOneShowThunk(Number(showId)));
      setLoading(false)
      setLoaded(true)
    };
    if (!loaded) {
      getData()
    }
  }, [dispatch, showId])

  if (!show || !show.User) {
    return <h1>Loading...</h1>
  }

  let popular = sortEpisodes([...show.Episodes])

  const toggleSort = (sortType) => {
    setActiveSort(sortType)
  }

  return (
    <main>
      <div className="show-page-container">
        {loaded ? (
          <div className="show-page-banner">
            <div className="show-page-banner-background-container">
              <div className="show-page-banner-background" style={{backgroundImage: `url(${show.showImage})`}}></div>
            </div>
            <div className="show-page-banner-grid">
              <img className='show-page-banner-show-image' src={show.showImage} alt="show image" />
              <div className="show-page-banner-header">
                <h1>{show.showTitle}</h1>
                <h2>{`with ${show.author}`}</h2>
              </div>
              <div className="show-page-banner-description">
                <p>{show.showDesc}</p>
                <br />
                {live ? (
                  <NavLink to={`/shows/${showId}/live`} className="show-page-banner-description-live-btn">
                    Streaming Live
                    <div className="show-page-banner-description-green-light"></div>
                  </NavLink>
                ) : null}
                <span className='show-page-banner-description-episode-count'>{`${show.Episodes.length} episodes available`}</span>
              </div>
              <img className="show-page-banner-profile-image" src={show.User.profileImg}/>
            </div>
          </div>
        ) : (
          <div className="show-page-banner-load"></div>
        )}
        <div className="show-page-episode-container">
          <div className="show-page-episode-links">
            <div id='newest' className={activeSort === 'newest' ? 'active-sort' : ''} onClick={() => toggleSort('newest')}>Newest</div>
            <div id='popular' className={activeSort === 'popular' ? 'active-sort' : ''} onClick={() => toggleSort('popular')}>Popular</div>
          </div>
          {activeSort === 'popular' ? (
            popular.map((episode) => (
              <div key={`${episode.id}-${episode.episodeTitle}`} className="show-page-episode">
                <Episode episode={episode} show={show}/>
              </div>
            ))
          ) : (
            show.Episodes.map((episode) => (

              <div key={`${episode.id}-${episode.episodeTitle}`} className="show-page-episode">
                <Episode episode={episode} show={show}/>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}

export default ShowPage;
