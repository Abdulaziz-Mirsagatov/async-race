import React from "react";
import ViewNavigation from "../ViewNavigation";
import { useDispatch, useSelector } from "react-redux";
import {
  drive,
  postCars,
  selectCars,
  selectCurrentWinner,
  setCurrentWinner,
  setIsRacing,
  startEngine,
  stopEngine,
  updateCar,
} from "../../features/carsSlice";
import {
  nextGaragePage,
  prevGaragePage,
  selectGaragePageNum,
} from "../../features/pagesSlice";
import WinnerMessage from "../WinnerMessage";
import CarContainer from "../CarContainer";

const Garage = ({ newCar, setNewCar, selectedCar, setSelectedCar }) => {
  const garagePageNum = useSelector((state) => selectGaragePageNum(state));
  const cars = useSelector((state) => selectCars(state));
  const currentWinner = useSelector((state) => selectCurrentWinner(state));

  const dispatch = useDispatch();

  // Filter out 7 cars for the current page
  const currentPageCars = cars.slice(
    7 * (garagePageNum - 1),
    7 * (garagePageNum - 1) + 7
  );

  // Click handler for 'generate cars' button
  const generateRandomCars = () => {
    for (let i = 0; i < 100; i++) {
      const cars = [
        "Toyota Camry",
        "Honda Accord",
        "Mazda 3",
        "BMW M7",
        "Mersedes EQS",
        "Hyundai Sonata",
        "Kia Optima",
        "Ford Mustang",
        "Lexus IS350",
        "Chevrolet Malibu",
      ];
      const randomCarName = cars[Math.floor(Math.random() * 10)];
      const randomCarColor = Math.floor(Math.random() * 16777215).toString(16);
      dispatch(postCars({ name: randomCarName, color: `#${randomCarColor}` }));
    }
  };

  // Race button handler
  const startRace = () => {
    for (let car of currentPageCars) {
      dispatch(startEngine({ id: car.id }));
      dispatch(drive({ id: car.id }));
    }
    dispatch(setIsRacing(true));
  };

  // Reset button handler
  const resetCars = () => {
    for (let car of currentPageCars) {
      dispatch(stopEngine({ id: car.id }));
    }
    dispatch(setCurrentWinner(null));
    dispatch(setIsRacing(false));
  };

  return (
    <>
      <ViewNavigation />

      {/* Output a message if there is a winner */}
      {currentWinner && <WinnerMessage winner={currentWinner} />}

      <form action="#" className="grid" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="new-car-name"
          id="newCarName"
          value={newCar.name}
          onChange={({ target }) =>
            setNewCar((car) => ({ ...car, name: target.value }))
          }
        />
        <input
          type="color"
          name="new-car-color"
          id="newCarColor"
          value={newCar.color}
          onChange={({ target }) =>
            setNewCar((car) => ({ ...car, color: target.value }))
          }
        />
        <button
          className="create-btn"
          onClick={() =>
            dispatch(postCars({ name: newCar.name, color: newCar.color }))
          }
        >
          Create
        </button>

        <input
          type="text"
          name="existing-car-name"
          id="existingCarName"
          value={selectedCar.name}
          onChange={({ target }) =>
            setSelectedCar((car) => ({ ...car, name: target.value }))
          }
        />
        <input
          type="color"
          name="existing-car-color"
          id="existingCarColor"
          value={selectedCar.color}
          onChange={({ target }) =>
            setSelectedCar((car) => ({ ...car, color: target.value }))
          }
        />
        <button
          className="update-btn"
          disabled={selectedCar.id === null}
          onClick={() =>
            dispatch(
              updateCar({
                id: selectedCar.id,
                name: selectedCar.name,
                color: selectedCar.color,
              })
            )
          }
        >
          Update
        </button>

        <button
          className="race-btn"
          onClick={startRace}
          disabled={currentPageCars.some((car) => car.status !== "stopped")}
        >
          Race
        </button>
        <button
          className="reset-btn"
          onClick={resetCars}
          disabled={currentPageCars.every((car) => car.status === "stopped")}
        >
          Reset
        </button>
        <button className="generate-cars-btn" onClick={generateRandomCars}>
          Generate Cars
        </button>
      </form>

      <section className="garage grid">
        <h1>Garage ({cars.length})</h1>
        <p>Page #{garagePageNum}</p>
        <div className="cars-container grid">
          {currentPageCars.map((car) => (
            <CarContainer
              key={car.id}
              car={car}
              selectCar={(car) => setSelectedCar(car)}
              carsReady={currentPageCars.every(
                (car) => car.status !== "stopped"
              )}
            />
          ))}
        </div>
      </section>

      <div className="pages-navigation flex">
        <button
          className="prev-btn"
          onClick={() => {
            dispatch(prevGaragePage());
            resetCars();
          }}
          disabled={garagePageNum === 1}
        >
          Prev
        </button>
        <button
          className="next-btn"
          onClick={() => {
            dispatch(nextGaragePage());
            resetCars();
          }}
          disabled={cars.length <= garagePageNum * 7}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Garage;
