export const CREDENTIAL: string = "credential";

export interface Credential {
  name: string;
  emotions: Emo[] | [];
  insight: Insight | null;
}

export interface Emo {
  id: number;
  emoji: string;
  content: string;
  score: number;
  aiInsight: string;
}

export interface Insight {
  urgent: string;
  positive: string;
  corelative: string;
}

export enum Weekday {
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
  SUN = 7,
}

export enum Emotions {
  HAPPY = "😊",
  RELIEVED = "😌",
  CURIOUS = "🧐",
  ANGRY = "😤",
  TIRED = "😴",
}
