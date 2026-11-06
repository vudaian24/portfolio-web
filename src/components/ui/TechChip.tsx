import Image from "next/image";
import { TECH_ICONS, type TechIconId } from "@/lib/techIcons";
import { cn } from "@/lib/utils";

type TechChipProps = {
  label: string;
  icons?: readonly TechIconId[];
  /** "md" for the case-study stack, "sm" elsewhere */
  size?: "sm" | "md";
  className?: string;
};

/** A tech label with its logos; the logos are decorative, the label is the text. */
export function TechChip({
  label,
  icons = [],
  size = "sm",
  className,
}: TechChipProps) {
  const px = size === "md" ? 18 : 16;

  return (
    <span
      className={cn(
        "group/chip inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/70 font-medium text-foreground transition-colors duration-300 hover:border-brand/50 hover:bg-brand-subtle hover:text-brand",
        size === "md"
          ? "py-1.5 pl-2 pr-3 text-sm"
          : "py-1 pl-1.5 pr-2.5 text-xs md:text-sm",
        icons.length === 0 && (size === "md" ? "pl-3" : "pl-2.5"),
        className,
      )}
    >
      {icons.length > 0 ? (
        <span className="flex shrink-0 items-center gap-0.5 transition-transform duration-300 group-hover/chip:scale-110">
          {icons.map((id) => {
            const icon = TECH_ICONS[id];
            return (
              <Image
                key={id}
                src={icon.src}
                alt=""
                aria-hidden
                width={px}
                height={px}
                unoptimized
                data-tone={"tone" in icon ? icon.tone : undefined}
                className="tech-icon shrink-0 rounded-[3px]"
                style={{ width: px, height: px }}
              />
            );
          })}
        </span>
      ) : null}
      {label}
    </span>
  );
}
