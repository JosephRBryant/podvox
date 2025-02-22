import { useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show"
import ShowCard from "../ShowCard";

const ShowList = () => {
  let shows = useSelector(state => state.showState.allShows);

  return (
    <main>
      <h1>Podcasts</h1>
      <div className="shows-navbar">
        <form action="">
          <label htmlFor="sort"></label>
          <select name="sort" id="sort" placeholder="sort">
            <option value="" disabled selected hidden>Sort by...</option>
            <option value="name">Podcast Name</option>
            <option value="popular">Trending</option>
            <option value="recent">Recent Episodes</option>
            <option value="show-count">Episode Count</option>
          </select>
        </form>
      </div>
      {shows.map((show, idx) => (
        <div key={`${idx}-${show.title}`} className="show-card-container">
          <ShowCard show={show}/>
        </div>
      ))}
    </main>
  )

}

export default ShowList;
