// Rules applied: ts:consistent-type-definitions:type, brace-style:1tbs

export type Choice = {
  id: string;
  text: string;
  imageUrl?: string;
};

export type QuestionBase = {
  id: string;
  prompt: string;
  assets?: {
    image?: string;
    tts?: string;
  };
  hint?: string;
};

export type QSelectOne = QuestionBase & {
  type: 'select_one';
  choices: Choice[];
  answer_key: string;
};

export type QSelectMany = QuestionBase & {
  type: 'select_many';
  choices: Choice[];
  answer_key: string[];
};

export type QCounting = QuestionBase & {
  type: 'counting';
  answer_key: number;
  showKeypad?: boolean;
};

export type QDragMatch = QuestionBase & {
  type: 'drag_match';
  left: Choice[];
  right: Choice[];
  answer_pairs: Array<{ leftId: string; rightId: string }>;
};

export type Question = QSelectOne | QSelectMany | QCounting | QDragMatch;

export type LessonData = {
  lessonId: string;
  title: string;
  questions: Question[];
};
