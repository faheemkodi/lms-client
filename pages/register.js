import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from '../context';
import { useRouter } from 'next/router';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // State
  const { state } = useContext(Context);
  const { user } = state;

  // Router
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.push('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({ name, email, password });
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      // console.log('Registration response', data);
      toast.success('Registration successful! Please login.');
      setName('');
      setEmail('');
      setPassword('');
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="auth-hero">
      <div className="jumbotron glow text-center">
        <h1 className="text-light fw-bold">Hello, new learner!</h1>
        <p className="lead text-dark text-center">
          Join Kengram and transform your life by learning how to learn{' '}
          <em className="text-light">anything.</em>
        </p>
      </div>
      <div className="container col-10 col-md-6 col-xl-4 pt-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

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
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : 'Join The Tribe'}
          </button>
        </form>

        <p className="text-center text-light lead py-4">
          Already registered?{' '}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
