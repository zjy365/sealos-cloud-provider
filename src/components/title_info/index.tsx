import clsx from 'clsx';
import styles from './index.module.scss';

type TitleInfo = {
  info: string;
};

export default function TitleInfo(props: TitleInfo) {
  const { info } = props;

  return (
    <div className={clsx('flex items-center')}>
      <div className={styles.left}></div>
      <div className={styles.right}>{info}</div>
    </div>
  );
}
