import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "./Form.css";
import React, { useReducer } from "react";
import { useMovieContext } from "../../../../context/MovieContext";

const initialState = {
  videos: [],
  casts: [],
  photos: [],
  loading: false,
  error: null,
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
  const [selectedVideo, setSelectedVideo] = useState([]); // to be used when i change the adding of video,photos,casts
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedCasts, setSelectedCasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMovieListVisible, setIsMovieListVisible] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState([]);
  //select vid,cast,photo
  const handleToggleSelectVideo = (video) => {
    setSelectedVideo((prev) =>
      prev.some((v) => v.id === video.id)
        ? prev.filter((v) => v.id !== video.id)
        : [...prev, video]
    );
  };

  const handleToggleSelectPhoto = (photo) => {
    setSelectedPhotos((prev) =>
      prev.some((p) => p.file_path === photo.file_path)
        ? prev.filter((p) => p.file_path !== photo.file_path)
        : [...prev, photo]
    );
  };

  const handleToggleSelectCast = (actor) => {
    setSelectedCasts((prev) =>
      prev.some((a) => a.id === actor.id)
        ? prev.filter((a) => a.id !== actor.id)
        : [...prev, actor]
    );
  };
  //GET MOVIE TO CHECK MOVIE EXIST

  const getMovies = () => {
    axios.get("/movies").then((response) => {
      setLists(response.data);
    });
  };
  useEffect(() => {
    getMovies();
  }, []);

  //FETCHER
  const fetchVideos = async (tmdbId) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${tmdbId}/videos?language=en-US`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8",
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
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8",
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
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8",
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
  // useEffect(() => {
  //   // Update selected state or clear it when state is empty or null
  //   setSelectedPhotos(state.photos && state.photos.length > 0 ? state.photos : []);
  //   setSelectedVideo(state.videos && state.videos.length > 0 ? state.videos : []);
  //   setSelectedCasts(state.casts && state.casts.length > 0 ? state.casts : []);
  // }, [state.photos, state.videos, state.casts]);

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
        method: "get",
        url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDdmYTM5OWRhNmY1NGM0OTQ5M2MxZThlNzRjYjk0ZiIsIm5iZiI6MTczMzI5NjgzOC42MzUsInN1YiI6IjY3NTAwMmM2NTIwMWY4YzE1ZjE3N2Y5MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmnC4jtUQ886XsS1MQ2s11jhoR0mN0IN62wGWeK4IJ8",
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
          console.error("Error fetching movie data:", error);
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
      url: `https://www.youtube.com/embed/${video.key}`,
      name: video.name,
      site: video.site,
      videoKey: video.key,
      videoType: video.type,
      official: video.official,
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
    const castData = {
      movieId: movieId,
      name: actor.name,
      url: `https://image.tmdb.org/t/p/w500/${actor.profile_path}`,
      characterName: actor.character,
    };
    console.log(castData);
    try {
      const response = await axios({
        method: "post",
        url: "/admin/casts",
        data: castData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      console.log("Cast added successfully:", response.data);
      //  alert("Cast added successfully!");
      return true;
    } catch (error) {
      console.error("Error adding cast:", error);
      return false;
    }
  };
  //PHOTOS FUNCTIONS
  const handleAddPhotos = async (movieId, photo) => {
    const accessToken = localStorage.getItem("accessToken");
    const photoData = {
      movieId: movieId,
      url: photo?.file_path
        ? `https://image.tmdb.org/t/p/w500${photo.file_path}`
        : "https://via.placeholder.com/500x750?text=No+Photo+Available",
      description: photo?.file_path ? "Movie Poster" : "No photo available",
    };

    try {
      const response = await axios({
        method: "post",
        url: "/photos",
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
    fetchVideos(movie.id);
    fetchPhotos(movie.id);
    fetchCast(movie.id);
  };

  //SAVE to DB
  const handleSave = async () => {
    console.log(selectedMovie.id);
    setLoading(true);

    const missingData = [];
    if (!state.videos || state.videos.length <= 0) missingData.push("videos");
    if (!state.photos || state.photos.length <= 0) missingData.push("photos");
    if (!state.casts || state.casts.length <= 0) missingData.push("casts");

    if (missingData.length > 0) {
      alert(`No ${missingData.join(", ")} found. Proceeding with empty data.`);
    }

    const accessToken = localStorage.getItem("accessToken");

    if (!selectedMovie) {
      alert("Please search and select a movie.");
      return;
    }

    if (!movieId) {
      const movieExists = lists.some(
        (movie) => movie.tmdbId === selectedMovie.id
      );
      if (movieExists) {
        alert("This movie already exists in the database.");
        return;
      }
    }


    const data = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: selectedMovie.isFeatured,
    };

    try {
      const response = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const newMovieId = movieId || response.data.id;

      console.log("Movie saved successfully:", response.data);

      if (movieId || !movieId) {
        const addItems = async (items, handler, type) => {
          if (items && items.length > 0) {
            const addPromises = items.map((item) => handler(newMovieId, item));
            const results = await Promise.all(addPromises);
            if (results.includes(false)) {
              alert(
                `One or more ${type} could not be added. Please try again.`
              );
              return false;
            }
          }
          return true;
        };

        if (!(await addItems(selectedVideo, handleAddVideo, "videos"))) return;
        if (!(await addItems(selectedPhotos, handleAddPhotos, "photos")))return;
        if (!(await addItems(selectedCasts, handleAddCasts, "casts"))) return;
      }
      setTimeout(() => {
      alert("Movie saved successfully!");
      setLoading(false);

        navigate(`/main/movies`);
      }, 3000); 
      
    } catch (error) {
      console.error("Error saving movie:", error);
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
          {/* Movie Search Section */}
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
                  <button
                    type="button"
                    className="btnsearch"
                    onClick={() => handleSearch(1)}
                  >
                    <img
                      src="https://img.icons8.com/?size=45&id=12456&format=png&color=FAFAFA"
                      alt="Search Icon"
                    />
                  </button>
                </div>

                {/* button to show/hide movie list */}
                {isMovieListVisible && (
                  <button
                    type="button"
                    className="btn-toggle"
                    onClick={handleToggleMovieList}
                  >
                    {isMovieListVisible ? "Hide" : "Show Movie List"}
                  </button>
                )}

                {/* Movie List */}
                {isMovieListVisible && (
                  <div className="searched-movie">
                    {searchedMovieList.map((movie) => (
                      <p
                        key={movie.id}
                        onClick={() => handleSelectMovie(movie)}
                      >
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
          {/* Movie Details Setion*/}
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
                    setSelectedMovie({
                      ...selectedMovie,
                      overview: e.target.value,
                    })
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
              <div className="field">
                <label>Is Featured</label>
                <select
                  className="seletor-feature"
                  value={
                    selectedMovie &&
                    typeof selectedMovie.isFeatured === "boolean"
                      ? selectedMovie.isFeatured
                        ? "Yes"
                        : "No"
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      isFeatured: e.target.value === "Yes",
                    })
                  }
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <button type="button" className="btnsave" onClick={handleSave}>
                Save
              </button>
            </div>
          </form>

         {loading && (
  <div className="full-view-message loading-message">
    Loading...
  </div>
)}
{/* {error && (
  <div className="full-view-message error-message">
    Error: {error}
  </div>
)} */}


          {/* Video,Cast,Photo section */}

          <div>
            <h2>Videos</h2>
            <div className="videosMainCont">
              {state.videos && state.videos.length > 0 ? (
                state.videos.map((video) => (
                  <div className="videosCont" key={video.id}>
                    <p>{video.name}</p>
                    <div className="videolist">
                      <div className="video-preview">
                        <iframe
                          width="540"
                          height="300"
                          src={`https://www.youtube.com/embed/${video.key}`}
                          title={video.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    <button onClick={() => handleToggleSelectVideo(video)}>
                      {selectedVideo.some((v) => v.id === video.id)
                        ? "Unselect"
                        : "Select"}
                    </button>
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
                  <div key={actor.id} className="castss-preview">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
                          : "https://via.placeholder.com/250x250?text=No+Image+Available"
                      }
                      alt={actor.name}
                      className="cast-photo"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/250x250?text=No+Image+Available";
                      }}
                    />
                    <p>
                      <strong>{actor.name}</strong> as {actor.character}
                    </p>
                    <button onClick={() => handleToggleSelectCast(actor)}>
                      {selectedCasts.some((a) => a.id === actor.id)
                        ? "Unselect"
                        : "Select"}
                    </button>
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
                  <div className="photo-items">
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/w500/${photo.file_path}`}
                      alt="Movie photo"
                      className="movie-photo"
                    />
                    <button onClick={() => handleToggleSelectPhoto(photo)}>
                      {selectedPhotos.some(
                        (p) => p.file_path === photo.file_path
                      )
                        ? "Unselect"
                        : "Select"}
                    </button>
                  </div>
                ))
              ) : (
                <p>No photos available</p>
              )}
            </div>
            {/* <div className="selected-items">
        <h3>Selected Items:</h3>
        <h4>Videos</h4>
        <pre>{JSON.stringify(selectedVideo, null, 2)}</pre>

        <h4>Photos</h4>
        <pre>{JSON.stringify(selectedPhotos, null, 2)}</pre>

        <h4>Casts</h4>
        <pre>{JSON.stringify(selectedCasts, null, 2)}</pre>
      </div> */}
          </div>
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
