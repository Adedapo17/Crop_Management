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
    predicted_dates: {},
    water_requirements_per_hectare: "",
    agricultural_practices: [],
  });

  const { data } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      const storedResults = localStorage.getItem("results");
      if (storedResults) {
        setResults(JSON.parse(storedResults));
        console.log(results.predicted_dates);
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
      predicted_dates: JSON.stringify(results.predicted_dates, null, 2),
      pest_info: results.pest_info
        .map(
          (pest) =>
            `Pest: ${pest.pest}, Symptoms: ${
              pest.symptoms
            }, Control Options: ${pest.control_options.join(", ")}`
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
        {Object.entries(results.predicted_dates)
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
        {Array.isArray(results.water_requirement_per_hectare)
          ? results.water_requirement_per_hectare.join(" - ")
          : "No data available"}{" "}
        (litres/hectare)
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
        {results.agricultural_practices.join(", ")}
      </div>
      <button className={styles.emailButton} onClick={sendEmail}>
        Send Results to Email
      </button>
    </div>
  );
};

export default Result;
