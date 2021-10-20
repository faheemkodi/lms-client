import { Badge, Modal, Button } from 'antd';
import { currencyFormatter } from '../../utils/helpers';
import ReactPlayer from 'react-player';
import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  user,
  handlePaidEnrolment,
  handleFreeEnrolment,
  enrolled,
  setEnrolled,
}) => {
  // Destructure
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <div className="jumbotron p-5 mb-4 text-light">
      <div className="row">
        <div className="col-md-8">
          {/* title */}
          <h1 className="text-light font-weight-bold">{name}</h1>
          {/* description */}
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          {/* category */}
          <Badge
            count={category}
            style={{ backgroundColor: '#CC9100' }}
            className="pb-4 mr-2"
          />
          {/* author */}
          <p>Created by {instructor.name}</p>
          {/* course version */}
          <p>Last updated at {new Date(updatedAt).toLocaleDateString()}</p>
          {/* price */}
          <h4 className="text-light">
            {paid
              ? currencyFormatter({
                  amount: price,
                  currency: 'inr',
                })
              : 'Free'}
          </h4>
        </div>
        <div className="col-md-4">
          {/* Video Preview or Image Preview */}
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              className="react-player-div"
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                config={{
                  file: { attributes: { controlsList: 'nodownload' } },
                }}
                onContextMenu={(e) => e.preventDefault()}
                className="react-player-div"
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          {/* Enroll CTA */}
          {loading ? (
            <div className="d-flex justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3"
              type="danger"
              block
              shape="round"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={paid ? handlePaidEnrolment : handleFreeEnrolment}
            >
              {user
                ? enrolled.status
                  ? 'Go To Course'
                  : 'Enrol Now'
                : 'Login To Enrol'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
