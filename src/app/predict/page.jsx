"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./predict.module.css";
import Topbar from "../components/topbar/Topbar";
import FadeLoader from "react-spinners/FadeLoader";

const Predict = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const startDate = e.target.start_date.value;
    const endDate = e.target.end_date.value;
    const crop = e.target.crops.value;

    const response = await fetch("https://flask-server-sjfm.onrender.com/predict_gdd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start_date: startDate, end_date: endDate, crop }),
    });

    if (response.ok) {
      const data = await response.json();
      setResults(data);  // Set the results state with the received data
      localStorage.setItem("results", JSON.stringify(data));  // Save the results to local storage
      router.push("/result");
    } else {
      console.error("Failed to fetch data:", response.statusText);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Topbar showSearch={true} />
      <h2 className={styles.title}>Crop Decision Support System (using Growing Degree Days, GDD)</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <select className={styles.select} name="crops" id="crops" required>
          <option value="none">Choose your crop</option>
          <option value="maize">Maize</option>
          <option value="rice">Rice</option>
          <option value="tomato">Tomato</option>
          <option value="beans">Beans</option>
          <option value="millet">Millet</option>
        </select>
        <div className={styles.dateContainer}>
          <label className={styles.label}>
            Start Date: <span>(YOUR PLANTING DATE)</span>
          </label>
          <input
            className={styles.date}
            type="date"
            name="start_date"
            placeholder="start date"
            required
          />
          <label className={styles.label}>End Date:</label>
          <input
            className={styles.date}
            type="date"
            name="end_date"
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
            Calculate
          </button>
        )}
      </form>
    </div>
  );
};

export default Predict;
