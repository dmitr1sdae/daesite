import {EpicTitle} from "~/components/EpicTitle";
import {Metadata} from "next/types";
import {StarsBackground} from "~/components/StarsBackground";
import Image from "next/image";
import power from "@daesite/styles/assets/img/brand/power-looks-at-the-sky.webp";
import "./not-found.scss";
import {Header} from "~/components/Header";
import {Fullscreen} from "~/containers/Fullscreen";

export const metadata: Metadata = {
  title: "Page Not Found - dadaya",
};

const NotExists = () => {
  return (
    <>
      <Fullscreen className="overflow-hidden" background={StarsBackground}>
        <Header />
        <EpicTitle className="flex h-full">NOT EXISTS</EpicTitle>
        <Image
          className="power"
          src={power}
          alt="power looks at the sky 💜"
          priority={true}
        />
      </Fullscreen>
    </>
  );
};

export default NotExists;
