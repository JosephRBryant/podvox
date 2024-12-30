import { useState, useEffect } from 'react';
import LiveStream from '../LiveStream';
import LiveChat from '../LiveChat';
import './LivePage.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneShowThunk } from '../../redux/show';

const LivePage = () => {
  const dispatch = useDispatch();
  const { showId } = useParams();
  const [loaded, setLoaded] = useState(false);
  const show = useSelector(state => state.showState.showDetails);

  useEffect(() => {
    const getData = async () => {
      await dispatch(getOneShowThunk(showId))
      setLoaded(true)
    }

    if (!loaded) {
      getData()
    }
  }, [dispatch, showId, loaded]);

  return (
    <main>
      <div className="live-header">
        <h1 className='live-header-title'>{show.showTitle} <span>streaming now</span></h1>
      </div>
      <div className="live-features-container">
        <LiveStream />
        <LiveChat />
      </div>
    </main>
  )
}

export default LivePage;
