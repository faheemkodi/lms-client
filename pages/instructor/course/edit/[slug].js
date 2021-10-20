import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { List, Avatar, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const { Item } = List;

const CourseEdit = () => {
  // State
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '1999',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  // State for lesson update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) {
      setImage(data.image);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // Image resizer
    Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
      try {
        let { data } = await axios.post('/api/course/upload-image', {
          image: uri,
        });
        console.log('Image Uploaded', data);
        // Set image in state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast('Image upload failed. Please try again.');
      }
    });
  };

  const handleImageRemove = async () => {
    // console.log('Remove image');
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast('Image delete failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast('Course details updated.');
      //   router.push('/instructor');
    } catch (err) {
      toast(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    // console.log('ON DRAG', index);
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    // console.log('ON DROP', index);
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;

    let allLessons = values.lessons;

    // Clicked/dragged item, to be reordered
    let movingItem = allLessons[movingItemIndex];
    // Cut out the moving item from index
    allLessons.splice(movingItemIndex, 1);
    // Push item after target item index
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });

    // Save new lessons order in the database
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    console.log('Lessons rearranged response ==>', data);
    toast('Lessons have been successfully rearranged.');
  };

  const handleDelete = async (index) => {
    const answer = window.confirm('Sure you want to delete that lesson?');
    if (!answer) {
      return;
    }
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });
    // Send delete request to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    console.log('Lesson Deleted =>', data);
  };

  // Lesson update functions
  const handleVideo = async (e) => {
    // Remove previous video
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
      console.log('REMOVED==>', res);
    }
    // Add new video
    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);
    // Send video as form data
    const videoData = new FormData();
    videoData.append('video', file);
    videoData.append('courseId', values._id);
    // Save progress bar and send video FormData to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadVideoButtonText('Upload Video');
    setVisible(false);

    // Update UI after API call
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast('Lesson updated.');
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center text-light p-5 mb-4">
        Update Course
      </h1>
      {/* {JSON.stringify(values)} */}
      <div className="py-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          handleImageRemove={handleImageRemove}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                key={index}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-end"
                />
              </Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title="Update Lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
        {/* <pre>{JSON.stringify(current, null, 4)}</pre> */}
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
