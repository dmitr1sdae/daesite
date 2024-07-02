import "./Home.scss";
import {Fullscreen} from "@containers/Fullscreen";
import {PageLayout} from "@containers/PageLayout";
import background from "@daesite/styles/assets/img/brand/background.png";
import power from "@daesite/styles/assets/img/brand/power.webp";
import {Typewriter} from "@components/Typewriter";
import axios from "axios";
import {Tag} from "helpers/typeStringSequence";
import Image from "next/image";

const getTags = async () => {
  try {
    const res = await axios.get<{tags: Tag[]}>("http://127.0.0.1:3000/tags");
    return res.data.tags as Tag[];
  } catch (error) {
    throw error;
  }
};

const Home = async () => {
  const tags = await getTags();

  return (
    <PageLayout>
      <Fullscreen background={background}>
        <div className="text">
          <h1 className="title">Dadaya&apos;s Blog</h1>
          <h2 className="subtitle">
            <Typewriter
              tags={tags}
            />
          </h2>
        </div>
        <Image className="power" src={power} alt="power 💜" />
      </Fullscreen>
      <Fullscreen />
      <Fullscreen />
    </PageLayout>
  );
};

export default Home;
