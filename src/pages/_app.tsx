import Layout from '@/layout';
import { StyleProvider } from '@ant-design/cssinjs';
import { Checkbox, ConfigProvider, Radio } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import '../styles/globals.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 0
    }
  }
});

const Theme = {
  token: {
    borderRadius: 4,
    colorPrimaryHover: '#0d55da'
  }
};

const componentTheme = {
  components: {
    Button: {
      colorPrimary: '#0D55DA',
      colorPrimaryHover: '#0A44AE',
      colorPrimaryActive: '#083383',
      colorPrimaryBorder: '#0D55DA'
    }
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StyleProvider hashPriority="high">
        <ConfigProvider theme={{ ...componentTheme, ...Theme }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConfigProvider>
      </StyleProvider>
    </QueryClientProvider>
  );
}
