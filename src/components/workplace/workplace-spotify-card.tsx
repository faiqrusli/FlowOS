import { WorkplaceModuleCard } from "@/components/workplace/workplace-module-card";

export function WorkplaceSpotifyCard() {
  return (
    <WorkplaceModuleCard moduleId="spotify" title="Spotify">
      <div className="flex flex-1 items-center justify-center p-3">
        <p className="text-center text-[10px] text-muted-foreground/50">
          Coming soon
        </p>
      </div>
    </WorkplaceModuleCard>
  );
}
