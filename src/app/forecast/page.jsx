
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./forcast.module.css";
import Topbar from "../components/topbar/Topbar";
import FadeLoader from "react-spinners/FadeLoader";
import WeatherWidget from "../components/weatherWidget/Weatherwidget";

const Forecast = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const futureStartDate = e.target.future_start_date.value;
    const futureEndDate = e.target.future_end_date.value;

    const response = await fetch(
      "https://flask-server-sjfm.onrender.com//predict_future_gdd",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: futureStartDate,
          end_date: futureEndDate,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setResults(data); // Set the results state with the received data
      localStorage.setItem("result", JSON.stringify(data)); // Save the results to local storage
      console.log(results)
      router.push("/graph");
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Topbar showSearch={true} showLinks={true} showMenu={true} />
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          Crop Decision Support System (using Growing Degree Days, GDD)
        </h2>
        <WeatherWidget />
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.dateContainer}>
          <label className={styles.label}>Start Date:</label>
          <input
            className={styles.date}
            type="date"
            name="future_start_date"
            placeholder="start date"
            required
          />
          <label className={styles.label}>End Date:</label>
          <input
            className={styles.date}
            type="date"
            name="future_end_date"
            placeholder="end date"
            required
          />
        </div>

        {loading ? (
          <FadeLoader
            color={"green"}
            loading={loading}
            cssOverride={{ display: "block", margin: "0 auto" }}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <button className={styles.submit} type="submit">
            Predict
          </button>
        )}
      </form>
    </div>
  );
};

export default Forecast;
