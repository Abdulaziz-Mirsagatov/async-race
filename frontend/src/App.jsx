import Garage from "./components/views/Garage";
import Winners from "./components/views/Winners";
import { useDispatch, useSelector } from "react-redux";
import { selectView } from "./features/viewsSlice";
import "./styles/css/index.css";
import { useEffect, useState } from "react";
import { getCars } from "./features/carsSlice";

function App() {
  const [newCar, setNewCar] = useState({ name: "", color: "#ffffff" });
  const [selectedCar, setSelectedCar] = useState({
    id: null,
    name: "",
    color: "#ffffff",
  });

  const view = useSelector((state) => selectView(state));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCars());
  }, []);

  return (
    <div className="wrapper grid">
      {view === "garage" ? (
        <Garage
          newCar={newCar}
          setNewCar={(newCar) => setNewCar(newCar)}
          selectedCar={selectedCar}
          setSelectedCar={(selectedCar) => setSelectedCar(selectedCar)}
        />
      ) : (
        <Winners />
      )}
    </div>
  );
}

export default App;
