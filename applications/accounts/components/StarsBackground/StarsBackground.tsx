"use client";

import stars from "@daesite/styles/assets/video/fullscreen/stars.webm";
import "./StarsBackground.scss";

const StarsBackground = () => {
  return (
    <video className="stars-wrapper" autoPlay loop muted playsInline>
      <source src={stars} type="video/webm" />
    </video>
  );
};

export {StarsBackground};
