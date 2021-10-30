import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar, Row, Col } from 'antd';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/user-courses');
        if (mounted) setCourses(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <Row className="jumbotron">
        <h1 className="text-center text-light">Courses Dashboard</h1>
      </Row>

      {/* Show course list */}
      {courses &&
        courses.map((course) => (
          <Row key={course._id} justify="space-around" align="middle">
            <Col>
              <Avatar
                size={80}
                shape="square"
                src={course.image ? course.image.Location : '/course.png'}
              />
            </Col>

            <Col md={16}>
              <Link href={`/user/course/${course.slug}`} className="pointer">
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
            </Col>
            <Col>
              <Link href={`/user/course/${course.slug}`}>
                <a>
                  <PlayCircleOutlined
                    style={{ fontSize: '50px' }}
                    className="h1 pointer text-primary"
                  />
                </a>
              </Link>
            </Col>
          </Row>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
