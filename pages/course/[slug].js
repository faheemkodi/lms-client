import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context/index';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const SingleCourse = ({ course }) => {
  // State
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  // Context
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) {
      checkEnrolment();
    }
  }, [user, course]);

  const checkEnrolment = async () => {
    const { data } = await axios.get(`/api/check-enrolment/${course._id}`);
    console.log(('Check enrolment', data));
    setEnrolled(data);
  };

  const router = useRouter();
  const { slug } = router.query;

  const handlePaidEnrolment = async () => {
    try {
      setLoading(true);
      // Check if user is logged in
      if (!user) {
        router.push('/login');
      }
      // Check if user is already enrolled
      if (enrolled.status) {
        return router.push(`/user/course/${enrolled.course.slug}`);
      }
      const { data } = await axios.post(`/api/paid-enrolment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      toast('Enrolment failed. Please try again.');
      console.log(err);
      setLoading(false);
    }
  };

  const handleFreeEnrolment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Check if user is logged in
      if (!user) {
        router.push('/login');
      }
      // Check if user is already enrolled
      if (enrolled.status) {
        return router.push(`/user/course/${enrolled.course.slug}`);
      }
      const { data } = await axios.post(`/api/free-enrolment/${course._id}`);
      toast(data.message);
      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      toast('Enrolment failed. Please try again');
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrolment={handlePaidEnrolment}
        handleFreeEnrolment={handleFreeEnrolment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

export default SingleCourse;
