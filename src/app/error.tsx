'use client';
export default function ErrorPage({ error }: { error: Error }) {
  return <div style={{padding:24}}>Something went wrong: {error.message}</div>;
}