import './MovieCards.css';
function MovieCards({ movie: movie, onClick }) {
  return (
    <>
      <div className='card' onClick={onClick}>
        <img src={
    movie.posterPath
      ? `https://image.tmdb.org/t/p/original/${movie.posterPath}`
      : "https://via.placeholder.com/300x450?text=No+Image+Available"
  }
  alt={movie.title} 
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = "https://via.placeholder.com/300x450?text=No+Image+Available";
        }}/>
        <span>{movie.title}</span>
      </div>
    </>
  );
}

export default MovieCards;
