import {flushSync} from "react-dom";

const dispatchDiscreteCustomEvent = <E extends CustomEvent>(
  target: E["target"],
  event: E,
) => {
  if (target) {
    flushSync(() => target.dispatchEvent(event));
  }
};

export default dispatchDiscreteCustomEvent;
