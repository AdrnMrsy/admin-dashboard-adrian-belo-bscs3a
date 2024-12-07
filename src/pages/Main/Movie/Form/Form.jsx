import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Form.css";
import React, { useReducer } from "react";
const initialState = { 
  videos: [], 
  casts: [], 
  photos: [], 
  loading: false, 
  error: null 
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_CASTS":
      return { ...state, loading: false, casts: action.payload };
    case "SET_PHOTOS":
      return { ...state, loading: false, photos: action.payload };
    case "SET_VIDEOS":
      return { ...state, loading: false, videos: action.payload };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const navigate = useNavigate();
  let { movieId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedCasts, setSelectedCasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [isMovieListVisible, setIsMovieListVisible] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);


//FETCHER
const fetchVideos = async (tmdbId) => {
  dispatch({ type: "SET_LOADING" });
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
      {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
},
      }
    );
    dispatch({ type: "SET_VIDEOS", payload: response.data.results || [] });
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: "Error fetching videos" });
    console.error(error);
  }
};

const fetchCast = async (tmdbId) => {
  dispatch({ type: "SET_LOADING" });
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
      {
        headers: {
          Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      }
    );
    dispatch({ type: "SET_CASTS", payload: response.data.cast || [] });
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: "Error fetching cast" });
    console.error(error);
  }
};

