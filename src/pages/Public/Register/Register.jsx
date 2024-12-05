import React, { useState, useRef } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const navigate = useNavigate();

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error for the field
  };

  const validateForm = () => {
    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]) newErrors[key] = 'This field is required';
    }
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');

    try {
      const res = await axios.post('/admin/register', formData);
      console.log(res);
      localStorage.setItem('accessToken', res.data.access_token);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setStatus('idle');
      setErrors({ api: 'Registration failed. Please try again.' }); // Generic error message
    }
  };

  return (
    <div className='Register'>
      <div className='main-container'>
        <h3>Register</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='form-container'>
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <div className='form-group'>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    name={key}
                    value={formData[key]}
                    onChange={handleOnChange}
                  />
                </div>
                {errors[key] && <span className='errors'>{errors[key]}</span>}
              </div>
            ))}
            <div className='submit-container'>
              <button
                type='button'
                disabled={status === 'loading'}
                onClick={handleRegister}
              >
                {status === 'idle' ? 'Register' : 'Loading'}
              </button>
            </div>
            {errors.api && <span className='errors'>{errors.api}</span>}
            <div className='login-container'>
              <a href='/'>
                <small>Already have an account? Login</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
