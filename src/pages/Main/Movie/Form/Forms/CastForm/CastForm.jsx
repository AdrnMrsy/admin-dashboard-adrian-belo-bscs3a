import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMovieContext } from "../../../../../../context/MovieContext";

const Casts = () => {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.error("Error fetching movie data:", e);
          navigate("/");
        });
    }
  }, [movieId, setMovie, navigate]);

  // Function to delete a cast
  const handleDeleteCast = (castId) => {
    if (window.confirm("Are you sure you want to delete this cast member?")) {
      console.log("Deleting cast member with id:", castId); // Log to check

      // Get the auth token from localStorage or context (wherever it's stored)
      const accessToken = localStorage.getItem("accessToken");

      axios
        .delete(`/casts/${castId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Add Bearer token here
          }
        })
        .then(() => {
          setMovie((prevMovie) => ({
            ...prevMovie,
            casts: prevMovie.casts.filter((cast) => cast.id !== castId), // Remove the deleted cast by id
          }));
          alert("Cast member deleted successfully!");
        })
        .catch((e) => {
          console.error("Error deleting cast member:", e.response ? e.response.data : e.message);
          alert("Failed to delete cast member. Please try again.");
        });
    }
  };

  return (
    <div className="casts-container">
      <h1>Movie Casts</h1>
      {movie?.casts?.length > 0 ? (
        <div>
          {movie.casts.map((cast, index) => (
            <div key={cast.id} className="cast-preview">
              <p>
                <strong>{cast.name}</strong> as {cast.character}
              </p>
              <button
                onClick={() => handleDeleteCast(cast.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No cast members available for this movie.</p>
      )}
    </div>
  );
};

export default Casts;
