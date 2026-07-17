import { Map } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FutureWorkCardProps = {
  items: string[];
};

export function FutureWorkCard({ items }: FutureWorkCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-surface-raised">
            <Map className="size-4 text-muted-foreground stroke-[1.5]" />
          </div>
          <CardTitle className="text-base">Future Work</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <span
                aria-hidden
                className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/30"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
