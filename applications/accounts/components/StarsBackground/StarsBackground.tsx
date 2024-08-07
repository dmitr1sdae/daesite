"use client";

import stars from "@daesite/styles/assets/video/fullscreen/stars.webm";
import "./StarsBackground.scss";

const StarsBackground = () => {
  return (
    <div className="stars-wrapper">
      <video autoPlay loop muted playsInline>
        <source src={stars} type="video/webm" />
      </video>
    </div>
  );
};

export {StarsBackground};
