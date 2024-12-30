import { IoSearch } from "react-icons/io5";
import "./Search.css";


const Search = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search-form" action="" onSubmit={handleSubmit}>
      <input className="search-input" type="text" placeholder="Search for podcasts, hosts, topics"/>
      <button className="search-btn" type="button">
        <IoSearch />
        <span className='tool-tip-text'>In Development</span>
      </button>
    </form>
  )
}

export default Search;
