import { useState, useEffect, createElement } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { Button, Menu, Avatar } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from '@ant-design/icons';

const { Item } = Menu;

const SingleCourse = () => {
  // State
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  // Force lesson complete state in UI
  const [updateState, setUpdateState] = useState(false);

  // Router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) {
      loadCompletedLessons();
    }
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    console.log('Completed Lesson =>', data);
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncomplete = async () => {
    try {
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      console.log(data);
      const all = completedLessons;
      console.log('ALL =>', all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index > -1) {
        all.splice(index, 1);
        console.log('ALL w/o INCOMPLETE =>', all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 btn mb-2"
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && 'Lessons'}
          </Button>
          <Menu
            mode="inline"
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: '80vh', overflow: 'scroll' }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                key={index}
                onClick={() => setClicked(index)}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 30)}{' '}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className="float-end text-primary ml-2"
                    style={{ marginTop: '13px' }}
                  />
                ) : (
                  <MinusCircleFilled
                    className="float-end text-danger ml-2"
                    style={{ marginTop: '13px' }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span className="float-end pointer" onClick={markIncomplete}>
                    Mark As Incomplete
                  </span>
                ) : (
                  <span className="float-end pointer" onClick={markCompleted}>
                    Mark As Completed
                  </span>
                )}
              </div>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        config={{
                          file: { attributes: { controlsList: 'nodownload' } },
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                        onEnded={() => markCompleted()}
                      />
                    </div>
                  </>
                )}
              <ReactMarkdown
                children={course.lessons[clicked].content}
                className="single-post"
              />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on a lesson to start learning!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
