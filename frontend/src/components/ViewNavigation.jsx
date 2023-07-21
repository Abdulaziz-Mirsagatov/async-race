import React from "react";
import { useDispatch } from "react-redux";
import { goToGarage, goToWinners } from "../features/viewsSlice";

const ViewNavigation = () => {
  const dispatch = useDispatch();

  return (
    <div className="view-navigation flex">
      <button className="to-garage-btn" onClick={() => dispatch(goToGarage())}>
        To Garage
      </button>
      <button
        className="to-winners-btn"
        onClick={() => dispatch(goToWinners())}
      >
        To Winners
      </button>
    </div>
  );
};

export default ViewNavigation;
