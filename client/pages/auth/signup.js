import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
// import { doRequest, errors} from '../../hooks/use-request';

const ValidationMessage = styled.label`
  color: red;
  padding-top: 1px;
`;

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });
  // const [errors, setErrors] = useState([]);
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [emailValidationMessage, setEmailValidationMessage] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
    // Router.push('/');
  };
  // const onSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await doRequest['post']('/api/users/signup', {
  //       email,
  //       password,
  //     });
  //     // console.log(response.data);
  //   } catch (err) {
  //     console.log(err.response.data.errors);
  //     setErrors(err.response.data.errors);
  //     // can't access errors directly here
  //     console.log(errors);
  //     for (let error of err.response.data.errors) {
  //       console.log(error);
  //       if (error.field === 'password') {
  //         setPasswordValidationMessage(error.message);
  //         console.log(passwordValidationMessage);
  //       }
  //       if (error.field === 'email') {
  //         setEmailValidationMessage(error.message);
  //       }
  //     }
  //   }
  // };

  const handleEmailValidationChange = (message) => {
    setEmailValidationMessage(message);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='form-control'
        />
        {/* {emailValidationMessage ? (
          <ValidationMessage>
            {emailValidationMessage + ' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-exclamation-circle'
              viewBox='0 0 16 16'
            >
              <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
              <path d='M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z' />
            </svg>
          </ValidationMessage>
        ) : (
          <></>
        )} */}
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          value={password}
          id='password'
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          className='form-control'
        />
        {/* {passwordValidationMessage ? (
          <div>
            <ValidationMessage>
              {passwordValidationMessage + ' '}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-exclamation-circle'
                viewBox='0 0 16 16'
              >
                <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
                <path d='M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z' />
              </svg>
            </ValidationMessage>
          </div>
        ) : (
          <></>
        )} */}

        {/* <div className='alert alert-danger'>
          <h3>Oops..</h3>
          <ul className='my-0'>
            {err.response.data.errors.map(err => {
              <li key={err.message}>{err.message}</li>
            })}
          </ul>
        </div> */}
      </div>
      {errors}

      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};
