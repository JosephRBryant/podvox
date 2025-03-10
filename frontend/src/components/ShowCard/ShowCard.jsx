import './ShowCard.css'

const ShowCard = ({show}) => {


  return (
    <>

      <img className="show-card-img" src={show.showImage} alt="" />
      <div className="show-card-content">
        <p>{show.showTitle}</p>
        <p>{show.showDesc}</p>
        <div className="show-card-stats">
          <div className="show-card-ep-count">
            {!show.Episodes || show.Episodes.length === 0 ? (
              `Episode Count 0`
            ) : (
              `Episode Count ${show.Episodes.length}`
            )}
          </div>
          <div className="show-card-avg-length">
            
          </div>

        </div>
      </div>
    </>
  )
}

export default ShowCard;
