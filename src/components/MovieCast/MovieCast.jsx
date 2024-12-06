import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieCast.css';

const MovieCast = ({ movieId }) => {
  const [cast, setCast] = useState([]);

  useEffect(() => {
    if (movieId) {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      })
        .then((response) => {
          setCast(response.data.cast); // Get the list of cast members
        })
        .catch((error) => {
          console.error('Error fetching movie cast:', error);
        });
    }
  }, [movieId]);

  return (
    <div className='castcon'>
      <h2>Cast</h2>
    <div className="cast-container">
      
      {cast.length > 0 ? (
        <div className="cast-list">
          {cast.map((member) => (
            <div key={member.id} className="cast-item">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w200/${member.profile_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Image'
                }
                alt={member.name}
                className="cast-image"
              />
              <p>{member.name}</p>
              <p className='mem'>{member.character}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No cast information available for this movie.</p>
      )}
    </div>
    </div>
  );
};

export default MovieCast;
