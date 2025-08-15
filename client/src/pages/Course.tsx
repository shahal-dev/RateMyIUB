import { useParams } from "react-router-dom";
import { BookOpen, Users, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RatingDisplay from "@/components/RatingDisplay";

const Course = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const course = {
    code: "CSE101",
    name: "Programming Fundamentals",
    department: "Computer Science & Engineering",
    credits: 3,
    description: "Introduction to programming concepts using C++. Covers variables, control structures, functions, arrays, and basic object-oriented programming.",
    totalReviews: 234,
    overallRating: 4.2,
    instructors: [
      {
        id: 1,
        name: "Dr. Sarah Rahman",
        rating: 4.8,
        reviews: 156,
        wouldTakeAgain: 0.94
      },
      {
        id: 2,
        name: "Prof. Ahmed Hassan",
        rating: 3.9,
        reviews: 78,
        wouldTakeAgain: 0.82
      }
    ]
  };

  const reviews = [
    {
      id: 1,
      instructor: "Dr. Sarah Rahman",
      semester: "Fall 2024",
      overall: 5,
      difficulty: 3,
      workload: 4,
      comment: "Great introduction to programming. Dr. Rahman explains concepts very clearly.",
      tags: ["Clear Explanation", "Good Examples"],
      helpful: 15
    },
    {
      id: 2,
      instructor: "Prof. Ahmed Hassan",
      semester: "Spring 2024",
      overall: 4,
      difficulty: 4,
      workload: 5,
      comment: "Challenging but rewarding. Heavy workload but you learn a lot.",
      tags: ["Challenging", "Heavy Projects"],
      helpful: 8
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                {course.code} - {course.name}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{course.department}</p>
              <p className="text-sm text-muted-foreground">Credits: {course.credits}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{course.overallRating}</span>
              </div>
              <p className="text-sm text-muted-foreground">{course.totalReviews} reviews</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{course.description}</p>
        </CardContent>
      </Card>

      {/* Instructors Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Compare Instructors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {course.instructors.map((instructor) => (
              <Card key={instructor.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{instructor.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{instructor.rating}</span>
                  </div>
                </div>
                
                <RatingDisplay 
                  overall={instructor.rating}
                  totalReviews={instructor.reviews}
                  wouldTakeAgain={instructor.wouldTakeAgain}
                  size="sm"
                />
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                >
                  View Professor Profile
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3.6</div>
            <p className="text-sm text-muted-foreground">Average difficulty rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Workload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3.8</div>
            <p className="text-sm text-muted-foreground">Average workload rating</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">87%</div>
            <p className="text-sm text-muted-foreground">Would recommend this course</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Student Reviews
            </CardTitle>
            <Button>Write a Review</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Instructors</TabsTrigger>
              <TabsTrigger value="sarah">Dr. Sarah Rahman</TabsTrigger>
              <TabsTrigger value="ahmed">Prof. Ahmed Hassan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{review.instructor}</Badge>
                        <Badge variant="secondary">{review.semester}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary text-primary" />
                          <span>{review.overall}.0</span>
                        </div>
                        <span>Difficulty: {review.difficulty}</span>
                        <span>Workload: {review.workload}</span>
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

export default Course;