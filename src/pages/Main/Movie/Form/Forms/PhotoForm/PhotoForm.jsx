import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMovieContext } from "../../../../../../context/MovieContext";

const Photos = () => {
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

  // Function to delete a photo
  const handleDeletePhoto = (photoId) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      console.log("Deleting photo with id:", photoId); // Log to check
  
      // Get the auth token from localStorage or context (wherever it's stored)
      const accessToken = localStorage.getItem("accessToken");
  
      axios
        .delete(`/movies/${movieId}/photos/${photoId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Add Bearer token here
          }
        })
        .then(() => {
          setMovie((prevMovie) => ({
            ...prevMovie,
            photos: prevMovie.photos.filter((photo) => photo.id !== photoId), // Remove the deleted photo by id
          }));
          alert("Photo deleted successfully!");
        })
        .catch((e) => {
          console.error("Error deleting photo:", e.response ? e.response.data : e.message);
          alert("Failed to delete photo. Please try again.");
        });
    }
  };

  return (
    <div className="photos-container">
      <h1>Movie Photos</h1>
      {movie?.photos?.length > 0 ? (
        <div>
          {movie.photos.map((photo, index) => (
            <div key={photo.id} className="photo-preview">
              <img
                src={photo.url} // Assume each photo has a URL field
                alt={photo.name || `Photo ${index + 1}`}
                width="300" // Adjust the size as necessary
                height="auto"
              />
              <p>{photo.name}</p>
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No photos available for this movie.</p>
      )}
    </div>
  );
};

export default Photos;
