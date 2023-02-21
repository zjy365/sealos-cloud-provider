import clsx from 'clsx';
import styles from './index.module.scss';

type TButton = {
  handleClick: (e?: any) => void;
  type?: 'base' | 'primary' | 'success' | 'danger' | 'lightBlue';
  size?: 'default' | 'medium' | 'small' | 'mini';
  shape?: 'round' | 'squareRound';
  icon?: string;
  children?: any;
  disabled?: boolean;
};

function Button(props: TButton) {
  const { handleClick, children, icon, disabled, type = 'base', shape, size = 'default' } = props;

  return (
    <div
      className={clsx(
        'cursor-pointer',
        styles.btn,
        styles[type],
        styles[size],
        shape && styles[shape],
        disabled && 'cursor-no-drop'
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}

export default Button;
