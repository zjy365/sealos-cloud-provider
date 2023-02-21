import { Nunito } from '@next/font/google';
import clsx from 'clsx';
import styles from './index.module.scss';
const nunito = Nunito({ subsets: ['latin'] });

export default function Layout({ children }: any) {
  return (
    <>
      <div className={clsx(styles.desktopContainer, nunito.className)}>
        <main className={clsx(styles.backgroundWrap)}>{children}</main>
      </div>
    </>
  );
}
