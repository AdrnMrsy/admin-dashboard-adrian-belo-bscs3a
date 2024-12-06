import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import MovieCards from "../../../../components/MovieCards/MovieCards";
import { useMovieContext } from "../../../../context/MovieContext";

const Home1 = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();

  const getMovies = () => {
    //get the movies from the api or database
    axios
      .get("/movies")
      .then((response) => {
        setMovieList(response.data);
        const random = Math.floor(Math.random() * response.data.length);
        setFeaturedMovie(response.data[random]);
        console.log(response.data);
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (movieList.length) {
        console.log("change movie");
        const random = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[random]);
      }
    }, 5000);
    return;
  }, [featuredMovie]);

  const convertYear = (date) => {
    return date ? date.split("-")[0] : null;
  };
  return (
    <div className="mainmovie-container">
      
      {featuredMovie && movieList.length ? (
      <div className="moviecont">
        
        <div className="featured-list-container">
          <div
            className="featured-backdrop"
            style={{
              objectFit:"fill",
              background: `url(${
                featuredMovie.backdropPath !==
                "https://image.tmdb.org/t/p/original/undefined"
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center top`,
            }}
          >
            <div className="titlecont">
            <div className="groupdetails">
              <span className="featured-movie-title">{featuredMovie.title}</span>
              <span className="moviedate">{featuredMovie.releaseDate}</span>
              <span className="moviedate">{featuredMovie.overview}</span>
              <button 
              className="viewbtn"
              onClick={() => {
                navigate(`/main/home1/view1/${featuredMovie.id}`);
                setMovie(featuredMovie);
              }}>VIEW</button>

            </div>
           
            </div>
          </div>
          
        </div>
       

      </div>

      ) : (
        <div className="featured-list-container-loader"></div>
      )}
      <div className="cent">
      <h1>MOVIES</h1>
      <div className="list-container">
      
        {movieList.map((movie) => (
          <div key={movie.id}>
            <MovieCards
              movie={movie}
              onClick={() => {
                navigate(`/main/home1/view1/${movie.id}`);
                setMovie(movie);
              }}
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home1;
