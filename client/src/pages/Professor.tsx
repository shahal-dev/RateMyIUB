import { useParams, Link } from "react-router-dom";
import { Star, Users, TrendingUp, Calendar, BookOpen, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import RatingDisplay from "@/components/RatingDisplay";

const Professor = () => {
  const { id } = useParams();

  const { data: professor, isLoading: professorLoading } = useQuery({
    queryKey: ['professor', id],
    queryFn: async () => {
      const response = await fetch(`/api/professors/${id}`);
      if (!response.ok) throw new Error('Professor not found');
      return response.json();
    },
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', 'professor', id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?professorId=${id}`);
      return response.json();
    },
    enabled: !!id,
  });

  if (professorLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="h-64 bg-muted rounded-lg mb-4"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Professor Not Found</h2>
            <p className="text-muted-foreground mb-4">The professor you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Professor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{professor.fullName}</CardTitle>
                {professor.claimedByUserId && (
                  <Badge variant="default" className="bg-primary/10 text-primary">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{professor.departments?.join(', ')}</p>
              {professor.bio && <p className="text-sm text-muted-foreground mt-2">{professor.bio}</p>}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{professor.averageRating?.toFixed(1) || 'N/A'}</span>
              </div>
              <p className="text-sm text-muted-foreground">{professor.totalReviews || 0} reviews</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rating Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rating Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{professor.averageRating?.toFixed(1) || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Overall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(professor.wouldTakeAgainPercent || 0)}%</div>
              <div className="text-sm text-muted-foreground">Would Take Again</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{professor.totalReviews || 0}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(professor.recommendPercent || 0)}%</div>
              <div className="text-sm text-muted-foreground">Recommend</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Reviews
            </CardTitle>
            <Button asChild>
              <Link to="/write-review">Write Review</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.courseCode}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.semester} {review.year}</span>
                            {review.gradeReceived && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">Grade: {review.gradeReceived}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <RatingDisplay rating={review.overall} size="sm" />
                            <span className="text-sm font-medium">{review.overall}/5</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {review.wouldTakeAgain !== null && (
                            <div className="text-sm text-muted-foreground mb-1">
                              Would take again: {review.wouldTakeAgain ? "Yes" : "No"}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {review.comment && <p className="text-sm mb-3">{review.comment}</p>}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {review.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <button className="hover:text-foreground">
                            👍 {review.helpfulCount || 0}
                          </button>
                          <button className="hover:text-foreground">
                            👎 {review.notHelpfulCount || 0}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No reviews yet for this professor.</p>
                    <Button className="mt-4" asChild>
                      <Link to="/write-review">Write the First Review</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {reviews.slice(0, 5).map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RatingDisplay rating={review.overall} size="sm" />
                      <span className="text-sm font-medium">{review.overall}/5</span>
                      <span className="text-sm text-muted-foreground">• {review.semester} {review.year}</span>
                    </div>
                    {review.comment && <p className="text-sm">{review.comment}</p>}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="helpful" className="space-y-4">
              {reviews
                .sort((a: any, b: any) => (b.helpfulCount || 0) - (a.helpfulCount || 0))
                .slice(0, 5)
                .map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <RatingDisplay rating={review.overall} size="sm" />
                        <span className="text-sm font-medium">{review.overall}/5</span>
                        <span className="text-sm text-muted-foreground">• {review.helpfulCount || 0} helpful</span>
                      </div>
                      {review.comment && <p className="text-sm">{review.comment}</p>}
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Professor;