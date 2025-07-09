import {QuickActionType} from "@/components/hooks";
import { Card } from "./ui/card";

// some weird tw bug, but this is how it works
// from-orange-500/10 via-orange-500/5 to-transparent
// from-blue-500/10 via-blue-500/5 to-transparent
// from-purple-500/10 via-purple-500/5 to-transparent
// from-primary/10 via-primary/5 to-transparent

function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  return (
    <Card
      className="group mt-10 w-[300px]  relative overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      {/* ACTION GRADIENT */}
      <div
        className={`absolute text-center inset-0 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent opacity-100 group-hover:opacity-50 transition-opacity`}
      />

      {/* ACTION CONTENT WRAPPER */}
      <div className="relative p-6 size-full">
        <div className="space-y-3 flex items-center flex-col justify-center">
          {/* ACTION ICON */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 group-hover:scale-110 transition-transform`}
          >
            <action.icon className={`h-6 w-6 text-red-500`} />
          </div>

          {/* ACTION DETAILS */}
          <div className="space-y-1">
            <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
              {action.name}
            </h3>
            <p className="text-sm text-muted-foreground">{action.desc}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ActionCard;
