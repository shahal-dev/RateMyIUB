import { useParams, Link } from "react-router-dom";
import { Star, Users, TrendingUp, Calendar, BookOpen, Award, ThumbsUp, ThumbsDown, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from "sonner";
import RatingDisplay from "@/components/RatingDisplay";

// Star Rating Component for Reviews
const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Rating Distribution Component
const RatingDistribution = ({ reviews }: { reviews: any[] }) => {
  const ratingCounts = [1, 2, 3, 4, 5].map(rating => 
    reviews.filter(review => review.overall === rating).length
  );
  const totalReviews = reviews.length;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratingCounts[rating - 1];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-2">{rating}</span>
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <Progress value={percentage} className="flex-1 h-2" />
            <span className="w-8 text-right text-muted-foreground">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

const Professor = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();

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

  // Vote mutation for review helpfulness
  const voteMutation = useMutation({
    mutationFn: async ({ reviewId, vote }: { reviewId: string; vote: 'helpful' | 'not_helpful' }) => {
      if (!isSignedIn) {
        throw new Error('You must be signed in to vote');
      }
      
      const token = await getToken();
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ vote }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to vote');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Refetch reviews to update vote counts
      queryClient.invalidateQueries({ queryKey: ['reviews', 'professor', id] });
      toast.success('Vote recorded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to vote');
    },
  });

  const handleVote = (reviewId: string, vote: 'helpful' | 'not_helpful') => {
    if (!isSignedIn) {
      toast.error('Please sign in to vote on reviews');
      return;
    }
    voteMutation.mutate({ reviewId, vote });
  };

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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-3xl">{professor.fullName}</CardTitle>
                {professor.claimedByUserId && (
                  <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg">{professor.departments?.join(', ')}</p>
              {professor.bio && <p className="text-muted-foreground mt-3 max-w-2xl">{professor.bio}</p>}
            </div>
            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-4xl font-bold text-blue-600">
                  {professor.averageRating?.toFixed(1) || 'N/A'}
                </span>
                <div className="flex flex-col items-start">
                  <StarRating rating={professor.averageRating || 0} size="lg" />
                  <span className="text-sm text-muted-foreground mt-1">out of 5</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                {professor.totalReviews || 0} reviews
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rating Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{professor.averageRating?.toFixed(1) || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Overall Rating</div>
                <StarRating rating={professor.averageRating || 0} size="sm" />
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{Math.round(professor.wouldTakeAgainPercent || 0)}%</div>
                <div className="text-sm text-muted-foreground">Would Take Again</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{professor.totalReviews || 0}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{Math.round(professor.recommendPercent || 0)}%</div>
                <div className="text-sm text-muted-foreground">Recommend</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <RatingDistribution reviews={reviews} />
            ) : (
              <p className="text-muted-foreground text-center py-4">No ratings yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Student Reviews ({reviews.length})
            </CardTitle>
            <div className="flex gap-2">
              {isSignedIn ? (
                <Button asChild>
                  <Link to={`/write-review?professorId=${id}`}>
                    <Star className="h-4 w-4 mr-2" />
                    Write Review
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Sign in to Review
                </Button>
              )}
            </div>
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
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-medium">
                              {review.courseCode}
                            </Badge>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">{review.semester} {review.year}</span>
                            {review.gradeReceived && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <Badge variant="secondary" className="text-xs">
                                  Grade: {review.gradeReceived}
                                </Badge>
                              </>
                            )}
                            {review.section && (
                              <>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">Section {review.section}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.overall} size="sm" />
                              <span className="font-medium text-lg">{review.overall}/5</span>
                            </div>
                            {review.wouldTakeAgain !== null && (
                              <Badge variant={review.wouldTakeAgain ? "default" : "destructive"} className="text-xs">
                                Would take again: {review.wouldTakeAgain ? "Yes" : "No"}
                              </Badge>
                            )}
                            {review.recommend !== null && (
                              <Badge variant={review.recommend ? "default" : "secondary"} className="text-xs">
                                Recommends: {review.recommend ? "Yes" : "No"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                          <MessageSquare className="h-4 w-4 text-blue-500 mb-2" />
                          <p className="text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      )}

                      {/* Additional Rating Details */}
                      {(review.clarity || review.engagement || review.fairness || review.grading) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          {review.clarity && (
                            <div className="text-center">
                              <div className="text-sm font-medium text-blue-600">{review.clarity}/5</div>
                              <div className="text-xs text-muted-foreground">Clarity</div>
                            </div>
                          )}
                          {review.engagement && (
                            <div className="text-center">
                              <div className="text-sm font-medium text-green-600">{review.engagement}/5</div>
                              <div className="text-xs text-muted-foreground">Engagement</div>
                            </div>
                          )}
                          {review.fairness && (
                            <div className="text-center">
                              <div className="text-sm font-medium text-purple-600">{review.fairness}/5</div>
                              <div className="text-xs text-muted-foreground">Fairness</div>
                            </div>
                          )}
                          {review.grading && (
                            <div className="text-center">
                              <div className="text-sm font-medium text-orange-600">{review.grading}/5</div>
                              <div className="text-xs text-muted-foreground">Grading</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {review.tags?.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.id, 'helpful')}
                            disabled={voteMutation.isPending}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {review.helpfulCount || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote(review.id, 'not_helpful')}
                            disabled={voteMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {review.notHelpfulCount || 0}
                          </Button>
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
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.overall} size="sm" />
                        <span className="font-medium">{review.overall}/5</span>
                        <Badge variant="outline" className="text-xs">
                          {review.courseCode}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {review.semester} {review.year}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                        {review.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="helpful" className="space-y-4">
              {reviews
                .sort((a: any, b: any) => (b.helpfulCount || 0) - (a.helpfulCount || 0))
                .slice(0, 5)
                .map((review: any) => (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <StarRating rating={review.overall} size="sm" />
                          <span className="font-medium">{review.overall}/5</span>
                          <Badge variant="outline" className="text-xs">
                            {review.courseCode}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {review.helpfulCount || 0} helpful
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                          {review.comment}
                        </p>
                      )}
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