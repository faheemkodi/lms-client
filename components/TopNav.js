import { useState, useEffect, useContext } from 'react';
import { Row, Col, Menu } from 'antd';
import Link from 'next/link';
import {
  MenuOutlined,
  ReadOutlined,
  VideoCameraAddOutlined,
  UserAddOutlined,
  CrownOutlined,
  DollarOutlined,
  CrownFilled,
} from '@ant-design/icons';
import { Context } from '../context';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState('');

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/login');
  };

  return (
    <Row justify="space-between" className="ps-3 px-md-5 py-3 bg-dark">
      {/* Logo */}
      <Col xs={4} md={6}>
        <Link href="/">
          <a>
            <img src="/images/logo.svg" alt="logo" className="logo" />
            <img src="/images/brandmark.svg" alt="logo" className="brandmark" />
          </a>
        </Link>
      </Col>
      {/* AntD Menu */}
      <Col xs={4} md={18}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          overflowedIndicator={
            <MenuOutlined
              style={{
                fontSize: '30px',
                color: '#efb000',
              }}
            />
          }
          className="justify-content-end"
        >
          <Item key="/philosophy" onClick={(e) => setCurrent(e.key)}>
            <Link href="/philosophy">
              <a className="text-uppercase fw-bold">Philosophy</a>
            </Link>
          </Item>

          <Item key="/about" onClick={(e) => setCurrent(e.key)}>
            <Link href="/about">
              <a className="text-uppercase fw-bold">About</a>
            </Link>
          </Item>

          <Item key="/contact" onClick={(e) => setCurrent(e.key)}>
            <Link href="/contact">
              <a className="text-uppercase fw-bold">Contact</a>
            </Link>
          </Item>

          {user === null && (
            <>
              <Item
                key="/login"
                onClick={(e) => setCurrent(e.key)}
                icon={<CrownOutlined style={{ fontSize: '20px' }} />}
              >
                <Link href="/login">
                  <a className="text-uppercase fw-bold">Login</a>
                </Link>
              </Item>

              <Item
                key="/register"
                onClick={(e) => setCurrent(e.key)}
                icon={<UserAddOutlined style={{ fontSize: '20px' }} />}
              >
                <Link href="/register">
                  <a className="text-uppercase fw-bold">Register</a>
                </Link>
              </Item>
            </>
          )}

          {user !== null && (
            <SubMenu
              key="/submenu"
              title={user && user.name}
              icon={
                <CrownFilled style={{ fontSize: '20px', color: '#cc9100' }} />
              }
              className="text-uppercase fw-bold float-end"
            >
              <ItemGroup>
                <Item
                  key="/user"
                  onClick={(e) => setCurrent(e.key)}
                  icon={<ReadOutlined style={{ fontSize: '20px' }} />}
                  className=""
                >
                  <Link href="/user">
                    <a className="text-uppercase fw-bold">Dashboard</a>
                  </Link>
                </Item>
                {user && user.role && user.role.includes('Instructor') ? (
                  <Item
                    key="/instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={
                      <VideoCameraAddOutlined style={{ fontSize: '20px' }} />
                    }
                  >
                    <Link href="/instructor">
                      <a className="text-uppercase fw-bold">Instructor</a>
                    </Link>
                  </Item>
                ) : (
                  <Item
                    key="/user/become-instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<DollarOutlined style={{ fontSize: '20px' }} />}
                  >
                    <Link href="/user/become-instructor">
                      <a className="text-uppercase fw-bold">Teach & Earn</a>
                    </Link>
                  </Item>
                )}
                <Item
                  key="/logout"
                  onClick={logout}
                  icon={
                    <CrownOutlined
                      style={{ fontSize: '20px', color: '#cc9100' }}
                    />
                  }
                  className="text-uppercase fw-bold ms-auto"
                >
                  Logout
                </Item>
              </ItemGroup>
            </SubMenu>
          )}
        </Menu>
      </Col>
    </Row>
  );
};

export default TopNav;
