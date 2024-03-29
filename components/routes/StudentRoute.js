import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';

const StudentRoute = ({ children }) => {
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
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-secondary p-5"
        />
      ) : (
        <div className="container-fluid my-4">{children}</div>
      )}
    </>
  );
};

export default StudentRoute;
