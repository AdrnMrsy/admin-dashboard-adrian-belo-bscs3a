import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);


  const getMovies = () => {
    //get the movies from the api or database
    axios.get('/movies').then((response) => {
      setLists(response.data);
    });
  };
  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure that you want to delete this data?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          //update list by modifying the movie list array
          const tempLists = [...lists];
          const index = lists.findIndex((movie) => movie.id === id);
          if (index !== undefined || index !== -1) {
            tempLists.splice(index, 1);
            setLists(tempLists);
          }

          //update list by requesting again to api
          // getMovies();
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <div className='lists-container'>
      
      <div className='create-container'>
      <h1>Movies</h1>
        <button
          type='button'
          className='btncreate'
          onClick={() => {
            navigate('/main/movies/form');
          }}
        >
          ADD          <img src='https://img.icons8.com/?size=25&id=sE8CuzuVQX3D&format=png&color=000000'alt='ADD'/>
        </button>
      </div>
      <div className='table-container'>
        <table className='movie-lists'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {lists.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.title}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/main/movies/form/' + movie.id);
                  }}
                >
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(movie.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        </table>
      </div>
    </div>
  );
};

export default Lists;
