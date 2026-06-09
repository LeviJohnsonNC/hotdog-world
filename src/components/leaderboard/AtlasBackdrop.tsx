import bgAsset from "@/assets/leaderboard-bg.png.asset.json";

export const AtlasBackdrop = () => {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundImage: `url(${bgAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "hsl(217 45% 8%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, hsla(38, 55%, 48%, 0.18) 0%, transparent 55%), linear-gradient(180deg, hsla(217, 45%, 6%, 0.55) 0%, hsla(217, 45%, 5%, 0.75) 100%)",
        }}
      />
    </div>
  );
};
