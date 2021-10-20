import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar } from 'antd';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user-courses');
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <h1 className="jumbotron p-5 mb-4 text-center text-light">
        User Dashboard
      </h1>
      {/* Show course list */}
      {courses &&
        courses.map((course) => (
          <div key={course._id} className="row media pt-2 pb-1">
            <div className="col-1">
              <Avatar
                size={80}
                shape="square"
                src={course.image ? course.image.Location : '/course.png'}
              />
            </div>

            <div className="col media-body pl-2">
              <div className="row">
                <div className="col">
                  <Link
                    href={`/user/course/${course.slug}`}
                    className="pointer"
                  >
                    <a>
                      <h5 className="mt-2 text-primary">{course.name}</h5>
                    </a>
                  </Link>
                  <p style={{ marginTop: '-10px' }}>
                    {course.lessons.length} Lessons
                  </p>
                  <p
                    className="text-muted"
                    style={{ marginTop: '-15px', fontSize: '12px' }}
                  >
                    By {course.instructor.name}
                  </p>
                </div>
                <div className="col-md-3 mt-3 text-center">
                  <Link href={`/user/course/${course.slug}`}>
                    <a>
                      <PlayCircleOutlined className="h2 pointer text-primary" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
