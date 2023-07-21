import React from "react";

const WinnerMessage = ({ winner }) => {
  return (
    <h1 className="winner-text">
      {winner.name} came first! ({winner.animationDuration}s)
    </h1>
  );
};

export default WinnerMessage;
