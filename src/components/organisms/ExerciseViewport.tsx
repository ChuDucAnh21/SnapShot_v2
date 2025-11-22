import * as React from 'react';

export default function ExerciseViewport({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full overflow-auto">{children}</div>;
}
