import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthComponent = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleAuth = async () => {
    setLoading(true);
    try {
      // ...existing authentication code...
    } catch (err) {
      // If unable to connect to server, redirect to home
      history.push('/home');
      // Optionally, you can still set the error if you want to show a message after redirect
      // setError('Unable to connect to server.');
    }
    setLoading(false);
  };

  return (
    <div>
      {/* ...existing JSX code... */}
      <button onClick={handleAuth} disabled={loading}>
        {loading ? 'Loading...' : 'Authenticate'}
      </button>
    </div>
  );
};

export default AuthComponent;