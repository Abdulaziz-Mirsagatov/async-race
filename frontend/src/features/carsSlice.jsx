import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Car Structure
// car = {
//   id: 1,
//   name: "Tesla",
//   color: "white",
//   status: "stopped | started | drive | broken",
//   animationDuration: 0
// }

// Winner Structure
// winner = {
//   ...car,
//   wins: 10,
//   time: 2
// }

const initialState = {
  cars: [],
  winners: [],
  currentWinner: null,
  isRacing: false,
};

const GARAGE_URL = "http://localhost:3000/garage";
const ENGINE_URL = "http://localhost:3000/engine";
const WINNERS_URL = "http://localhost:3000/winners";

// Fetch cars from the API
export const getCars = createAsyncThunk("cars/getCars", async (thunkAPI) => {
  try {
    const res = await axios.get(GARAGE_URL);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue({ error: err.message });
  }
});

// Create and post car into the API
export const postCars = createAsyncThunk(
  "cars/postCars",
  async (car, thunkAPI) => {
    try {
      const res = await axios.post(GARAGE_URL, car);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Remove car
export const removeCar = createAsyncThunk(
  "cars/removeCar",
  async ({ id }, thunkAPI) => {
    try {
      await axios.delete(GARAGE_URL + `/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Update car
export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async ({ id, name, color }, thunkAPI) => {
    try {
      const res = await axios.put(GARAGE_URL + `/${id}`, { name, color });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Start Engine
export const startEngine = createAsyncThunk(
  "cars/startEngine",
  async ({ id }, thunkAPI) => {
    try {
      const res = await axios.patch(
        ENGINE_URL,
        {},
        {
          params: { id, status: "started" },
        }
      );
      return { ...res.data, id };
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Switch to Drive
export const drive = createAsyncThunk(
  "cars/drive",
  async ({ id }, thunkAPI) => {
    try {
      await axios.patch(
        ENGINE_URL,
        {},
        {
          params: { id, status: "drive" },
        }
      );
      return { id, status: "drive" };
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err.response.data);
        return { id, status: "broken" };
      } else return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Stop Engine
export const stopEngine = createAsyncThunk(
  "cars/stopEngine",
  async ({ id }, thunkAPI) => {
    try {
      await axios.patch(
        ENGINE_URL,
        {},
        {
          params: { id, status: "stopped" },
        }
      );
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Get Winners
export const getWinners = createAsyncThunk(
  "cars/getWinners",
  async ({ sortedBy, sortOrder }, thunkAPI) => {
    try {
      const res = await axios.get(
        WINNERS_URL,
        { params: { _sort: sortedBy, _order: sortOrder } }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

// Add winner
export const addWinner = createAsyncThunk(
  "cars/addWinner",
  async (car, thunkAPI) => {
    try {
      const res = await axios.get(WINNERS_URL + `/${car.id}`);
      const bestTime =
        car.animationDuration < res.data.time
          ? car.animationDuration
          : res.data.time;
      await axios.put(WINNERS_URL + `/${car.id}`, {
        wins: res.data.wins + 1,
        time: bestTime,
      });
      return { id: car.id, time: bestTime };
    } catch (err) {
      if (err.response.status === 404) {
        await axios.post(WINNERS_URL, {
          id: car.id,
          wins: 1,
          time: car.animationDuration,
        });
        return {
          ...car,
          wins: 1,
          time: car.animationDuration,
        };
      } else return thunkAPI.rejectWithValue({ error: err.message });
    }
  }
);

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCurrentWinner: (state, action) => {
      state.currentWinner = action.payload;
    },
    setIsRacing: (state, action) => {
      state.isRacing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCars.fulfilled, (state, action) => {
      // add status and animationDuration props to incoming list of objects
      const cars = action.payload.map((car) => {
        if ("status" in car && "animationDuration" in car) return car;
        return {
          ...car,
          status: "stopped",
          animationDuration: 0,
        };
      });
      state.cars = cars;
    });
    builder.addCase(postCars.fulfilled, (state, action) => {
      // add status and animationDuration props to the newly created car object
      const car = {
        ...action.payload,
        status: "stopped",
        animationDuration: 0,
      };
      state.cars.push(car);
    });
    builder.addCase(removeCar.fulfilled, (state, action) => {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
    });
    builder.addCase(updateCar.fulfilled, (state, action) => {
      state.cars = state.cars.map((car) => {
        if (car.id === action.payload.id) {
          car.name = action.payload.name;
          car.color = action.payload.color;
        }
        return car;
      });
    });
    builder.addCase(startEngine.fulfilled, (state, action) => {
      state.cars = state.cars.map((car) => {
        if (car.id === action.payload.id) {
          car.status = "started";
          car.animationDuration = (
            action.payload.distance /
            action.payload.velocity /
            1000
          ).toFixed(2);
        }
        return car;
      });
    });
    builder.addCase(drive.fulfilled, (state, action) => {
      state.cars = state.cars.map((car) => {
        if (car.id === action.payload.id && car.status === "started")
          car.status = action.payload.status;
        return car;
      });
    });
    builder.addCase(stopEngine.fulfilled, (state, action) => {
      state.cars = state.cars.map((car) => {
        if (car.id === action.payload) {
          car.status = "stopped";
          car.animationDuration === 0;
        }
        return car;
      });
    });
    builder.addCase(getWinners.fulfilled, (state, action) => {
      const winners = [];
      for (let winner of action.payload)
        for (let car of state.cars)
          if (winner.id === car.id) winners.push({ ...car, ...winner });

      state.winners = winners;
    });
    builder.addCase(addWinner.fulfilled, (state, action) => {
      for (let i = 0; i < state.winners.length; i++) {
        if (state.winners[i].id === action.payload.id) {
          state.winners[i].wins += 1;
          state.winners[i].time = action.payload.time;
          return;
        }
      }

      state.winners.push(action.payload);
    });
  },
});

export const selectCars = (state) => state.cars.cars;
export const selectWinners = (state) => state.cars.winners;
export const selectCurrentWinner = (state) => state.cars.currentWinner;
export const selectIsRacing = (state) => state.cars.isRacing;

export const { setCurrentWinner, setIsRacing } = carsSlice.actions;

export default carsSlice.reducer;
