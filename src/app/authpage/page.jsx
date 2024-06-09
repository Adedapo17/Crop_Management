"use client"

import React from 'react'
import { signIn } from 'next-auth/react';
import styles from './authpage.module.css';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';


const Authpage = () => {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      signIn("google");
      router.push("/home")

    }
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.signupContainer}>
            <h1 className={styles.title}>SIGN UP</h1>
            <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} type="email" name="" id="email" />
            </div>
           <div className={styles.inputContainer}>
           <label className={styles.label} htmlFor="password">Password</label>
            <input className={styles.input} type="password" name="" id="password" />
           </div>
            
            <button className={styles.signup}>SIGN UP</button>
            <p className='text-center font-bold'>OR</p>
            <div className={styles.Google}>
            <FcGoogle size={28} />
            <button onClick={handleClick} className={styles.signin}>Sign up with Google</button>
            </div>
           
      </div>
       
    </div>
  )
}

export default Authpage;