// Rules applied: brace-style:1tbs

'use client';

import type { Question } from './types';
import { Counting } from './Counting';
import { DragMatch } from './DragMatch';
import { SelectMany } from './SelectMany';
import { SelectOne } from './SelectOne';

type QuestionViewProps = {
  question: Question;
  answer: any;
  onAnswer: (value: any) => void;
};

export function QuestionView({ question, answer, onAnswer }: QuestionViewProps) {
  switch (question.type) {
    case 'select_one':
      return <SelectOne q={question} answer={answer} onSelect={onAnswer} />;
    case 'select_many':
      return <SelectMany q={question} selected={answer || []} onToggle={onAnswer} />;
    case 'counting':
      return <Counting q={question} value={answer} onChange={onAnswer} />;
    case 'drag_match':
      return <DragMatch q={question} pairs={answer || []} onChange={onAnswer} />;
    default:
      return (
        <div className="text-center text-gray-500">
          <p>Loại câu hỏi không được hỗ trợ</p>
        </div>
      );
  }
}
