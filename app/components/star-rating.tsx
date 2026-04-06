import { useState } from "react";
import { useFetcher } from "react-router";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

interface StarRatingDisplayProps {
  average: number | null;
  count: number;
  className?: string;
}

export function StarRatingDisplay({
  average,
  count,
  className,
}: StarRatingDisplayProps) {
  if (average === null || count === 0) return null;

  return (
    <span className={cn("flex items-center gap-1 text-sm", className)}>
      <Star className="size-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{average.toFixed(1)}</span>
      <span className="text-muted-foreground">({count})</span>
    </span>
  );
}

interface StarRatingInputProps {
  courseId: number;
  currentRating: number | null;
}

export function StarRatingInput({
  courseId,
  currentRating,
}: StarRatingInputProps) {
  const fetcher = useFetcher();
  const [hovered, setHovered] = useState<number | null>(null);

  const submittedRating = fetcher.formData
    ? Number(fetcher.formData.get("rating"))
    : null;

  const savedRating = submittedRating ?? currentRating;
  const activeRating = hovered ?? savedRating;

  function submitRating(rating: number) {
    fetcher.submit(
      { courseId, rating },
      {
        method: "POST",
        action: "/api/rate-course",
        encType: "application/json",
      }
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-muted-foreground">
        {savedRating ? "Your rating" : "Rate this course"}
      </p>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => submitRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="rounded transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Rate ${star} out of 5`}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                (activeRating ?? 0) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40 hover:text-yellow-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
