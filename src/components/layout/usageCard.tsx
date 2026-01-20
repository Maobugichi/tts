import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "@radix-ui/react-progress"
import type { UsageData } from "@/types";
import { Badge } from "../ui/badge";

export const UsageCard = ({usage}: {usage:UsageData | null}) => {
  const usagePercent = usage ? (usage.characterCount / usage.characterLimit) * 100 : 0;
  const isLowOnChars = usage && usage.charactersRemaining < 1000;
    return(
        <>
          {usage && (
            <Card className={isLowOnChars ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Usage</CardTitle>
                    <Badge variant={isLowOnChars ? 'destructive' : 'secondary'}>
                    {usage.tier}
                    </Badge>
                </div>
                </CardHeader>
                <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                    {usage.characterCount.toLocaleString()} / {usage.characterLimit.toLocaleString()} characters
                    </span>
                    <span className="font-medium">
                    {usage.charactersRemaining.toLocaleString()} remaining
                    </span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                {isLowOnChars && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Running low on characters. Consider upgrading your plan.</span>
                    </div>
                )}
                </CardContent>
            </Card>
            )}
        </>
    )
}