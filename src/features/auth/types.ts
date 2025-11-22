// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type RegisterReq = {
  email: string;
  password: string;
  full_name: string;
  child_name: string;
  child_age: number;
};

export type RegisterRes = {
  status: 'success';
  access_token: string;
  user: { user_id: string; email: string; full_name: string };
  learner: { learner_id: string; name: string; age: number };
};

export type LoginReq = {
  email: string;
  password: string;
};

export type LoginRes = {
  status: 'success';
  access_token: string;
  user: { user_id: string; learner_id: string | null };
};

export type MeRes = {
  status: 'success';
  user: { user_id: string; email: string; full_name: string };
  learner: {
    learner_id: string;
    name: string;
    age: number;
    profile_status: 'incomplete' | 'ready' | 'complete';
  };
};
