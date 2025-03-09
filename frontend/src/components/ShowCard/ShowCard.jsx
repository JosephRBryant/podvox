import './ShowCard.css'

const ShowCard = ({show}) => {
  return (
    <>

      <p>{show.showTitle}</p>
      <img className="show-card-img" src={show.showImage} alt="" />
      <p>{show.showDesc}</p>
    </>
  )
}

export default ShowCard;
