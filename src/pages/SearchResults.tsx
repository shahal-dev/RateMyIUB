import { useSearchParams } from "react-router-dom";
import { Search, Filter, Users, BookOpen, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results
  const results = {
    professors: [
      {
        id: 1,
        name: "Dr. Sarah Rahman",
        department: "Computer Science & Engineering",
        rating: 4.8,
        reviews: 156,
        courses: ["CSE101", "CSE203", "CSE305"]
      },
      {
        id: 2,
        name: "Prof. Ahmed Hassan",
        department: "Business Administration",
        rating: 4.1,
        reviews: 89,
        courses: ["BBA201", "BBA301"]
      }
    ],
    courses: [
      {
        code: "CSE101",
        name: "Programming Fundamentals",
        department: "Computer Science & Engineering",
        rating: 4.2,
        reviews: 234,
        instructors: ["Dr. Sarah Rahman", "Prof. Ahmed Hassan"]
      },
      {
        code: "BBA201",
        name: "Financial Management",
        department: "Business Administration",
        rating: 4.0,
        reviews: 156,
        instructors: ["Prof. Ahmed Hassan"]
      }
    ],
    departments: [
      {
        code: "CSE",
        name: "Computer Science & Engineering",
        professors: 24,
        courses: 45,
        rating: 4.3
      }
    ]
  };

  const totalResults = results.professors.length + results.courses.length + results.departments.length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search professors, courses, or departments..." 
                  defaultValue={query}
                  className="pl-10"
                />
              </div>
            </div>
            <Button>Search</Button>
          </div>
        </CardHeader>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Search Results for "{query}"
        </h1>
        <p className="text-muted-foreground">
          {totalResults} results found
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="bba">Business</SelectItem>
                <SelectItem value="eee">Electrical Engineering</SelectItem>
                <SelectItem value="env">Environmental Science</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4+">4+ Stars</SelectItem>
                <SelectItem value="3+">3+ Stars</SelectItem>
                <SelectItem value="2+">2+ Stars</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Course Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 Level</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
                <SelectItem value="300">300 Level</SelectItem>
                <SelectItem value="400">400 Level</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
          <TabsTrigger value="professors">Professors ({results.professors.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({results.courses.length})</TabsTrigger>
          <TabsTrigger value="departments">Departments ({results.departments.length})</TabsTrigger>
        </TabsList>

        {/* All Results */}
        <TabsContent value="all" className="space-y-4 mt-6">
          {/* Professors */}
          {results.professors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Professors
              </h3>
              {results.professors.map((prof) => (
                <Card key={prof.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{prof.name}</h4>
                      <p className="text-sm text-muted-foreground">{prof.department}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prof.courses.map((course) => (
                          <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{prof.rating}</div>
                      <p className="text-xs text-muted-foreground">{prof.reviews} reviews</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Courses */}
          {results.courses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Courses
              </h3>
              {results.courses.map((course) => (
                <Card key={course.code} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{course.code} - {course.name}</h4>
                      <p className="text-sm text-muted-foreground">{course.department}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.instructors.map((instructor) => (
                          <Badge key={instructor} variant="outline" className="text-xs">{instructor}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{course.rating}</div>
                      <p className="text-xs text-muted-foreground">{course.reviews} reviews</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Departments */}
          {results.departments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Departments
              </h3>
              {results.departments.map((dept) => (
                <Card key={dept.code} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {dept.professors} professors • {dept.courses} courses
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{dept.rating}</div>
                      <p className="text-xs text-muted-foreground">avg rating</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Individual tabs would show filtered results */}
        <TabsContent value="professors" className="space-y-4 mt-6">
          {results.professors.map((prof) => (
            <Card key={prof.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{prof.name}</h4>
                  <p className="text-sm text-muted-foreground">{prof.department}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {prof.courses.map((course) => (
                      <Badge key={course} variant="secondary" className="text-xs">{course}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{prof.rating}</div>
                  <p className="text-xs text-muted-foreground">{prof.reviews} reviews</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 mt-6">
          {results.courses.map((course) => (
            <Card key={course.code} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{course.code} - {course.name}</h4>
                  <p className="text-sm text-muted-foreground">{course.department}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {course.instructors.map((instructor) => (
                      <Badge key={instructor} variant="outline" className="text-xs">{instructor}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{course.rating}</div>
                  <p className="text-xs text-muted-foreground">{course.reviews} reviews</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="departments" className="space-y-4 mt-6">
          {results.departments.map((dept) => (
            <Card key={dept.code} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {dept.professors} professors • {dept.courses} courses
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{dept.rating}</div>
                  <p className="text-xs text-muted-foreground">avg rating</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;