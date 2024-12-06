import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main2.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a href='/main/dashboard'>
              <img
                    src="https://img.icons8.com/?size=30&id=Yj5svDsC4jQA&format=png&color=FAFAFA"
                    alt="Dashboard"
                  />
              </a>
            </li>
            <li>
              <a href='/main/users'>
              <img
                    src="https://img.icons8.com/?size=30&id=ABBSjQJK83zf&format=png&color=FAFAFA"
                    alt="User"
                  />
              </a>
            </li>
            <li>
              <a href='/main/movies'>
              <img
                    src="https://img.icons8.com/?size=30&id=59842&format=png&color=FAFAFA"
                    alt="Movies"
                  />
              </a>
            </li>
            <li className='logout'>
              <a onClick={handleLogout}>
              <img
                    src="https://img.icons8.com/?size=30&id=uPAa8hABNcMw&format=png&color=FAFAFA"
                    alt="Logout"
                  />
              </a>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
