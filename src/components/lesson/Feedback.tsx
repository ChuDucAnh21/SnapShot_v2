// Rules applied: brace-style:1tbs

'use client';

type FeedbackProps = {
  correct: boolean;
  onNext?: () => void;
  onRetry?: () => void;
  onHint?: () => void;
  onSkip?: () => void;
};

export function Feedback({ correct, onNext, onRetry, onHint, onSkip }: FeedbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 max-w-md rounded-lg bg-white p-8 text-center">
        <div className={`mb-4 text-6xl ${correct ? 'text-green-500' : 'text-red-500'}`}>{correct ? '🎉' : '😔'}</div>

        <h2 className={`mb-4 text-2xl font-bold ${correct ? 'text-green-600' : 'text-red-600'}`}>
          {correct ? 'Đúng rồi!' : 'Sai rồi!'}
        </h2>

        <div className="space-y-3">
          {correct
            ? (
              <button
                type="button"
                onClick={onNext}
                className="w-full rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
              >
                Tiếp tục
              </button>
            )
            : (
              <>
                <button
                  type="button"
                  onClick={onRetry}
                  className="w-full rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  Thử lại
                </button>

                <button
                  type="button"
                  onClick={onHint}
                  className="w-full rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-yellow-600"
                >
                  Gợi ý
                </button>

                <button
                  type="button"
                  onClick={onSkip}
                  className="w-full rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
                >
                  Bỏ qua
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
