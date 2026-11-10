import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared layout for the Open Graph images (link previews on LinkedIn, Slack, X).
// They are prerendered at build time. Text stays in English for every locale:
// the default next/og font has no Vietnamese glyphs.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgImageProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  tags: readonly string[];
};

export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
  tags,
}: OgImageProps) {
  const avatar = await readFile(join(process.cwd(), "public/avatar.jpg"));
  const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;
  // Long project titles get a smaller size so they stay on two lines.
  const titleSize = title.length > 24 ? 64 : 104;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "radial-gradient(circle at 0% 0%, #1e3a5f 0%, #0f1a2b 55%, #0b1320 100%)",
        color: "#e6edf5",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#7fb3e6",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#ffffff",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 32,
            lineHeight: 1.3,
            color: "#c3d2e3",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}
        >
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                border: "2px solid rgba(127, 179, 230, 0.45)",
                background: "rgba(127, 179, 230, 0.12)",
                fontSize: 24,
                color: "#d5e5f5",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 26,
            color: "#7fb3e6",
          }}
        >
          portfolio.anvd.io.vn
        </div>
      </div>
      {/* Avatar as a background, not an img: next/og draws this tree to a PNG,
          where next/image cannot run. 280x460 matches the photo's 779x1280. */}
      <div
        style={{
          display: "flex",
          width: 280,
          height: 460,
          borderRadius: 32,
          border: "4px solid rgba(127, 179, 230, 0.5)",
          backgroundImage: `url(${avatarSrc})`,
          backgroundSize: "100% 100%",
        }}
      />
    </div>,
    OG_SIZE,
  );
}
