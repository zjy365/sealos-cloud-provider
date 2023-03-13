import useSessionStore from '@/stores/session';
import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { Nunito } from '@next/font/google';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { createSealosApp, sealosApp } from 'sealos-desktop-sdk/app';
import styles from './index.module.scss';
const nunito = Nunito({ subsets: ['latin'] });

export default function Layout({ children }: any) {
  const { setSession, getSession } = useSessionStore();
  const [isLodaing, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    return createSealosApp();
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const result = await sealosApp.getUserInfo();
        setSession(result);
        setIsLoading(false);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          setIsLoading(false);
        }
        setIsError(true);
      }
    };
    initApp();
  }, [isLodaing, setSession]);

  return (
    <>
      <div className={clsx(styles.desktopContainer, nunito.className)}>
        {isLodaing ? (
          <Flex w={'100%'} h={'100%'} alignItems={'center'} justifyContent={'center'}>
            {isError ? (
              <Text>
                please go to&nbsp;
                <Link color="primaryblue.600" href="https://cloud.sealos.io/">
                  cloud.sealos.io
                </Link>
              </Text>
            ) : (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="primaryblue.600"
                size="xl"
              />
            )}
          </Flex>
        ) : (
          <main className={clsx(styles.backgroundWrap)}>{children}</main>
        )}
      </div>
    </>
  );
}
