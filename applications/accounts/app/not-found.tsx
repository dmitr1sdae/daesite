import {Metadata} from "next/types";
import Image from "next/image";
import power from "@daesite/styles/assets/img/brand/power-looks-at-the-sky.webp";
import {StarsBackground} from "~/components/StarsBackground";
import {Header} from "~/components/Header";
import {Fullscreen} from "~/containers/Fullscreen";
import {AppLink} from "@daesite/components";
import "./not-found.scss";

export const metadata: Metadata = {
  title: "404 - Lost Among the Stars",
};

const NotExists = () => {
  return (
    <Fullscreen className="overflow-hidden" background={StarsBackground}>
      <Header />
      <main className="content">
        <section className="flex flex-column gap-6">
          <h1 className="text-4xl text-black text-uppercase">
            Oops, you're lost among the stars!
          </h1>
          <div>
            <h3 className="text-xl text-semibold">
              The page you seek has vanished like a falling star.
            </h3>
            <h3 className="text-xl text-semibold">
              Return to the <AppLink to="/">homepage</AppLink> or use the{" "}
              <AppLink to="/search">search</AppLink> to find your way.
            </h3>
          </div>
        </section>
      </main>
      <Image
        className="power"
        src={power}
        alt="power looks at the sky 💜"
        priority
      />
    </Fullscreen>
  );
};

export default NotExists;
