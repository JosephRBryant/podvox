import { useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show"
import ShowCard from "../ShowCard";
import { useState, useRef, useEffect } from "react";

const ShowList = () => {
  let shows = useSelector(state => state.showState.allShows);
  const [showFilters, setShowFilters] = useState(false);

  const ulRef = useRef();

  const toggleFilters = (e) => {
    e.stopPropagation();
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    if (!showFilters) return;

    const closeFilters = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('click', closeFilters);

    return () => document.removeEventListener('click', closeFilters);
  }, [showFilters]);

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
          <div className="filter-btn" onClick={toggleFilters}>
            Categories
          </div>
          {showFilters && (
            <div className="filters-dropdown" ref={ulRef}>
              test buttons
            </div>
          )}
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
