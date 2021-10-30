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

  // Restrict access to login page to logged in user
  useEffect(() => {
    if (user !== null) {
      router.push('/user');
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
      router.push('/user');
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="auth-hero">
      <div className="jumbotron glow text-center">
        <h1 className="text-light fw-bold">Welcome back !</h1>
        <p className="lead text-dark text-center">
          Let's learn how to learn <em className="text-light">anything.</em>
        </p>
      </div>
      <div className="container col-10 col-md-6 col-xl-4 pt-4 pb-5">
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
            className="btn col-12 btn-secondary glow text-light text-uppercase fw-bold"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Login'}
          </button>
        </form>

        <p className="text-center text-light lead pt-4">
          Not yet registered?{' '}
          <Link href="/register">
            <a>Register Now</a>
          </Link>
        </p>

        <p className="text-center text-light lead pb-4">
          <Link href="/forgot-password">
            <a>Forgot your password?</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
