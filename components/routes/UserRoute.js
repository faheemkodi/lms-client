import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import UserNav from '../nav/UserNav';

const UserRoute = ({ children, showNav = true }) => {
  // State
  const [ok, setOk] = useState(false);

  // Router
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/current-user');
      // console.log(data);
      if (data.ok) {
        setOk(true);
      }
    } catch (err) {
      console.log(err);
      setOk(false);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="container-fluid mt-2">
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-secondary p-5"
        />
      ) : (
        <div className="row">
          <div className="col-md-3">{showNav && <UserNav />}</div>
          <div className="col-md-9">{children}</div>
        </div>
      )}
    </div>
  );
};

export default UserRoute;
