import "./FullscreenBackground.scss";

export interface FullscreenBackgroundProps {
  src: string;
}

const FullscreenBackground = ({src}: FullscreenBackgroundProps) => {
  return (
    <div className="background">
      <img src={src} alt="" />
    </div>
  );
};

export default FullscreenBackground;
