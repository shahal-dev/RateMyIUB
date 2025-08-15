import { useParams } from "react-router-dom";
import { Star, Users, TrendingUp, Calendar, BookOpen, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingDisplay from "@/components/RatingDisplay";

const Professor = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const professor = {
    name: "Dr. Sarah Rahman",
    department: "Computer Science & Engineering",
    email: "sarah.rahman@iub.edu.bd",
    verified: true,
    totalReviews: 156,
    overallRating: 4.8,
    wouldTakeAgain: 0.94,
    courses: [
      { code: "CSE101", name: "Programming Fundamentals", semester: "Spring 2025" },
      { code: "CSE203", name: "Data Structures", semester: "Fall 2024" },
      { code: "CSE305", name: "Database Systems", semester: "Spring 2024" }
    ],
    tags: ["Clear Explanation", "Engaging", "Fair Grading", "Helpful", "Organized"],
    ratings: {
      clarity: 4.7,
      engagement: 4.9,
      fairness: 4.6,
      grading: 4.8,
      workload: 3.2,
      difficulty: 3.8
    }
  };

  const reviews = [
    {
      id: 1,
      course: "CSE101",
      semester: "Fall 2024",
      overall: 5,
      wouldTakeAgain: true,
      comment: "Excellent professor! Made programming concepts very clear and accessible.",
      tags: ["Clear Explanation", "Engaging"],
      helpful: 23,
      grade: "A"
    },
    {
      id: 2,
      course: "CSE203",
      semester: "Spring 2024",
      overall: 4,
      wouldTakeAgain: true,
      comment: "Good teacher, but the workload can be heavy. Worth it for the learning.",
      tags: ["Fair Grading", "Heavy Projects"],
      helpful: 15,
      grade: "B"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Professor Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{professor.name}</CardTitle>
                {professor.verified && (
                  <Badge variant="default" className="bg-primary/10 text-primary">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{professor.department}</p>
              <p className="text-sm text-muted-foreground">{professor.email}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{professor.overallRating}</span>
              </div>
              <p className="text-sm text-muted-foreground">{professor.totalReviews} reviews</p>
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
          <RatingDisplay 
            overall={professor.overallRating}
            totalReviews={professor.totalReviews}
            wouldTakeAgain={professor.wouldTakeAgain}
            size="lg"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.clarity}</div>
              <div className="text-sm text-muted-foreground">Clarity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.engagement}</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.fairness}</div>
              <div className="text-sm text-muted-foreground">Fairness</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.grading}</div>
              <div className="text-sm text-muted-foreground">Grading</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.workload}</div>
              <div className="text-sm text-muted-foreground">Workload</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{professor.ratings.difficulty}</div>
              <div className="text-sm text-muted-foreground">Difficulty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses & Tags */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Courses Taught
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {professor.courses.map((course, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-medium">{course.code}</div>
                  <div className="text-sm text-muted-foreground">{course.name}</div>
                </div>
                <Badge variant="outline">{course.semester}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {professor.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Reviews
            </CardTitle>
            <Button>Write a Review</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="recent">Most Recent</TabsTrigger>
              <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{review.course}</Badge>
                        <Badge variant="secondary">{review.semester}</Badge>
                        <Badge variant="outline">Grade: {review.grade}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="font-medium">{review.overall}.0</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          Would take again: {review.wouldTakeAgain ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      👍 {review.helpful}
                    </Button>
                  </div>
                  
                  <p className="text-sm mb-3">{review.comment}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
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