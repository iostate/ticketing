import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (err) {
      console.log(err);
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

      // prevents await from going to next line
      // throw err;
    }
  };

  return { doRequest, errors };
};
