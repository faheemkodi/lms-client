import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../components/routes/InstructorRoute';
import { Avatar, Tooltip, Row, Col } from 'antd';
import Link from 'next/link';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadCourses = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/instructor-courses');
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
    <InstructorRoute>
      {loading && (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-danger p-5"
        />
      )}
      <Row className="jumbotron">
        <h1 className="text-center text-light">Instructor Dashboard</h1>
      </Row>

      {/* Show instructor's course list */}

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
              <Link
                href={`/instructor/course/view/${course.slug}`}
                className="pointer"
              >
                <a className="mt-2">
                  <h5 className="pt-2">{course.name}</h5>
                </a>
              </Link>
              <p style={{ marginTop: '-10px' }}>
                {course.lessons.length} Lessons
              </p>

              {course.lessons.length < 5 ? (
                <p className="text-warning small">
                  Create at least 5 lessons to publish.
                </p>
              ) : course.published ? (
                <p className="text-success small">
                  Your course is live on Kengram.
                </p>
              ) : (
                <p className="text-success small">
                  Your course is ready to be published.
                </p>
              )}
            </Col>
            <Col>
              {course.published ? (
                <Tooltip title="Published">
                  <CheckCircleOutlined
                    style={{ fontSize: '25px' }}
                    className="h1 pointer text-success"
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Unpublished">
                  <CloseCircleOutlined
                    style={{ fontSize: '25px' }}
                    className="h1 pointer text-danger"
                  />
                </Tooltip>
              )}
            </Col>
          </Row>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
