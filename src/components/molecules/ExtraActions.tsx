import React from 'react';

export type ExtraActionsProps = { children?: React.ReactNode };

const ExtraActions: React.FC<ExtraActionsProps> = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);

export default ExtraActions;
