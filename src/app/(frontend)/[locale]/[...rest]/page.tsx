import { notFound } from "next/navigation";

// Any path that matches no route ends here, so the localized not-found page in
// this segment renders instead of the bare Next.js default.
export default function CatchAllPage() {
  notFound();
}
