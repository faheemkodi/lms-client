import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const forgotPassword = () => {
  // State
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Context
  const {
    state: { user },
  } = useContext(Context);

  // Router
  const router = useRouter();

  // Redirect logged in user
  useEffect(() => {
    if (user !== null) {
      router.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/forgot-password', { email });
      setSuccess(true);
      toast('Check your email for secret code');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // console.log(email, code, newPassword);
    // return;
    try {
      setLoading(true);
      const { data } = await axios.post('/api/reset-password', {
        email,
        code,
        newPassword,
      });
      setEmail('');
      setCode('');
      setNewPassword('');
      setLoading(false);
      toast('Your password has been reset. Please login.');
    } catch (err) {
      setLoading(false);
      toast(err.response.data);
    }
  };

  return (
    <>
      <h1 className="jumbotron p-5 mb-4 text-center text-light">
        Forgot Password
      </h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={success ? handleResetPassword : handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email address"
            required
          />

          {success && (
            <>
              <input
                type="text"
                className="form-control mb-4 p-3"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter secret code"
                required
              />
              <input
                type="password"
                className="form-control mb-4 p-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </>
          )}
          <button
            type="submit"
            className="btn btn-secondary col-12 p-2"
            disabled={loading || !email}
          >
            {loading ? <SyncOutlined spin /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </>
  );
};

export default forgotPassword;
