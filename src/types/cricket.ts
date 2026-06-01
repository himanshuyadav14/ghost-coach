export type Sport = "cricket";

export type PlayerRole = "batsman";

export type Handedness = "right" | "left";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type SkillLevel = ExperienceLevel | "elite";

export type ShotCategory =
  | "defensive"
  | "attacking"
  | "sweep"
  | "pull"
  | "drive";

export interface PlayerGoal {
  title: string;
  description?: string;
  targetDate?: Date;
}

export interface BatsmanProfile {
  sport: Sport;
  role: PlayerRole;
  handedness: Handedness;
  skillLevel: SkillLevel;
  preferredShots: ShotCategory[];
  goals: PlayerGoal[];
}
