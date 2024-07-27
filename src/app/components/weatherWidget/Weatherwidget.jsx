// src/components/WeatherWidget.js
import React from "react";

import styles from "./weather.module.css";
import useWeather from "@/app/hooks/useWeather";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaTemperatureLow } from "react-icons/fa";
import { MdWbSunny } from "react-icons/md";

const WeatherWidget = () => {
  const { weather, loading } = useWeather();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weather) {
    return <div>Error loading weather data</div>;
  }

  const current_weather = weather.daily;
  const daily = weather.daily;

  if (!current_weather || !daily) {
    return <div>Error: Weather data is incomplete</div>;
  }

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.widgetIcon}>
        <span>
        <MdWbSunny size={24}/>
        </span>
        <h3> {weather.current?.temperature_2m}°C</h3>
      </div>
      <div className={styles.temp}>
        <div className={styles.max}>
          <span>
            <FaTemperatureHigh size={24} />
          </span>
          <p>{current_weather.temperature_2m_max}°C</p>
        </div>
        <div className={styles.min}>
          <FaTemperatureLow size={24} />
          <p>{current_weather.temperature_2m_min}°C</p>
        </div>
      </div>

      <h2 className={styles.location}>Ilorin</h2>
    </div>
  );
};

export default WeatherWidget;
