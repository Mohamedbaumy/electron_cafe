import { Outlet } from 'react-router-dom'
import { ConfigProvider, theme, Layout, App as AntdApp, FloatButton } from 'antd'
import { useStore } from './store'
import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons'

import locale from 'antd/locale/ar_EG'
import dayjs from 'dayjs'

import 'dayjs/locale/ar'
import useAxiosInterceptors from './hooks/useAxiosInterceptors'

const { Content } = Layout

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
        <Content className="h-screen min-h-screen max-h-screen bg-[#0F172A]">
          <Outlet />
        </Content>
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{
            right: 24
          }}
          icon={<CustomerServiceOutlined />}
        >
          <FloatButton />
          <FloatButton icon={<CommentOutlined />} />
        </FloatButton.Group>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
