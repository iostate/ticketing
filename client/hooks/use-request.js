import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error(err);
      // console.log(err.response.data.errors);
      // setErrors(err.response.data.errors);
      // setErrors(err.response.data.errors);
      // setErrors(err);
      setErrors(
        <div className='alert alert-danger'>
          <h3>Oops..</h3>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
