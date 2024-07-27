import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme, Layout, App as AntdApp, Menu, Divider } from 'antd'
import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import darkLogo from '/assets/logo-dark.png'
import lightLogo from '/assets/logo-light.png'
import darkBg from '/assets/img/bg-dark.webp'
import lightBg from '/assets/img/bg-light.webp'
import { useStore } from './store'

import locale from 'antd/locale/ar_EG'
import dayjs from 'dayjs'

import 'dayjs/locale/ar'
import useAxiosInterceptors from './hooks/useAxiosInterceptors'

const { Header } = Layout

function App() {
  useAxiosInterceptors()
  const { darkMode } = useStore()
  const { defaultAlgorithm, darkAlgorithm } = theme

  dayjs.locale('ar')

  return (
    <ConfigProvider
      direction={'rtl'}
      csp={{ nonce: 'YourNonceCode' }}
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorBgBase: darkMode ? 'rgb(15 23 42 / var(--tw-bg-opacity))' : '#fff'
        },
        components: {
          Button: {}
        }
      }}
      locale={locale}
    >
      <AntdApp>
        <Layout>
          <Header
            className="bg-white dark:bg-[#1a2748]"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div className="demo-logo">
              <img
                src={darkMode ? darkLogo : lightLogo}
                alt="logo"
                style={{
                  height: '70px',
                  marginRight: '16px'
                }}
              />
            </div>
            <Menu
              mode="horizontal"
              style={{
                flex: 1,
                minWidth: 0,
                margin: '0 30px'
              }}
            >
              <Menu.Item key="1">
                <NavLink to="/employees">Employees</NavLink>
              </Menu.Item>
              <Menu.Item key="2">
                <NavLink to="/customers">Customers</NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/products">Products</NavLink>
              </Menu.Item>
              <Menu.Item key="4">
                <NavLink to="/categories">Categories</NavLink>
              </Menu.Item>
              <Menu.Item key="5">
                <NavLink to="/orders">Orders</NavLink>
              </Menu.Item>
              <Menu.Item key="6">
                <NavLink to="/order-details">Order Details</NavLink>
              </Menu.Item>
            </Menu>
            <Divider type="vertical" className="bg-red-500" />
          </Header>
          <div
            className="bg-home min-h-screen p-5"
            style={{ backgroundImage: `url(${darkMode ? darkBg : lightBg})` }}
          >
            <Outlet />
          </div>
        </Layout>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
