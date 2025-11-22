// Rules applied: brace-style:1tbs, react/prefer-destructuring-assignment:off

'use client';

import type { LessonResults } from '@/components/organisms/LessonSession';
import { useState } from 'react';
import { LessonSession } from '@/components/organisms/LessonSession';
// import { MOCK_CONTENT_BUNDLE, resolveLesson } from '@/data/mock-content';

// TODO: Implement mock content
const MOCK_CONTENT_BUNDLE = {
  lessons: {
    LESSON_COUNT_1_10: 'lesson-1',
  },
  templates: [],
};

const resolveLesson = (lessonId: string) => {
  // Return mock lesson data
  return {
    id: lessonId,
    title: 'Mock Lesson',
    items: [] as any[], // Mock empty items array
  };
};

export function MathLessonDemo() {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [lessonResults, setLessonResults] = useState<LessonResults | null>(null);

  const handleStartLesson = () => {
    setIsLessonActive(true);
    setLessonResults(null);
  };

  const handleLessonComplete = (results: LessonResults) => {
    setLessonResults(results);
    setIsLessonActive(false);
  };

  const handleExitLesson = () => {
    setIsLessonActive(false);
  };

  if (isLessonActive) {
    const lesson = MOCK_CONTENT_BUNDLE.lessons.LESSON_COUNT_1_10;
    const lessonData = resolveLesson(lesson);

    return <LessonSession items={lessonData.items} onComplete={handleLessonComplete} onExit={handleExitLesson} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md p-6">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Demo Bài Học Toán</h1>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Mock Math Lesson
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Kỹ năng: Nhận biết số 1–10, Đếm đến 10</p>
              <p>
                Thời gian ước tính: 5 phút
              </p>
              <p>
                Số câu hỏi: 10
              </p>
            </div>
          </div>

          {lessonResults && (
            <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-green-600">Kết quả bài học</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Độ chính xác:</span>
                  <span className="ml-2 font-semibold">
                    {Math.round(lessonResults.accuracy)}
                    %
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="ml-2 font-semibold">
                    {Math.round(lessonResults.timeSpent / 1000)}
                    s
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Đúng:</span>
                  <span className="ml-2 font-semibold text-green-600">{lessonResults.correctAnswers}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sai:</span>
                  <span className="ml-2 font-semibold text-red-600">{lessonResults.incorrectAnswers}</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-gray-600">Sao đạt được:</span>
                <div className="mt-2 flex justify-center">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${i < lessonResults.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button type="button" onClick={handleStartLesson} className="w-full">
            {lessonResults ? 'Làm lại bài học' : 'Bắt đầu bài học'}
          </button>

          <div className="space-y-1 text-xs text-gray-500">
            <p>Demo này sử dụng mock data từ Iruka Math Core</p>
            <p>Tất cả dữ liệu được tạo ngẫu nhiên có kiểm soát</p>
          </div>
        </div>
      </div>
    </div>
  );
}
