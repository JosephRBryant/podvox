import { useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show"
import ShowCard from "../ShowCard";

const ShowList = () => {
  let shows = useSelector(state => state.showState.allShows);

  return (
    <>
      {shows.map((show, idx) => (
        <div key={`${idx}-${show.title}`} className="show-card-container">
          <ShowCard show={show}/>
        </div>
      ))}
    </>
  )

}

export default ShowList;
