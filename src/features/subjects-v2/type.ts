export type SubjectListItem = {
  subject_id: string;
  subject_name: string;
  description?: string;
  estimate?: number;
  info_detail?: string[];
  current_status?: boolean;
  [key: string]: unknown;
};

export type SubjectListResponse = SubjectListItem[];

export type EvaluationFrameworkItem = {
  title: string;
  description?: string;
  [key: string]: unknown;
};

export type SubjectOverviewResponse = {
  subject_id: string;
  subject_name: string;
  evaluation_framework: EvaluationFrameworkItem[];
  [key: string]: unknown;
};
