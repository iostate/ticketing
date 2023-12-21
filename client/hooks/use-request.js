import axios from 'axios';
import { string } from 'prop-types';
import { useState } from 'react';

/**
 * @param url URL with baseURL prepended to it.
 * @param method Axios method to be called (post, get,
 * put, delete)
 * @param body Body of the request
 * @param onSuccess Callback to be called after request
 */
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    // const stringifyProps = JSON.stringify(props);
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log(err);
      setErrors(
        <div className='alert alert-danger'>
          <h3>Oops..</h3>
          <ul className='my-0'>
            {err.response?.data?.errors?.map((err) => (
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