const fetchPhotos = async (tmdbId) => {
  dispatch({ type: "SET_LOADING" });
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}/images`,
      {
        headers: {
          Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      }
    );
    dispatch({
      type: "SET_PHOTOS",
      payload: response.data.posters || [],
    });
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: "Error fetching photos" });
    console.error(error);
  }
};
useEffect(() => {
  // Update selected state or clear it when state is empty or null
  setSelectedPhotos(state.photos && state.photos.length > 0 ? state.photos : []);
  setSelectedVideo(state.videos && state.videos.length > 0 ? state.videos : []);
  setSelectedCasts(state.casts && state.casts.length > 0 ? state.casts : []);
}, [state.photos, state.videos, state.casts]);

//SEARCH
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleSearch(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1);
    }
  };
  const handleSearch = useCallback(
    (page = 1) => {
      axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8',
        },
      })
        .then((response) => {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages); 
          setCurrentPage(page); 
          console.log(response.data.results);
          setIsMovieListVisible(true); // Show the movie list after search
        })
        .catch((error) => {
          console.error('Error fetching movie data:', error);
        });
    },
    [query]
  );
  const handleToggleMovieList = () => {
    setIsMovieListVisible(!isMovieListVisible); // Toggle visibility
  };
//*ADD FUNCTIONS*// 
//VIDEOS
  const handleAddVideo = async (movieId, video) => {
    const accessToken = localStorage.getItem("accessToken");
    const videoData = {
      movieId: movieId,
      url: video?.key
        ? `https://www.youtube.com/embed/${video.key}`
        : "https://www.youtube.com/embed/not_available",
      name: video?.name || "No video selected",
      site: video?.site || "YouTube",
      videoKey: video?.key || "not_available",
      videoType: video?.type || "placeholder",
      official: video?.official || false,
    };
  
    try {
      const response = await axios({
        method: "post",
        url: "/videos", // Ensure this is the correct endpoint for adding videos
        data: videoData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      console.log("Video added successfully:", response.data);
      // alert("Video added successfully!");
      return true; // Indicate success
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
      return false; // Indicate failure
    }
  };
//CAST FUNCTIONS
const handleAddCasts = async (movieId, actor) => {
  const accessToken = localStorage.getItem("accessToken");
  const userId=1;
  // Prepare cast data for a single actor
  const castData = {
    userId: userId,
    movieId: movieId,
    name: actor.name, // Cast name
    url: actor.photo || "https://via.placeholder.com/150x150?text=No+Photo+Available", // Default placeholder if no photo
    characterName: actor.character, // Character played by the cast
  };
 console.log(castData)
  try {
    const response = await axios({
      method: "post",
      url: "/casts", // Ensure this is the correct endpoint for adding casts
      data: castData, // Send cast data
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",

      },
    });

    console.log("Cast added successfully:", response.data);
   alert("Cast added successfully!");
    return true; // Indicate success
  } catch (error) {
    console.error("Error adding cast:", error);
    alert("Failed to add cast. Please try again.");
    return false; // Indicate failure
  }
};
//PHOTOS FUNCTIONS  
const handleAddPhotos = async (movieId, photo) => {
  const accessToken = localStorage.getItem("accessToken");
  const photoData = {
    movieId: movieId,
    url: photo?.file_path
      ? `https://image.tmdb.org/t/p/w500${photo.file_path}`
      : "https://via.placeholder.com/500x750?text=No+Photo+Available", // Default placeholder if no photo
    description: photo?.file_path ? "Movie Poster" : "No photo available", // Set a name for the photo
  };

  try {
    const response = await axios({
      method: "post",
      url: "/photos", // Ensure this is the correct endpoint for adding photos
      data: photoData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Photo added successfully:", response.data);
    // alert("Photo added successfully!");
    return true; // Indicate success
  } catch (error) {
    console.error("Error adding photo:", error);
    alert("Failed to add photo. Please try again.");
    return false; // Indicate failure
  }
};
  
//MOVIES and FETCH Videos,Photos,Casts
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    fetchVideos(movie.id); // Fetch videos for the selected movie
    fetchPhotos(movie.id); // Fetch videos for the selected movie
    fetchCast(movie.id); // Fetch videos for the selected movie
  };

//SAVE to DB
const handleSave = async () => {
  // Check for missing required data
  setLoading(true);

  const missingData = [];
  if (!state.videos || state.videos.length <= 0) missingData.push("videos");
  if (!state.photos || state.photos.length <= 0) missingData.push("photos");
  if (!state.casts || state.casts.length <= 0) missingData.push("casts");

  // If any data is missing, alert and proceed
  if (missingData.length > 0) {
    alert(`No ${missingData.join(", ")} found. Proceeding with empty data.`);
  }

  const accessToken = localStorage.getItem("accessToken");

  // Ensure a movie is selected
  if (!selectedMovie) {
    alert("Please search and select a movie.");
    return;
  }

  // Prepare movie data for the API request
  const data = {
    tmdbId: selectedMovie.id,
    title: selectedMovie.original_title,
    overview: selectedMovie.overview,
    popularity: selectedMovie.popularity,
    releaseDate: selectedMovie.release_date,
    voteAverage: selectedMovie.vote_average,
    backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
    posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
    isFeatured: 0,
  };

  try {
    // Make the API request to save the movie
    const response = await axios({
      method: movieId ? "patch" : "post",
      url: movieId ? `/movies/${movieId}` : "/movies",
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Get the movie ID, either from existing state or the response
    const newMovieId = movieId || response.data.id;

    console.log("Movie saved successfully:", response.data);

    // Function to handle adding videos, photos, and casts
    const addItems = async (items, handler, type) => {
      if (items && items.length > 0) {
        const addPromises = items.map(item => handler(newMovieId, item)); // Add items concurrently
        const results = await Promise.all(addPromises);
        if (results.includes(false)) {
          alert(`One or more ${type} could not be added. Please try again.`);
          return false;
        }
      }
      return true;
    };

    // Add videos, photos, and casts (if available)
    if (!(await addItems(selectedVideo, handleAddVideo, "videos"))) return;
    if (!(await addItems(selectedPhotos, handleAddPhotos, "photos"))) return;
    // Uncomment if cast handling is necessary
    // if (!(await addItems(selectedCasts, handleAddCasts, "casts"))) return;
    setLoading(false);

    alert("Movie saved successfully!");
    // Navigate to the movie details page
    navigate(`/main/movies`);
  } catch (error) {
    console.error("Error saving movie:", error);
    setLoading(false);

    alert("Failed to save the movie. Please try again.");
  }
};

  useEffect(() => {
    if (movieId) {
      // Fetch movie details from your server
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath,
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setSelectedMovie(tempData);
          console.log(response.data);
  
          // Fetch videos from TMDB using the TMDB ID
          return response.data.tmdbId;
        })
        .then((tmdbId) => {
          fetchVideos(tmdbId);
          fetchCast(tmdbId); // Fetch cast when tmdbId is available
          fetchPhotos(tmdbId); // Fetch photos when tmdbId is available
        })
        .catch((error) => console.log(error));
    }
  }, [movieId]);

  return (
    <div className="formmain">
    <div className="maincon">
      <div className="titleform">
      <h1>{movieId !== undefined ? "Edit " : "Create "}Movie</h1>
      </div>
      <div>
        {/* Search */}
        {movieId === undefined && (
          <>
            <div className="search-container">
              <div className="searchgroup">
                <input
                  type="text"
                  className="inputsearch"
                  placeholder="Search Movie"
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button type="button" className="btnsearch" onClick={() => handleSearch(1)}>
                  <img
                    src="https://img.icons8.com/?size=45&id=12456&format=png&color=FAFAFA"
                    alt="Search Icon"
                  />
                </button>
              </div>

              {/* Toggle button to show/hide movie list */}
              {isMovieListVisible && (
                <button type="button" className="btn-toggle" onClick={handleToggleMovieList}>
                  {isMovieListVisible ? 'Hide' : 'Show Movie List'}
                </button>
              )}

              {/* Movie List */}
              {isMovieListVisible && (
                <div className="searched-movie">
                  {searchedMovieList.map((movie) => (
                    <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                      {movie.original_title}
                    </p>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {isMovieListVisible && (
                <div className="pagination">
                  <button
                    className="btnpage"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <img
                      src="https://img.icons8.com/?size=20&id=26146&format=png&color=FAFAFA"
                      alt="Left Icon"
                    />
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="btnpage"
                  >
                    <img
                      src="https://img.icons8.com/?size=20&id=26147&format=png&color=FAFAFA"
                      alt="Right Icon"
                    />
                  </button>
                </div>
              )}
            </div>
            <hr />
          </>
        )}

      </div>
    </div>

    <div>
      <div className="container">
        <form className="formgroup">
          <div className="Movieimg">
            {selectedMovie ? (
              <img
                className="poster-image"
                src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                alt={selectedMovie.original_title}
              />
            ) : (
              ""
            )}
          </div>
          <div className="fieldgroup">
            <div className="field">
              Title:
              <input
                className="inputtext"
                type="text"
                disabled={!movieId}
                value={selectedMovie ? selectedMovie.original_title : ""}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    original_title: e.target.value,
                  })
                }
              />
            </div>
            <div className="field">
              Overview:
              <textarea
                className="inputtext"
                disabled={!movieId}
                rows={10}
                value={selectedMovie ? selectedMovie.overview : ""}
                onChange={(e) =>
                  setSelectedMovie({ ...selectedMovie, overview: e.target.value })
                }
              />
            </div>
            <div className="field">
              Popularity:
              <input
                className="inputtext"
                type="text"
                disabled={!movieId}
                value={selectedMovie ? selectedMovie.popularity : ""}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    popularity: e.target.value,
                  })
                }
              />
            </div>
            <div className="field">
              Release Date:
              <input
                className="inputtext"
                type="text"
                disabled={!movieId}
                value={selectedMovie ? selectedMovie.release_date : ""}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    release_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="field">
              Vote Average:
              <input
                className="inputtext"
                type="text"
                disabled={!movieId}
                value={selectedMovie ? selectedMovie.vote_average : ""}
                onChange={(e) =>
                  setSelectedMovie({
                    ...selectedMovie,
                    vote_average: e.target.value,
                  })
                }
              />
            </div>
            <button type="button"  className='btnsave' onClick={handleSave}>
              Save
            </button>
          </div>
        </form>

        <div className="loadingstate">{loading && <p>Loading, please wait...</p>}  // Show loading indicator if loading is true
        </div>

        {state.loading && <p>Loading...</p>}
        {state.error && <p>Error: {state.error}</p>}
       {/* Conditionally show Videos, Cast, and Photos only when creating a movie */}
    {!movieId && (
      <>
        <h2>Videos</h2>
        <div className="videosMainCont">
          {state.videos && state.videos.length > 0 ? (
            state.videos.map((video) => (
              <div className="videosCont" key={video.id}>
                <p>{video.name}</p>
                <div className="videolist">
                  <div className="video-preview">
                    <iframe
                      width="560"
                      height="315"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No videos found</p>
          )}
        </div>

        <h2>Cast</h2>
        <div className="casts-container">
          {state.casts.length > 0 ? (
            state.casts.map((actor) => (
              <div key={actor.id} className="cast-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                  alt={actor.name}
                  className="actor-image"
                />
                <p>{actor.name}</p>
                <p>{actor.character}</p>
              </div>
            ))
          ) : (
            <p>No cast information available</p>
          )}
        </div>

        <h2>Photos</h2>
        <div className="photos-container">
          {state.photos.length > 0 ? (
            state.photos.map((photo) => (
              <img
                key={photo.file_path}
                src={`https://image.tmdb.org/t/p/w500/${photo.file_path}`}
                alt="Movie photo"
                className="movie-photo"
              />
            ))
          ) : (
            <p>No photos available</p>
          )}
        </div>
      </>
    )}
      </div>

    </div>


      {movieId && (
        <div>
          <hr />
          <nav>
            <ul className="tabs">
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/casts`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Form;
