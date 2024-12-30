import { useEffect, useState } from "react";
import "./Featured.css";
import { useDispatch, useSelector } from "react-redux"
import { clearAndRefetchAllShowsThunk, getAllShowsThunk } from "../../redux/show";
import ShowTile from "../ShowTile";

const Featured = () => {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  let shows = useSelector(state => state.showState.allShows);

  useEffect(() => {
    const getData = async () => {
      await dispatch(getAllShowsThunk());
      await dispatch(clearAndRefetchAllShowsThunk());
      setLoaded(true)
    }
    if (!loaded && !shows.length) {
      getData()
    }
  }, [dispatch, loaded, shows])

  if (!shows) {
    return <h1>Loading</h1>
  }

  return (
    <div className="featured-grid">
      {shows.map((show, idx) => (
        <div key={`${idx}-${show.title}`} className="show-tile-container">
          <ShowTile show={show}/>
        </div>
      ))}
    </div>
  )
}

export default Featured;
