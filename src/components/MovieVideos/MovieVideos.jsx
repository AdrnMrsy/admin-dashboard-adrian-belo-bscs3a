import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieVideos.css'

const MovieVideos = ({ movieId }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      })
        .then((response) => {
          setVideos(response.data.results);
        })
        .catch((error) => {
          console.error('Error fetching movie videos:', error);
        });
    }
  }, [movieId]);

  return (
    <div className="videos-container">
      <h3>Related Videos</h3>
      {videos.length > 0 ? (
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <h4>{video.name}</h4>
              {video.site === 'YouTube' && (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No videos available for this movie.</p>
      )}
    </div>
  );
};

export default MovieVideos;
