import './Browse.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllShowsThunk } from '../../redux/show';
import ShowTile from '../ShowTile';
import sortArray from '../../helpers/sort-array';

const Browse = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  let shows = useSelector(state => state.showState.allShows);

  useEffect(() => {
    window.scrollTo(0, 0)
    const getData = async () => {
      await dispatch(getAllShowsThunk());
      setLoaded(true)
    }
    if (!loaded && !shows.length) {
      getData()
    }
  }, [dispatch, loaded, shows])

  if (!shows) {
    return <h1>Loading</h1>
  }

  let popular = sortArray([...shows], 'showDownloadTotal')

  return (
    <main className="browse-container">
      <div className="browse-header">
        Explore Our Expansive Podcast Library
      </div>
      <div className="browse-list-container">
        <h2>Trending Podcasts</h2>
        <div className="browse-list-grid">
          {popular.map((show, idx) => (
            <div key={`${idx}-${show.showTitle}`} className="show-tile-container">
              <ShowTile show={show}/>
            </div>
            // <div key={`${show.id}-${show.title}`} className="show-tile" style={{backgroundImage: `url(${show.showImage})`}}>
            // </div>
          ))}
        </div>
      </div>
      <div className="browse-list-container">
        <h2>Business & Entrepreneurs</h2>
        <div className="browse-list-grid">
          {shows.map((show, idx) => (
            <div key={`${idx}-${show.title}`} className="show-tile-container">
              <ShowTile  show={show}/>
            </div>
          ))}
        </div>
      </div>
      <div className="browse-list-container">
        <h2>Pod Vox Picks</h2>
        <div className="browse-list-grid">
          {shows.map((show, idx) => (
            <div key={`${idx}-${show.title}`} className="show-tile-container">
              <ShowTile  show={show}/>
            </div>
          ))}
        </div>
      </div>
      <div className="browse-list-container">
        <h2>Health & Wellness</h2>
        <div className="browse-list-grid">
          {shows.map((show, idx) => (
            <div key={`${idx}-${show.title}`} className="show-tile-container">
              <ShowTile  show={show}/>
            </div>
          ))}
        </div>
      </div>
      <div className="load-more-container">
        <button className="load-more">Load More...</button>
      </div>
    </main>
  )
}

export default Browse;
