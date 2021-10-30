import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal, List, Row, Col } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
  QuestionOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';

const { Item } = List;

const CourseView = () => {
  const [course, setCourse] = useState({});

  // State for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  // State for student count
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    console.log('STUDENT COUNT =>', data.length);
    setStudents(data.length);
  };

  // Functions for AddLessonForm
  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log(values);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      // console.log(data);
      setValues({ ...values, title: '', content: '', video: {} });
      setProgress(0);
      setUploadButtonText('Upload Video');
      setVisible(false);
      setCourse(data);
      toast('Lesson added.');
    } catch (err) {
      console.log(err);
      toast('Lesson add failed.');
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);

      // Save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      // Once response received
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video upload failed');
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText('Upload another video');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video removal failed');
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Are you sure you want to put your course out live?'
      );
      if (!answer) {
        return;
      }
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast('Congratulations! Your course is now live.');
    } catch (err) {
      toast('Course publish failed. Please try again.');
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'This will temporarily take down your course. Are you sure?'
      );
      if (!answer) {
        return;
      }
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast('Your course is unpublished and no longer live.');
    } catch (err) {
      toast('Course unpublish failed. Please try again.');
    }
  };

  return (
    <InstructorRoute>
      {course && (
        <div className="pt-3">
          <Row align="middle">
            <Col xs={6} md={4}>
              <Avatar
                size={60}
                shape="square"
                src={course.image ? course.image.Location : '/course.png'}
              />
            </Col>
            <Col xs={10} md={16}>
              <h5 className="mt-2 text-primary">{course.name}</h5>
              <p style={{ marginTop: '-10px' }}>
                {course.lessons && course.lessons.length} Lessons
              </p>
              <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                {course.category}
              </p>
            </Col>
            {/* Tooltips */}
            <Col xs={8} md={4}>
              <Tooltip title={`${students} Enrolled`}>
                <UserSwitchOutlined className="h5 pointer text-info mx-1" />
              </Tooltip>

              <Tooltip title="Edit">
                <EditOutlined
                  onClick={() => router.push(`/instructor/course/edit/${slug}`)}
                  className="h5 pointer text-warning mx-1"
                />
              </Tooltip>

              {course.lessons && course.lessons.length < 5 ? (
                <Tooltip title="Minimum 5 lessons required.">
                  <QuestionOutlined className="h5 pointer text-danger mx-1" />
                </Tooltip>
              ) : course.published ? (
                <Tooltip title="Unpublish">
                  <CloseOutlined
                    onClick={(e) => handleUnpublish(e, course._id)}
                    className="h5 pointer text-danger mx-1"
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Publish">
                  <CheckOutlined
                    onClick={(e) => handlePublish(e, course._id)}
                    className="h5 pointer text-success mx-1"
                  />
                </Tooltip>
              )}
            </Col>
          </Row>
          <Row className="my-5">
            <ReactMarkdown children={course.description} />
          </Row>
          <Row className="mb-5">
            <Button
              onClick={() => setVisible(true)}
              className="text-center"
              type="primary"
              shape="round"
              icon={<UploadOutlined />}
              size="large"
              block
            >
              Add Lesson
            </Button>
          </Row>
          <br />
          <Modal
            title="+ Add Lesson"
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <AddLessonForm
              values={values}
              setValues={setValues}
              handleAddLesson={handleAddLesson}
              uploading={uploading}
              uploadButtonText={uploadButtonText}
              handleVideo={handleVideo}
              progress={progress}
              handleVideoRemove={handleVideoRemove}
            />
          </Modal>

          <Row className="pb-5">
            <div className="col lesson-list">
              <h4>
                {course && course.lessons && course.lessons.length} Lessons
              </h4>
              <List
                itemLayout="horizontal"
                dataSource={course && course.lessons}
                renderItem={(item, index) => (
                  <Item key={index}>
                    <Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                    ></Item.Meta>
                  </Item>
                )}
              ></List>
            </div>
          </Row>
        </div>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
