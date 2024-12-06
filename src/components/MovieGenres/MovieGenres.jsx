import React, { useState, useEffect } from "react";
import axios from "axios";
import './MovieGenres.css'

const MovieGenres = ({ movieId }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bearerToken = "your_bearer_token";

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    axios({
      method: "get",
      url: url,
      headers: {
        Accept: "application/json",
        Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
      },
    })
      .then((response) => {
        setGenres(response.data.genres);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data from TMDb API");
        setLoading(false);
      });
  }, [movieId, bearerToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <div className="genres-container">
      <div className="genres-list">
        {genres.map((genre) => (
          <div key={genre.id} className="genre-item">
            {genre.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGenres;
