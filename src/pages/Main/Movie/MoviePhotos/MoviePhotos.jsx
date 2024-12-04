import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MoviePhotos.css';

const MoviePhotos = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/images`,
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      })
        .then((response) => {
          setPhotos(response.data.backdrops); // You can also use 'posters' here depending on the images you want to show
        })
        .catch((error) => {
          console.error('Error fetching movie photos:', error);
        });
    }
  }, [movieId]);

  return (
    <div className="photos-container">
      <h3>Related Photos</h3>
      {photos.length > 0 ? (
        <div className="photos-list">
          {photos.map((photo) => (
            <div key={photo.file_path} className="photo-item">
              <img
                src={`https://image.tmdb.org/t/p/original/${photo.file_path}`}
                alt="Movie Photo"
                className="photo-image"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No photos available for this movie.</p>
      )}
    </div>
  );
};

export default MoviePhotos;
