import clsx from 'clsx';
import styles from './index.module.scss';

type TitleInfo = {
  content: string;
  size?: 'lg' | 'md';
};

export default function TitleInfo(props: TitleInfo) {
  const { content, size = 'md' } = props;

  return (
    <div className={clsx(styles.base, 'flex items-center')} data-size={size}>
      <div className={styles.left}></div>
      <div className={styles.right}>{content}</div>
    </div>
  );
}
