import { useState, useEffect, useContext } from 'react';
import { Context } from '../../context';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import {
  DollarOutlined,
  SettingOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { stripeCurrencyFormatter } from '../../utils/helpers';

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get('/api/instructor/balance');
    setBalance(data);
  };

  // const handlePayoutSettings = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.get('/api/instructor/payout-settings');
  //     window.location.href = data;
  //   } catch (err) {
  //     setLoading(false);
  //     console.log(err);
  //     alert('Unable to access payout settings. Try later.');
  //   }
  // };

  return (
    <InstructorRoute>
      <div className="container">
        <div className="row pt-2">
          <div className="col-md-8 offset-md-2 bg-light p-5">
            <h2>
              Revenue Report <DollarOutlined className="float-end" />
            </h2>
            <small>You get payouts via Stripe every week.</small>
            <hr />
            <h4>
              Pending Balance{' '}
              {balance.pending &&
                balance.pending.map((bp, i) => (
                  <span key={i} className="float-end">
                    {stripeCurrencyFormatter(bp)}
                  </span>
                ))}
            </h4>
            <small>This week's payout</small>
            <hr />
            {/* {JSON.stringify(balance, null, 4)} */}
            {/* <h4>
              Payouts
              {!loading ? (
                <SettingOutlined
                  className="float-end pointer"
                  onClick={handlePayoutSettings}
                />
              ) : (
                <SyncOutlined spin className="float-end pointer" />
              )}
            </h4> */}
            <small>Stripe login link below:</small>
          </div>
        </div>
      </div>
    </InstructorRoute>
  );
};

export default InstructorRevenue;
