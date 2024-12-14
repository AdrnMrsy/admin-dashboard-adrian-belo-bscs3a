import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case 'email':
        setEmail(event.target.value);

        break;

      case 'password':
        setPassword(event.target.value);
        break;

      default:
        break;
    }
  };

  const handleLogin = async (role) => {
    const data = { email, password };
    setStatus('loading');
    console.log(data);
    const endpoint = role === 'admin' ? '/admin/login' : '/user/login';

    await axios({
      method: 'post',
      url: endpoint,
      data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
      .then((res) => {
        console.log(res);
        localStorage.setItem('accessToken', res.data.access_token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setStatus('idle');
        setTimeout(() => {
          if (res.data.user.role === 'admin') {
            navigate('/main/home1');
          } else {
            navigate('/')
          }
          setStatus('idle');
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
        setTimeout(() => {
          setStatus('idle');
          alert(e.response.data.message);

        }, 3000);
      });
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="mainlog-container">
        <div className='logintitle'>
        <img src='https://img.icons8.com/?size=69&id=97657&format=png&color=9b64dc' alt='logo'/>

        <h1 style={{ color: "#9b64dc",marginLeft:"5px", marginBottom: "20px",  }}>CineScope</h1>
        </div>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                id="email"
                name="email"
                ref={emailRef}
                placeholder="Enter your email"
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {debounceState && isFieldsDirty && email === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                ref={passwordRef}
                placeholder="Enter your password"
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {debounceState && isFieldsDirty && password === '' && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>
            <div className="submit-container">
              <button
                type="button"
                disabled={status === 'loading'}
                onClick={() => {
                  if (status === 'loading') return;
                  if (email && password) {
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    if (email === '') emailRef.current.focus();
                    if (password === '') passwordRef.current.focus();
                  }
                }}
              >
                {status === 'idle' ? 'Login' : 'Loading'}
              </button>
            </div>
            <div className="register-container">
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default Login;
