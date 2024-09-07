"use client";

import React, { useState, useEffect } from "react";
import Topbar from "../components/topbar/Topbar";
import styles from "./result.module.css";
import emailjs from "emailjs-com";
import { useSession } from "next-auth/react";
import swal from "sweetalert";

const Result = () => {
  const [results, setResults] = useState({
    crop: "",
    cumulative_GDD: "",
    current_stage: "",
    current_stage_range: [],
    next_stage: "",
    pest_info: [],
    predicted_stages: {}, // Changed to object to match the backend response
    water_requirement_per_hectare: "",
    agricultural_practices: [],
    plot_path: "", // Add plot_path to the state to store the image URL
  });

  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const storedResults = localStorage.getItem("results");
      console.log(storedResults);

      if (storedResults) {
        setResults(JSON.parse(storedResults));
      } else {
        console.error("No results found in local storage.");
      }
    };

    fetchData();
  }, []);

  const user = data?.user;

  const sendEmail = () => {
    const templateParams = {
      crop: results.crop,
      cumulative_GDD: results.cumulative_GDD,
      current_stage: results.current_stage,
      current_stage_range: results.current_stage_range.join(" - "),
      next_stage: results.next_stage,
      predicted_stages: Object.entries(results.predicted_stages)
        .map(([stage, date]) => `${stage}: ${date}`)
        .join("\n"),
      pest_info: results.pest_info
        .map(
          (pest) =>
            `Pest: ${pest.name}, Symptoms: ${pest.symptoms}, Control Options: ${pest.control_options.join(", ")}`
        )
        .join("\n"),
      agricultural_practices: results.agricultural_practices.join(", "),
      to_email: user?.email, // Replace with the recipient's email
    };

    emailjs
      .send(
        "service_yw5mv48",
        "template_phh76fy",
        templateParams,
        "0vwCz0pU59XRF0wx1"
      )
      .then(
        (response) => {
          swal(
            "Successfully Sent!",
            "Your results have been sent to your email.",
            "success"
          );
        },
        (error) => {
          swal(
            "Oops!",
            "Something went wrong. Please try again later.",
            "error"
          );
        }
      );
  };

  return (
    <div className={styles.container}>
      <Topbar showSearch={false} />
      <h1 className={styles.header}>Result</h1>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Crop Name</th>
            <th className={styles.th}>Cumulative GDD</th>
            <th className={styles.th}>Current Stage</th>
            <th className={styles.th}>Current Stage Range</th>
            <th className={styles.th}>Next Stage</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          <tr>
            <td className={styles.td} data-label="Crop Name">
              {results.crop &&
                results.crop
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
            </td>
            <td className={styles.td} data-label="Cumulative GDD">
              {results.cumulative_GDD}
            </td>
            <td className={styles.td} data-label="Current Stage">
              {results.current_stage}
            </td>
            <td className={styles.td} data-label="Current Stage Range">
              {Array.isArray(results.current_stage_range)
                ? results.current_stage_range.join(" - ")
                : ""}
            </td>
            <td className={styles.td} data-label="Next Stage">
              {results.next_stage}
            </td>
          </tr>
        </tbody>
      </table>

      <h1 className={styles.info}>Predicted Dates</h1>
      <div className={styles.cardContainer}>
        {Object.entries(results.predicted_stages)
          .sort(([, dateA], [, dateB]) => new Date(dateA) - new Date(dateB)) // Sort based on date value
          .reduce((acc, [stage, date], index) => {
            const groupIndex = Math.floor(index / 2);
            if (!acc[groupIndex]) {
              acc[groupIndex] = [];
            }
            acc[groupIndex].push(
              <div className={styles.card} key={index}>
                <p>
                  <strong>{stage}:</strong> {date}
                </p>
              </div>
            );
            return acc;
          }, [])
          .map((group, groupIndex) => (
            <div className={styles.group} key={groupIndex}>
              {group}
            </div>
          ))}
      </div>

      <h1 className={styles.info}>Water Requirements</h1>
      <div className={styles.practice}>
        {results.water_requirement_per_hectare
          ? `${results.water_requirement_per_hectare.join(
              " - "
            )} litres/hectare`
          : "No data available"}
      </div>

      <h1 className={styles.info}>Pest Information</h1>
      <div>
        {results.pest_info.map((pest, index) => (
          <div className={styles.pest} key={index}>
            <p>
              <strong>Pest:</strong> {pest.pest}
            </p>
            <p>
              <strong>Symptoms:</strong> {pest.symptoms}
            </p>
            <p>
              <strong>Control Options:</strong>{" "}
              {pest.control_options.join(", ")}
            </p>
          </div>
        ))}
      </div>

      <h1 className={styles.info}>Agricultural Practices</h1>
      <div className={styles.practice}>
        {results.agricultural_practices.length > 0
          ? results.agricultural_practices.join(", ")
          : "No data available"}
      </div>

      {/* Display the GDD Plot */}
      <h1 className={styles.info}>GDD Plot</h1>
      {results.plot_path ? (
        <div className={styles.plotContainer}>
          <img
            src={`https://flask-server-sjfm.onrender.com/${results.plot_path}`}
            alt="GDD Plot"
            className={styles.plotImage}
          />
        </div>
      ) : (
        <p>No plot available</p>
      )}

      <button className={styles.emailButton} onClick={sendEmail}>
        Send Results to Email
      </button>
    </div>
  );
};

export default Result;
