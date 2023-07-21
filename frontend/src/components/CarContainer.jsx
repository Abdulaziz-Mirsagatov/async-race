import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWinner,
  drive,
  removeCar,
  selectCurrentWinner,
  selectIsRacing,
  setCurrentWinner,
  startEngine,
  stopEngine,
} from "../features/carsSlice";
import Car from "./Car";

const CarContainer = ({ car, selectCar, carsReady }) => {
  const currentWinner = useSelector((state) => selectCurrentWinner(state));
  const isRacing = useSelector((state) => selectIsRacing(state));

  const dispatch = useDispatch();

  return (
    <>
      <div className="car-container grid">
        <div className="controls flex">
          <button className="select-btn" onClick={() => selectCar(car)}>
            Select
          </button>
          <button
            className="remove-btn"
            onClick={() => dispatch(removeCar({ id: car.id }))}
          >
            Remove
          </button>
          <p className="model-name">{car.name}</p>
        </div>

        <div className="racetrack flex">
          <button
            className="start-btn"
            onClick={() => {
              dispatch(startEngine({ id: car.id }));
              dispatch(drive({ id: car.id }));
            }}
            disabled={car.status !== "stopped"}
          >
            Start
          </button>
          <button
            className="stop-btn"
            disabled={car.status === "stopped"}
            onClick={() => dispatch(stopEngine({ id: car.id }))}
          >
            Stop
          </button>
          <Car
            style={{
              fill: car.color,
              animationName:
                (!isRacing && car.status !== "stopped") ||
                (isRacing && carsReady)
                  ? "car-animation"
                  : "unset",
              animationDuration: `${car.animationDuration}s`,
              animationPlayState:
                car.status === "broken" ? "paused" : "running",
            }}
            onAnimationEnd={() => {
              if (isRacing && currentWinner === null) {
                dispatch(setCurrentWinner(car));
                dispatch(addWinner(car));
              }
            }}
          />
          <i className="fa fa-flag" style={{ color: "red" }}></i>
        </div>
      </div>
    </>
  );
};

export default CarContainer;
