// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

import SessionClient from './SessionClient';

type PageProps = {
  readonly params: Promise<{ id: string }>;
};

export default async function SessionPage({ params }: PageProps) {
  const { id } = await params;
  return <SessionClient id={id} />;
}
