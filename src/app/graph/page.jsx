"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./graph.module.css";
import Image from "next/image";
import Topbar from "../components/topbar/Topbar";

const Result = () => {
  const [result, setResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedResult = localStorage.getItem("result");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      router.push("/forcast"); // Redirect to the forecast page if no result found
    }
  }, [router]);

  if (!result) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Topbar showLinks={false} showSearch={false} showMenu={false}/>
      <h2 className={styles.title}>GDD Prediction Results</h2>
      <p className={styles.gddValue}><strong className={styles.gdd}>Cumulative GDD:</strong> {result.cumulative_GDD}</p>
      {result.graph && (
        <img
          className={styles.graph}
          src={`https://flask-server-sjfm.onrender.com/${result.graph}`}
          alt="GDD Plot"
        />
      )}
    </div>
  );
};

export default Result;
