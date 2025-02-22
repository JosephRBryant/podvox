const ShowCard = ({show}) => {
  return (
    <>

      <p>{show.showTitle}</p>
      <img src={show.showImage} alt="" />
      <p>{show.showDesc}</p>
    </>
  )
}

export default ShowCard;
