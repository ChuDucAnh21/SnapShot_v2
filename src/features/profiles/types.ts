// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type GenerateProfileReq = {
  learner_id: string;
};

export type Profile = {
  learner_id: string;
  abilities: { math: number; language: number; creativity: number; logic: number };
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  learning_style: 'visual' | 'auditory' | 'kinesthetic';
};

export type GenerateProfileRes = {
  status: 'success';
  profile: Profile;
};

export type GetProfileRes = GenerateProfileRes;
