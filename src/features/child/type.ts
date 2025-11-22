export type ChildInfo = {
  fullname: string;
  nickname?: string;
  gender: string;
  birthday?: string;
};

export type SubmissSubject = {
  id_subject: string;
  submiss_id: string;
};

export type Child = {
  id: string;
  child_id: string;
  fullname: string;
  nickname?: string;
  gender?: string;
  birthday?: string;
  submiss_subject?: SubmissSubject[];
  [key: string]: unknown;
};

export type ChildListResponse = {
  list_kids: Child[];
  child_current_id: string;
};

export type CreateChildPayload = {
  parent_id: string;
  fullname: string;
  nickname?: string;
  gender: string;
  birthday?: string;
};

export type CreateChildResponse = {
  child_id: string;
  submission_id?: string;
  message?: string;
};
