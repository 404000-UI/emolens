"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import { CREDENTIAL, Credential } from "@/store/store";
import { useRouter } from "next/navigation";

const onSubmit = (e: React.SubmitEvent): void => {
  e.preventDefault();
};

export default function Login() {
  const [name, setName]: [string, Function] = useState("");
  const router = useRouter();

  useEffect(() => {
    localStorage.clear();
    setName("");
  }, []);

  const onClick = (e: React.MouseEvent): void => {
    if (name) {
      const info: Credential = {
        name: name,
        emotions: [],
        insight: null,
      };
      localStorage.setItem(CREDENTIAL, JSON.stringify(info));
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>EmoLens</h1>
        <h4>Understand your emotions, one day at a time</h4>
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>Welcome to EmoLens</h2>
        <h4>Before we begin, tell us your name.</h4>
        <input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <p className={name ? styles.notWarning : styles.warning}>
          We need your name.
        </p>
        <button onClick={onClick}>Get Started</button>
      </form>
    </div>
  );
}
