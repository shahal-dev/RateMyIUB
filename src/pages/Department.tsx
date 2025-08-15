import { useParams } from "react-router-dom";
import { Building2, BookOpen, Users, Star, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Department = () => {
  const { id } = useParams();

  // Mock data - in real app, fetch based on ID
  const department = {
    code: "CSE",
    name: "Computer Science & Engineering",
    description: "The Department of Computer Science & Engineering offers comprehensive programs in software development, algorithms, data structures, and emerging technologies.",
    totalProfessors: 24,
    totalCourses: 45,
    totalReviews: 1240,
    averageRating: 4.3
  };

  const professors = [
    {
      id: 1,
      name: "Dr. Sarah Rahman",
      courses: ["CSE101", "CSE203", "CSE305"],
      rating: 4.8,
      reviews: 156,
      specialization: "Software Engineering"
    },
    {
      id: 2,
      name: "Prof. Ahmed Hassan",
      courses: ["CSE102", "CSE204", "CSE306"],
      rating: 4.1,
      reviews: 89,
      specialization: "Data Structures & Algorithms"
    },
    {
      id: 3,
      name: "Dr. Fatima Khan",
      courses: ["CSE301", "CSE401", "CSE501"],
      rating: 4.5,
      reviews: 67,
      specialization: "Machine Learning"
    }
  ];

  const courses = [
    {
      code: "CSE101",
      name: "Programming Fundamentals",
      credits: 3,
      rating: 4.2,
      reviews: 234,
      difficulty: 3.1
    },
    {
      code: "CSE203",
      name: "Data Structures",
      credits: 3,
      rating: 4.0,
      reviews: 198,
      difficulty: 3.8
    },
    {
      code: "CSE305",
      name: "Database Systems",
      credits: 3,
      rating: 4.3,
      reviews: 156,
      difficulty: 3.5
    },
    {
      code: "CSE401",
      name: "Machine Learning",
      credits: 3,
      rating: 4.6,
      reviews: 89,
      difficulty: 4.2
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Department Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                {department.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Department Code: {department.code}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <span className="text-2xl font-bold">{department.averageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground">{department.totalReviews} reviews</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{department.description}</p>
        </CardContent>
      </Card>

      {/* Department Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{department.totalProfessors}</div>
            <div className="text-sm text-muted-foreground">Professors</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{department.totalCourses}</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{department.totalReviews}</div>
            <div className="text-sm text-muted-foreground">Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input 
              placeholder="Search professors or courses..." 
              className="flex-1"
            />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 Level</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
                <SelectItem value="300">300 Level</SelectItem>
                <SelectItem value="400">400 Level</SelectItem>
                <SelectItem value="500">500 Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Professors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Professors ({department.totalProfessors})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professors.map((prof) => (
              <Card key={prof.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{prof.name}</h3>
                    <p className="text-sm text-muted-foreground">{prof.specialization}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{prof.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {prof.courses.map((course) => (
                      <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{prof.reviews} reviews</p>
                </div>
                
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Courses ({department.totalCourses})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.code} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{course.code}</h3>
                      <Badge variant="outline">{course.credits} credits</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{course.reviews} reviews</span>
                      <span>Difficulty: {course.difficulty}/5</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Course
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Department;