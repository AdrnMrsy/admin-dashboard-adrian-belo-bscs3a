import { useEffect } from "react";
import { useMovieContext } from "../../../../context/MovieContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MovieGenres from "../../../../components/MovieGenres/MovieGenres";
import MovieCast from "../../../../components/MovieCast/MovieCast";
import MoviePhotos from "../../../../components/MoviePhotos/MoviePhotos";
import MovieVideos from "../../../../components/MovieVideos/MovieVideos";
import './View.css';

function View() {
  const { movie, setMovie } = useMovieContext();

  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId !== undefined) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.log(e);
          navigate("/");
        });
    }
    return () => {};
  }, [movieId]);

  const convertYear = (date) => {
    return date ? date.split("-")[0] : null;
  };

  return (
    <>
      {movie && (
        <>
          <div>
            <div className="viewmain">
          <div className="viewcontainer">
          <div
            className="viewbackdrop"
            style={{
              objectFit:"fill",
              background: `url(${
                movie.backdropPath !==
                "https://image.tmdb.org/t/p/original/undefined"
                  ? movie.backdropPath
                  : movie.posterPath
              }) no-repeat center top`,
            }}
          >
            
            <div className="titlecontv">
              <div className="divgv">
              <div className="groupdetailsv">
                <span className="featured-movie-titlev">{movie.title}</span>
                <MovieGenres movieId={movie.tmdbId} />
                <span className="moviedatev">{movie.releaseDate}</span>
                <span className="moviedatev">{movie.overview}</span>
              </div>
              <div className="posterv">
              <img
                className="poster-imagev"
                src={`https://image.tmdb.org/t/p/original/${movie.posterPath}` }
                alt={movie.original_title}
              />
              </div>
              </div>
            </div>
          
            {/* {JSON.stringify(movie)} */}
          </div>
          </div>
          </div>
          </div>

        
          {/* <MovieVideos movieId={movie.tmdbId} /> */}
          {/* <MoviePhotos movieId={movie.tmdbId} /> */}
          <h2 className="h2ph">Cast</h2>
<div className="viewcast">
  {movie.casts && movie.casts.length > 0 ? (
    <div className="vcast">
      <div>
        <div className="cast-preview">
          {movie.casts.map((cast, index) => (
            <div key={index} className="cast-item">
              <img
                className="cast-photo"
                src={cast.url}
                alt={cast.name}
                width="auto"
                height="250"
              />
              <p className="actor-name">{cast.name}</p>
              <p className="character-name">{cast.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <p>No cast information available.</p> // Display message if no cast data
  )}
</div>


          <h2 className="h2ph">Photos</h2>
          <div className="viewphoto">
            {movie.photos && movie.photos.length > 0 ? (
              <div className="vphoto">
                <div>
                  <div className="photo-preview">
                    {movie.photos.map((photo, index) => (
                      <div key={index}>
                        <img
                          className="photo-item"
                          src={photo.url}
                          alt={photo.name || `Photo ${index + 1}`}
                          width="auto"
                          height="450"
                        />
                        <p>{photo.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>No photos available.</p> // Display message if no photos
            )}
          </div>
          <h2 className="h2ph">Videos</h2>
          <div className="viewvid">
            {movie.videos && movie.videos.length > 0 ? (
             <div className="vvideos">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video-preview">
                    
                    <iframe
                      width="auto"
                      height="560"
                      src={`https://www.youtube.com/embed/${video.videoKey}`}
                      title={video.name || `Video ${index + 1}`}
                      frameBorder="0"
                      
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
               
                  </div>

                ))}
              
              </div>

            ) : (
              <p>No videos available.</p> // Display message if no videos
            )}
          </div>

          
        </>
      )}
    </>
  );
}

export default View;
