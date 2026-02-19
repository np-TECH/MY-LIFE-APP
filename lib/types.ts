export type DailyEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  outreach_done: boolean;
  income_action_done: boolean;
  future_build_done: boolean;
  family_time_done: boolean;
  gym_done: boolean;
  touchpoints_count: number;
  meetings_count: number;
  pitches_count: number;
  notes: string | null;
};

export type PipelineItem = {
  id: string;
  user_id: string;
  contact_name: string;
  company: string | null;
  category: string | null;
  channel: string | null;
  stage: "Sent" | "Responded" | "Meeting" | "Pitch" | "Closed" | string;
  date_contacted: string | null;
  follow_up_date: string | null;
  value_potential: number | null;
  next_action: string | null;
  notes: string | null;
};

export type WeeklyReview = {
  id: string;
  user_id: string;
  week_start: string;
  touchpoints: number;
  meetings: number;
  pitches: number;
  gym_sessions: number;
  date_night: boolean;
  family_walk: boolean;
  notes: string | null;
};
