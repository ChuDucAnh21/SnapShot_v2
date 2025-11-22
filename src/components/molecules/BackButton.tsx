import React from 'react';
import BasicButton from '../atoms/BasicButton';

const BackButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => (
  <BasicButton variant="ghost" size="sm" {...props}>
    ← Back
  </BasicButton>
);
export default BackButton;
