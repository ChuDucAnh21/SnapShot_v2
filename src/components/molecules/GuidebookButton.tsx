import React from 'react';
import BasicButton from '../atoms/BasicButton';

export type GuidebookButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
};

const GuidebookButton: React.FC<GuidebookButtonProps> = ({ href, ...rest }) =>
  (
    <BasicButton as="a" href={href} variant="secondary" size="sm" {...(rest as any)}>
      Guidebook
    </BasicButton>
  ) as any;

export default GuidebookButton;
