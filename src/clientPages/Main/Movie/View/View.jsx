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
          <MovieCast movieId={movie.tmdbId} />

          {movie.videos && movie.videos.length > 0 && (
            <div>
              <h1>Videos</h1>
              {movie.videos.map((video, index) => (
                <div key={index} className="video-preview">
                  {/* Assuming each video object contains a videoKey for YouTube embedding */}
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.videoKey}`}
                    title={video.name || `Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <p>{video.name}</p> {/* Display video name */}
                </div>
              ))}
            </div>
          )}


          {movie.photos && movie.photos.length > 0 && (
            <div>
              <h1>Photos</h1>
              {movie.photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  {/* Assuming each photo object contains a photoUrl for the image source */}
                  <img
                    src={photo.photoUrl}
                    alt={photo.name || `Photo ${index + 1}`}
                    width="560"
                    height="315"
                  />
                  <p>{photo.name}</p> {/* Display photo name */}
                </div>
              ))}
            </div>
          )}

        </>
      )}
    </>
  );
}

export default View;
