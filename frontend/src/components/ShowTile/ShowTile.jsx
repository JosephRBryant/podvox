import { useNavigate } from 'react-router-dom';
import './ShowTile.css';

const ShowTile = (show) => {
  const navigate = useNavigate();
  show = show.show;

  const goToShowPage = (e) => {
    e.preventDefault();
    navigate(`/shows/${show.id}`);
  };

  return (
    <div className="show-tile" style={{backgroundImage: `url(${show.showImage})`}} onClick={goToShowPage}>
    </div>
  )
};

export default ShowTile;

