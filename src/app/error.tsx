"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="text-lg text-muted-foreground">
        An error occurred while loading this page.
      </p>
      <div className="flex items-center gap-x-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
