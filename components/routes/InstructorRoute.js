import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import InstructorNav from '../nav/InstructorNav';

const InstructorRoute = ({ children }) => {
  // State
  const [ok, setOk] = useState(false);

  // Router
  const router = useRouter();

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get('/api/current-instructor');
      //   console.log('Instructor Route =>', data);
      if (data.ok) {
        setOk(true);
      }
    } catch (err) {
      console.log(err);
      setOk(false);
      router.push('/');
    }
  };

  useEffect(() => {
    fetchInstructor();
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
          <div className="col-md-3">
            <InstructorNav />
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      )}
    </div>
  );
};

export default InstructorRoute;
