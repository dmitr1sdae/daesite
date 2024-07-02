import Image, {StaticImageData} from "next/image";
import "./FullscreenBackground.scss";

interface FullscreenBackgroundProps {
  src: StaticImageData;
}

const FullscreenBackground = ({src}: FullscreenBackgroundProps) => {
  return (
    <div className="background">
      <Image src={src} alt="" />
    </div>
  );
};

export default FullscreenBackground;
