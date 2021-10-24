import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';

const BecomeInstructor = () => {
  //State
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor = () => {
    // console.log('Become instructor');
    setLoading(true);
    axios
      .post('/api/make-instructor')
      .then((res) => {
        console.log(res);
        window.location.href = res.data;
      })
      .catch((err) => {
        console.log(err.response.status);
        toast.error('Stripe onboarding failed. Please try again.');
        setLoading(false);
      });
  };

  return (
    <UserRoute>
      <h1 className="jumbotron text-center text-light p-5 mb-4">
        Become Instructor
      </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <div className="pt-4">
              <UserSwitchOutlined className="display-1 pb-3" />
              <br />
              <h2>Setup payout to publish courses on Kengram</h2>
              <p className="lead text-warning">
                Kengram partners with Stripe to transfer funds to your bank
                account
              </p>
              <Button
                className="mb-3"
                type="primary"
                block
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructor}
                disabled={
                  (user && user.role && user.role.includes('Instructor')) ||
                  loading
                }
              >
                {loading ? 'Processing...' : 'Payout Setup'}
              </Button>
              <p className="lead">
                You will be redirected to Stripe to complete onboarding process
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default BecomeInstructor;
