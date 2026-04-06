import { eq, avg, count, and } from "drizzle-orm";
import { db } from "~/db";
import { courseRatings } from "~/db/schema";

export function getAverageRating(courseId: number): {
  average: number | null;
  count: number;
} {
  const result = db
    .select({
      average: avg(courseRatings.rating),
      count: count(courseRatings.id),
    })
    .from(courseRatings)
    .where(eq(courseRatings.courseId, courseId))
    .get();

  const rawAvg = result?.average;
  return {
    average: rawAvg != null ? Math.round(Number(rawAvg) * 10) / 10 : null,
    count: result?.count ?? 0,
  };
}

export function getUserRating(userId: number, courseId: number): number | null {
  const result = db
    .select({ rating: courseRatings.rating })
    .from(courseRatings)
    .where(
      and(
        eq(courseRatings.userId, userId),
        eq(courseRatings.courseId, courseId)
      )
    )
    .get();

  return result?.rating ?? null;
}

export function upsertRating(
  userId: number,
  courseId: number,
  rating: number
): void {
  db.insert(courseRatings)
    .values({ userId, courseId, rating })
    .onConflictDoUpdate({
      target: [courseRatings.userId, courseRatings.courseId],
      set: { rating, updatedAt: new Date().toISOString() },
    })
    .run();
}
