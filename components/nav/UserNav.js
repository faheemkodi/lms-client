import { useState, useEffect } from 'react';
import Link from 'next/link';

const UserNav = () => {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="d-flex flex-row flex-md-col nav nav-pills py-3 justify-content-between text-uppercase fw-bold">
      <Link href="/user">
        <a className={`nav-link ${current === '/user' && 'active'}`}>
          Dashboard
        </a>
      </Link>
      <Link href="/user/become-instructor">
        <a
          className={`nav-link ${
            current === '/user/become-instructor' && 'active'
          }`}
        >
          Teach & Earn
        </a>
      </Link>
    </div>
  );
};

export default UserNav;
