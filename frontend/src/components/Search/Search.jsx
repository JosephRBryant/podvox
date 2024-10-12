import { IoSearch } from "react-icons/io5";
import "./Search.css";


const Search = () => {
  return (
    <form className="search-form" action="">
      <input className="search-input" type="text" placeholder="Search for podcasts, hosts, topics"/>
      <button>
        <IoSearch />
      </button>
    </form>
  )
}

export default Search;
