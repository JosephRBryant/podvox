import { useEffect, useState } from "react";
import "./Featured.css";
import { useDispatch, useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show";

const Featured = () => {
  const dispatch =useDispatch();
  const [loaded, setLoaded] = useState(false);
  let shows = useSelector(state => state.showState.allShows);

  useEffect(() => {
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

  return (
    <div className="featured-grid">
      {shows.map((show, idx) => (
        <div key={`${show.id}-${show.title}`} className="show-tile" style={{backgroundImage: `url(${show.showImage})`}}>
        </div>
      ))}
    </div>
  )
}

export default Featured;
