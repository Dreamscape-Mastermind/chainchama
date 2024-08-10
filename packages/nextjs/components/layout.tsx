import type { ReactNode } from "react";

export default function SessionLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
