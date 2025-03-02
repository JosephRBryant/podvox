import { useSelector } from "react-redux"
import { getAllShowsThunk } from "../../redux/show"
import ShowCard from "../ShowCard";
import './ShowList.css';
import { useState, useRef, useEffect } from "react";

const ShowList = () => {
  let shows = useSelector(state => state.showState.allShows);
  const [showFilters, setShowFilters] = useState(false);
  const [chosenCategories, setChosenCategories] = useState(false);
  const [filters, setFilters] = useState({
    arts: {category: 'Arts', active: false},
    business: {category: 'Business', active: false},
    comedy: {category: 'Comedy', active: false},
    education: {category: 'Education', active: false},
    fiction: {category: 'Fiction', active: false},
    government: {category: 'Government', active: false},
    history: {category: 'History', active: false},
    health: {category: 'Health', active: false},
    family: {category: 'Kids & Family', active: false},
    leisure: {category: 'Leisure', active: false},
    music: {category: 'Music', active: false},
    news: {category: 'News', active: false},
    religion: {category: 'Religion', active: false},
    science: {category: 'Scince', active: false},
    society: {category: 'Society', active: false},
    sports: {category: 'Sports', active: false},
    technology: {category: 'Technology', active: false},
    trueCrime: {category: 'True Crime', active: false},
    tvFilm: {category: 'Arts', active: false}
  })
  const ulRef = useRef();

  const toggleFilters = (e) => {
    e.preventDefault();
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
      <form className="shows-navbar" action="">
        <label htmlFor="sort" className="hidden"></label>
        <select className='show-sort' name="sort" id="sort" placeholder="sort">
          <option value="" disabled selected hidden>Sort by...</option>
          <option value="name">Podcast Name</option>
          <option value="popular">Trending</option>
          <option value="recent">Recent Episodes</option>
          <option value="show-count">Episode Count</option>
        </select>
        <div className="filter-btn" onClick={toggleFilters}>
          Categories
          {showFilters && (
            <div className="filters-dropdown" ref={ulRef}>
              {Object.values(filters).map((filter, idx) => (
                <div className="filter-button">
                  {filter.category}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="show-search-container">
          <input type="text" className="show-search" placeholder="Search..."/>
          <button className="search-submit">i</button>
        </div>
      </form>
      {shows.map((show, idx) => (
        <div key={`${idx}-${show.title}`} className="show-card-container">
          <ShowCard show={show}/>
        </div>
      ))}
    </main>
  )

}

export default ShowList;
