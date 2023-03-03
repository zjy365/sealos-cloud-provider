import useSessionStore from '@/stores/session';
import { Flex, Spinner } from '@chakra-ui/react';
import { Nunito } from '@next/font/google';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { createSealosApp, sealosApp } from 'sealos-desktop-sdk';
import styles from './index.module.scss';
const nunito = Nunito({ subsets: ['latin'] });

export default function Layout({ children }: any) {
  const { setSession } = useSessionStore();
  const [isLodaing, setIsLoading] = useState(true);
  useEffect(() => {
    return createSealosApp({
      appKey: 'sealos-cloud-provider'
    });
  }, []);

  useEffect(() => {
    const initApp = async () => {
      try {
        const result = await sealosApp.getUserInfo();
        setSession(result);
      } catch (error) {}
      setIsLoading(false);
    };
    initApp();
  }, [isLodaing, setSession]);

  return (
    <>
      <div className={clsx(styles.desktopContainer, nunito.className)}>
        {isLodaing ? (
          <Flex w={'100%'} h={'100%'} alignItems={'center'} justifyContent={'center'}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="primaryblue.600"
              size="xl"
            />
          </Flex>
        ) : (
          <main className={clsx(styles.backgroundWrap)}>{children}</main>
        )}
      </div>
    </>
  );
}
