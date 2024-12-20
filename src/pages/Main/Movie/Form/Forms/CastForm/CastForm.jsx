import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMovieContext } from "../../../../../../context/MovieContext";
import './CastForm.css'

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

      const accessToken = localStorage.getItem("accessToken");

      axios
        .delete(`/casts/${castId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` 
          }
        })
        .then(() => {
          setMovie((prevMovie) => ({
            ...prevMovie,
            casts: prevMovie.casts.filter((cast) => cast.id !== castId), 
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
    <div className="castss-container">
      <h1>Movie Casts</h1>
      {movie?.casts?.length > 0 ? (
        <div>
          {movie.casts.map((cast, index) => (
            <div key={cast.id} className="castss-preview">
               <img
                className="cast-photo"
                src={cast.url || "https://via.placeholder.com/250x250?text=No+Image+Available"}
                alt={cast.characterName}
                width="auto"
                height="250"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/250x250?text=No+Image+Available";
                }}
              />
              <p>
                <strong>{cast.name}</strong> as {cast.characterName}
              </p>
              <button
                onClick={() => handleDeleteCast(cast.id)}
                className="deletess-button"
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
