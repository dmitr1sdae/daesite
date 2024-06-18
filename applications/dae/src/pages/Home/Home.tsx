import "./Home.scss";
import {Header} from "@components";
import {Fullscreen} from "@containers";
import {typeStringSequence} from "@helpers";
import background from "@daesite/styles/assets/img/brand/background.png";
import power from "@daesite/styles/assets/img/brand/power.webp";
import {LoaderFunctionArgs, useLoaderData} from "react-router-dom";
import Typewriter from "typewriter-effect";
import axios from "axios";
import {Tag} from "@helpers/typeStringSequence";

export const HomeLoader = async ({request}: LoaderFunctionArgs) => {
  return (
    await axios.get<{tags: Tag[]}>("http://127.0.0.1:3000/tags", {
      signal: request.signal,
    })
  ).data;
};

const Home = () => {
  const {tags} = useLoaderData() as Awaited<ReturnType<typeof HomeLoader>>;

  return (
    <>
      <Fullscreen background={background}>
        <Header />
        <div className="text">
          <h1 className="title">Dadaya&apos;s Blog</h1>
          <h2 className="subtitle">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
              }}
              onInit={(typewriter) => {
                typeStringSequence(typewriter, tags);
              }}
            />
          </h2>
        </div>
        <img className="power" src={power} alt="power 💜" />
      </Fullscreen>
    </>
  );
};

export default Home;
