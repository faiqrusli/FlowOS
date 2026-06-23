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
    <Card className="bg-neutral-50 ring-neutral-200/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-200/80">
            <Map className="size-4 text-neutral-600 stroke-[1.5]" />
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
                className="mt-2 size-1 shrink-0 rounded-full bg-neutral-300"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
