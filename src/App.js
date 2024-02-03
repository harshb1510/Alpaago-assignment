import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import AllRoutes from "./AllRoutes";
import { useEffect, useState } from "react";
import axios from 'axios';
import {NextUIProvider} from "@nextui-org/react";

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = 'b76cdd4398be3adb793792040ef3b161'; // Replace with your OpenWeatherMap API key

  const weatherService = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
  });

  const getWeatherByCoordinates = async (lat, lon) => {
    try {
      const response = await weatherService.get('/weather', {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const data = await getWeatherByCoordinates(latitude, longitude);
      setWeatherData(data);
    });
  }, []);

  return (
    <div className="App">
      {/* <NextUIProvider> */}
      <Router>
        <Navbar weatherData={weatherData} />
        <AllRoutes />
      </Router>
      {/* </NextUIProvider> */}

    </div>
  );
}

export default App;
