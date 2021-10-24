import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  // Router
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push('/login');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ email, password });
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      // console.log('Login response', data);
      dispatch({
        type: 'LOGIN',
        payload: data,
      });
      window.localStorage.setItem('user', JSON.stringify(data));
      // Redirect
      setLoading(false);
      router.push('/user');
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron p-5 mb-4 text-center text-light">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button
            type="submit"
            className="btn col-12 btn-secondary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Submit'}
          </button>
        </form>

        <p className="text-center pt-3">
          Not yet registered?{' '}
          <Link href="/register">
            <a>Register Now</a>
          </Link>
        </p>

        <p className="text-center">
          <Link href="/forgot-password">
            <a className="text-danger">Forgot password?</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
