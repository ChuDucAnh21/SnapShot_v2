// Rules applied: brace-style:1tbs

'use client';

type SkipConfirmProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function SkipConfirm({ onConfirm, onCancel }: SkipConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 max-w-md rounded-lg bg-white p-8 text-center">
        <div className="mb-4 text-6xl">🤔</div>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Bỏ qua câu hỏi?</h2>

        <p className="mb-6 text-gray-600">
          Bạn có chắc chắn muốn bỏ qua câu hỏi này không? Hệ thống sẽ tự động ôn lại sau.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
          >
            Bỏ qua
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-lg bg-gray-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-600"
          >
            Tiếp tục làm
          </button>
        </div>
      </div>
    </div>
  );
}
