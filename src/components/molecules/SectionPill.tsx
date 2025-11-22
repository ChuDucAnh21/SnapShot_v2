import React from 'react';
import Pill from '../atoms/Pill';

export type SectionPillProps = { text: string };

const SectionPill: React.FC<SectionPillProps> = ({ text }) => <Pill text={text} />;

export default SectionPill;
