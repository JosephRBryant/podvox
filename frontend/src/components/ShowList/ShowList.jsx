import { useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show"
import './ShowList.css'

const ShowList = () => {
  let shows = useSelector(state => state.showState.allShows);

  return (
    <>
      {shows.map((show, idx) => (
        <div key={`${idx}-${show.title}`} className="show-card-container">
          <h2>Show Title</h2>
          <p>{show.showTitle}</p>
        </div>
      ))}
    </>
  )

}

export default ShowList;
