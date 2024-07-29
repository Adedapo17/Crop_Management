"use client"


import { useState, useEffect } from 'react';

const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=8.439994&longitude=4.494&current=temperature_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1');
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weather, loading };
};

export default useWeather;
