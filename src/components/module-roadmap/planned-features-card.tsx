import { ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlannedFeaturesCardProps = {
  features: string[];
};

export function PlannedFeaturesCard({ features }: PlannedFeaturesCardProps) {
  return (
    <Card className="bg-neutral-50 ring-neutral-200/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-200/80">
            <ListChecks className="size-4 text-neutral-600 stroke-[1.5]" />
          </div>
          <CardTitle className="text-base">Planned Features</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-neutral-400"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
