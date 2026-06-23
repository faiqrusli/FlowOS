import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SettingsRow } from "@/components/settings/settings-row";

type SettingsToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  comingSoon?: boolean;
  className?: string;
};

export function SettingsToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
  comingSoon,
  className,
}: SettingsToggleRowProps) {
  return (
    <SettingsRow label={label} description={description} className={className}>
      <div className="flex items-center gap-2">
        {comingSoon && (
          <Badge variant="outline" className="text-[10px]">
            Coming Soon
          </Badge>
        )}
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled || comingSoon}
        />
      </div>
    </SettingsRow>
  );
}
