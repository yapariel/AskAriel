import React from "react";
import Typist from "react-typist";

const TypingEffect = () => {
  return (
    <Typist avgTypingDelay={10} stdTypingDelay={0} cursor={{ show: false }}>
      <Typist.Backspace count={7} delay={500} />
    </Typist>
  );
};

export default TypingEffect;
