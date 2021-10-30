import { useState, useEffect } from 'react';
import Link from 'next/link';

const InstructorNav = () => {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="d-flex flex-md-column nav nav-pills mx-2 mt-3 justify-content-center text-uppercase text-center fw-bold">
      <Link href="/instructor">
        <a className={`nav-link ${current === '/instructor' && 'active'}`}>
          Dashboard
        </a>
      </Link>
      <Link href="/instructor/course/create">
        <a
          className={`nav-link ${
            current === '/instructor/course/create' && 'active'
          }`}
        >
          Create Course
        </a>
      </Link>
      <Link href="/instructor/revenue">
        <a
          className={`nav-link ${
            current === '/instructor/revenue' && 'active'
          }`}
        >
          Revenue
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
