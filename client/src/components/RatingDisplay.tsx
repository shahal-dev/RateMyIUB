import { Star, Users, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface RatingDisplayProps {
  overall: number;
  totalReviews: number;
  wouldTakeAgain?: number;
  recommend?: number;
  size?: "sm" | "md" | "lg";
}

const RatingDisplay = ({ 
  overall, 
  totalReviews, 
  wouldTakeAgain, 
  recommend, 
  size = "md" 
}: RatingDisplayProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-success";
    if (rating >= 3) return "text-warning";
    return "text-destructive";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return "bg-success/10";
    if (rating >= 3) return "bg-warning/10";
    return "bg-destructive/10";
  };

  return (
    <div className="space-y-4">
      {/* Overall Rating */}
      <Card className={`p-4 ${getRatingBg(overall)} border-none`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`font-bold ${getRatingColor(overall)} ${sizeClasses[size]}`}>
              {overall.toFixed(1)}
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= overall
                      ? "fill-current text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {totalReviews} reviews
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Metrics */}
      {(wouldTakeAgain !== undefined || recommend !== undefined) && (
        <div className="grid grid-cols-2 gap-3">
          {wouldTakeAgain !== undefined && (
            <Card className="p-3 bg-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary">
                  {Math.round(wouldTakeAgain * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Would take again</div>
              </div>
            </Card>
          )}
          {recommend !== undefined && (
            <Card className="p-3 bg-card">
              <div className="text-center">
                <div className="text-lg font-semibold text-primary flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {Math.round(recommend * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">Recommend</div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingDisplay;