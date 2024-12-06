import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function MainClient() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
  };

  const handleGoToLoginClick = () => {
    alert('Go to Login page');
    navigate('/login'); // Navigate to the login page
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
              <a onClick={() => navigate('/')}>
                
              <div className='logotitle'>
        <img src='https://img.icons8.com/?size=35&id=97657&format=png&color=9b64dc' alt='logo'/>

        <p style={{ color: "#9b64dc",marginLeft:"5px",fontSize:"20px"  }}>CineScope</p>
        </div>
              </a>
            </li>
            {/* <li>
              <a onClick={() => navigate('/')}>
                
                   <img
                    src="https://img.icons8.com/?size=35&id=59842&format=png&color=FAFAFA"
                    alt="Movies"
                  />
              </a>
            </li> */}
            {accessToken ? (
              <li className='logout'>
                <a onClick={handleLogout}>
                <img
                    src="https://img.icons8.com/?size=35&id=uPAa8hABNcMw&format=png&color=FAFAFA"
                    alt="Logout"
                  />
                </a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={handleGoToLoginClick}>SignIn</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainClient;
