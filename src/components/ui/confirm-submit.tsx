"use client";

import { useRef, type ReactNode } from "react";
import { Button } from "./button";

type ConfirmSubmitProps = {
  confirmation: string;
  children: ReactNode;
  name: string;
  value: string;
  formNoValidate?: boolean;
};

export function ConfirmSubmit({ confirmation, children, ...submission }: ConfirmSubmitProps) {
  const submitter = useRef<HTMLButtonElement>(null);
  return <>
    <Button type="button" variant="destructive" onClick={() => {
      if (window.confirm(confirmation) && submitter.current) submitter.current.form?.requestSubmit(submitter.current);
    }}>{children}</Button>
    <button hidden ref={submitter} type="submit" {...submission} />
  </>;
}
