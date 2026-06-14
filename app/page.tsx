"use client";

import styles from "./styles/main.module.css";
import {
  Credential,
  CREDENTIAL,
  Emo,
  Emotions,
  Insight,
  Weekday,
} from "@/store/store";
import { updateTag } from "next/cache";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [date, setDate]: [number, Function] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [selected, setSelected]: [string, Function] = useState("");
  const [score, setScore]: [number, Function] = useState(0);
  const [content, setContent]: [string, Function] = useState("");
  const [info, setInfo] = useState<Credential>({
    name: "",
    emotions: [],
    insight: null,
  });

  const findScoreById = (id: number): number => {
    if (info.emotions) {
      for (let i: number = 0; i < info.emotions.length; i++) {
        if (info.emotions[i].id === id) {
          return info.emotions[i].score;
        }
      }
    }
    return 0;
  };

  const findInsightById = (id: number): string => {
    if (info.emotions) {
      for (let i: number = 0; i < info.emotions.length; i++) {
        if (info.emotions[i].id === id) {
          return info.emotions[i].aiInsight;
        }
      }
    }
    return "";
  };

  useEffect(() => {
    setDate(new Date().getDay() as Weekday);
    const tmpInfo = localStorage.getItem(CREDENTIAL);
    if (!tmpInfo) {
      router.push("/login");
    } else {
      const data: Credential = JSON.parse(tmpInfo);
      setInfo(data);
      setIsChecked(true);
    }
  }, []);

  if (!isChecked) return;

  return (
    <div className={styles.container}>
      <h1>Nice to meet you, {info.name}</h1>
      <h6>Track your emotions and understand yourself better.</h6>
      <div className={styles.record}>
        <div className={styles.todayEmotion}>
          <h2>Today's Emotion</h2>
          <div className={styles.score}>
            <h1>{findScoreById(date)}</h1>
            <h4>/ 100</h4>
          </div>
          <p>Mood score</p>
          <div className={styles.encourage}>
            <h1>🔥️</h1>
            <div>
              <h3>{findInsightById(date)}</h3>
            </div>
          </div>
        </div>
        <div className={styles.quickRecord}>
          <form onSubmit={(e: React.SubmitEvent) => e.preventDefault()}>
            <h2>Quick Record</h2>
            <h4>How are you feeling?</h4>
            <div className={styles.buttons}>
              <button
                className={selected === Emotions.HAPPY ? styles.selected : ""}
                onClick={() => setSelected(Emotions.HAPPY)}
              >
                😊
              </button>
              <button
                className={
                  selected === Emotions.RELIEVED ? styles.selected : ""
                }
                onClick={() => setSelected(Emotions.RELIEVED)}
              >
                😌
              </button>
              <button
                className={selected === Emotions.CURIOUS ? styles.selected : ""}
                onClick={() => setSelected(Emotions.CURIOUS)}
              >
                🧐
              </button>
              <button
                className={selected === Emotions.ANGRY ? styles.selected : ""}
                onClick={() => setSelected(Emotions.ANGRY)}
              >
                😤
              </button>
              <button
                className={selected === Emotions.TIRED ? styles.selected : ""}
                onClick={() => setSelected(Emotions.TIRED)}
              >
                😴
              </button>
            </div>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="What's on your mind?"
            />
            <button
              className={styles.formBtn}
              onClick={async (e: React.MouseEvent) => {
                if (findScoreById(date)) {
                  alert("오늘의 기록이 있습니다.");
                } else {
                  const res = await fetch(
                    `/api/todayemo?id=${date}&emoji=${selected}&content=${content}`,
                  );
                  setSelected("");
                  setContent("");
                  const data: Emo = await res.json();
                  setScore(data.score);
                  setInfo((prev) => {
                    const updated: Credential = {
                      ...prev,
                      emotions: [...prev.emotions, data],
                    };
                    localStorage.setItem(CREDENTIAL, JSON.stringify(updated));
                    return updated;
                  });
                }
              }}
            >
              Analyzing with AI
            </button>
          </form>
        </div>
      </div>
      <div className={styles.chart}>
        <div className={styles.weeklyTrend}>
          <div className={styles.weeklyTitle}>
            <h2>Weekly Emotion Trend</h2>
            <h4
              onClick={async () => {
                const res = await fetch(
                  `/api/analyze?info=${JSON.stringify(info)}`,
                );
                const data: Insight = await res.json();
                setInfo((prev) => {
                  const updated: Credential = {
                    ...prev,
                    insight: data,
                  };
                  localStorage.setItem(CREDENTIAL, JSON.stringify(updated));
                  return updated;
                });
              }}
            >
              Analyze Emotions ➤
            </h4>
          </div>
          <div className={styles.progresses}>
            <div className={styles.h4s}>
              <h4>Mon</h4>
              <h4>Tue</h4>
              <h4>Wed</h4>
              <h4>Thu</h4>
              <h4>Fri</h4>
              <h4>Sat</h4>
              <h4>Sun</h4>
            </div>
            <div className={styles.progressBars}>
              <progress value={findScoreById(0 + 1)} max={100}></progress>
              <progress value={findScoreById(1 + 1)} max={100}></progress>
              <progress value={findScoreById(2 + 1)} max={100}></progress>
              <progress value={findScoreById(3 + 1)} max={100}></progress>
              <progress value={findScoreById(4 + 1)} max={100}></progress>
              <progress value={findScoreById(5 + 1)} max={100}></progress>
              <progress value={findScoreById(6 + 1)} max={100}></progress>
            </div>
          </div>
        </div>
        <div className={styles.aiInsight}>
          <h2>AI Insights</h2>
          <div className={styles.urgent}>
            <h5>URGENT OBSERVATION</h5>
            <h4>{info.insight ? info.insight.urgent : ""}</h4>
          </div>
          <div className={styles.positive}>
            <h5>POSITIVE PATTERN</h5>
            <h4>{info.insight ? info.insight.positive : ""}</h4>
          </div>
          <div className={styles.corelative}>
            <h5>CORELATIVE INSIGHT</h5>
            <h4>{info.insight ? info.insight.corelative : ""}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
