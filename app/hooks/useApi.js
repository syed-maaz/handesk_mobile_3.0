import { useState } from "react";

import useAuth from '../auth/useAuth';

export default useApi = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logOut } = useAuth();

  const request = async (...args) => {
    setLoading(true);
    const response = await apiFunc(...args);
    setLoading(false);
    
    if(!response.ok) {
      if(response.data === 'Invalid token.') logOut();
    }

    setError(!response.ok);
    setData(response.data);
    return response;
  };

  return { data, error, loading, request };
};