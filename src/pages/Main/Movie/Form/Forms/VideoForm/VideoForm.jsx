import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMovieContext } from "../../../../../../context/MovieContext";

const Videos = () => {
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

  // Function to delete a video
  const handleDeleteVideo = (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      console.log("Deleting video with id:", videoId); // Log to check
  
      // Get the auth token from localStorage or context (wherever it's stored)
      const accessToken = localStorage.getItem("accessToken");
  
      axios
        .delete(`/movies/${movieId}/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}` // Add Bearer token here
          }
        })
        .then(() => {
          setMovie((prevMovie) => ({
            ...prevMovie,
            videos: prevMovie.videos.filter((video) => video.id !== videoId), // Remove the deleted video by id
          }));
          alert("Video deleted successfully!");
        })
        .catch((e) => {
          console.error("Error deleting video:", e.response ? e.response.data : e.message);
          alert("Failed to delete video. Please try again.");
        });
    }
  };
  
  

  return (
    <div className="videos-container">
      <h1>Movie Videos</h1>
      {movie?.videos?.length > 0 ? (
        <div>
          {movie.videos.map((video, index) => (
            <div key={video.id} className="video-preview"> {/* Use video.id as key */}
                <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.videoKey}`}
                title={video.name || `Video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ></iframe>
                <p>{video.name}</p>
                <button
                onClick={() => handleDeleteVideo(video.id)}  
                className="delete-button"
                >
                Delete
                </button>
            </div>
            ))}

        </div>
      ) : (
        <p>No videos available for this movie.</p>
      )}
    </div>
  );
};

export default Videos;
