export type SnapshotAdvice = {
  details: string[];
  summary: string;
  [key: string]: unknown;
};

export type SnapshotChildInfo = {
  child_id?: string;
  full_name?: string;
  nickname?: string;
  gender?: string;
  birth_date?: string;
  age_years?: number;
  stage_label?: string;
  stage_note?: string;
  [key: string]: unknown;
};

export type SnapshotOverviewAxis = {
  axis_code: string;
  axis_name: string;
  description?: string | null;
  position?: number;
  score?: number | null;
  tags?: string | null;
  [key: string]: unknown;
};

export type SnapshotGeneratePayload = {
  child_id: string;
  submission_id: string;
  subject_id: string;
};

export type SnapshotGenerateResponse = {
  advice: SnapshotAdvice;
  child_info: SnapshotChildInfo;
  overview: SnapshotOverviewAxis[];
  snapshot_id: string;
  status_code: number;
  subject_id: string;
  subject_name: string;
  submission_id: string;
  child_id: string;
  stage_label?: string;
  stage_note?: string;
  message?: string;
  code?: string;
  user_tip?: string | null;
  [key: string]: unknown;
};
