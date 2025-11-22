// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type Subject = {
  subject_id: string;
  name: string;
  code: string;
};

export type SubjectsRes = {
  status: 'success';
  subjects: Subject[];
};

export type GetSubjectsRes = SubjectsRes;
