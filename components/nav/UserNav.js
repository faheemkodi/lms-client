import { useState, useEffect } from 'react';
import Link from 'next/link';

const UserNav = () => {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="d-flex flex-md-column nav nav-pills mx-2 mt-3 justify-content-between text-uppercase text-center fw-bold">
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
