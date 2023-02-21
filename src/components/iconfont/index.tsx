type TIconfont = {
  iconName: string;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
};

function Iconfont(props: TIconfont) {
  const { iconName, color, width, height, className = '' } = props;
  const style = {
    fill: color,
    width,
    height
  };

  return (
    <svg className={`icon ${className}`} aria-hidden="true" style={style}>
      <use xlinkHref={`#${iconName}`}></use>
    </svg>
  );
}

export default Iconfont;
