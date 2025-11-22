// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type GeneratePathReq = {
  learner_id: string;
  subject_id: string;
};

export type PathNode = {
  node_id: string;
  skill_name: string;
  order: number;
  status: 'available' | 'locked' | 'in_progress' | 'completed';
  dependencies: string[];
  estimated_sessions: number;
};

export type Path = {
  learner_id: string;
  subject: string;
  total_nodes: number;
  nodes: PathNode[];
};

export type GeneratePathRes = {
  status: 'success';
  path_id: string;
  path: Path;
};

export type GetPathRes = GeneratePathRes;
