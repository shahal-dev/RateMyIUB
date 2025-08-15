import { useState } from "react";
import { Star, Send, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WriteReview = () => {
  const [ratings, setRatings] = useState({
    overall: 0,
    clarity: 0,
    engagement: 0,
    fairness: 0,
    grading: 0,
    workload: 0,
    difficulty: 0
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const availableTags = [
    "Clear Explanation",
    "Engaging",
    "Fair Grading",
    "Tough Exams",
    "Lenient Grader",
    "Heavy Projects",
    "Light Workload",
    "Interactive",
    "Attendance Strict",
    "Slides Heavy",
    "Research Oriented",
    "Practical Labs",
    "Group Work",
    "Theory Focused",
    "Curve Grading",
    "Pop Quizzes",
    "Recorded Lectures"
  ];

  const RatingStars = ({ label, value, onChange }: { label: string; value: number; onChange: (rating: number) => void }) => (
    <div className="flex items-center gap-3">
      <Label className="w-24 text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors"
          >
            <Star 
              className={`h-5 w-5 ${star <= value ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted-foreground w-8">{value || '-'}</span>
    </div>
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Write a Review
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Share your honest experience to help fellow IUB students make informed decisions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course & Professor Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professor">Professor *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Dr. Sarah Rahman</SelectItem>
                  <SelectItem value="ahmed">Prof. Ahmed Hassan</SelectItem>
                  <SelectItem value="fatima">Dr. Fatima Khan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse101">CSE101 - Programming Fundamentals</SelectItem>
                  <SelectItem value="cse203">CSE203 - Data Structures</SelectItem>
                  <SelectItem value="cse305">CSE305 - Database Systems</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Semester & Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring2025">Spring 2025</SelectItem>
                  <SelectItem value="fall2024">Fall 2024</SelectItem>
                  <SelectItem value="summer2024">Summer 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input placeholder="e.g., 02" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade">Grade Received</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                  <SelectItem value="W">Withdrew</SelectItem>
                  <SelectItem value="NA">Not Yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rate Your Experience</h3>
            <div className="space-y-3">
              <RatingStars 
                label="Overall" 
                value={ratings.overall} 
                onChange={(rating) => setRatings(prev => ({ ...prev, overall: rating }))}
              />
              <RatingStars 
                label="Clarity" 
                value={ratings.clarity} 
                onChange={(rating) => setRatings(prev => ({ ...prev, clarity: rating }))}
              />
              <RatingStars 
                label="Engagement" 
                value={ratings.engagement} 
                onChange={(rating) => setRatings(prev => ({ ...prev, engagement: rating }))}
              />
              <RatingStars 
                label="Fairness" 
                value={ratings.fairness} 
                onChange={(rating) => setRatings(prev => ({ ...prev, fairness: rating }))}
              />
              <RatingStars 
                label="Grading" 
                value={ratings.grading} 
                onChange={(rating) => setRatings(prev => ({ ...prev, grading: rating }))}
              />
              <RatingStars 
                label="Workload" 
                value={ratings.workload} 
                onChange={(rating) => setRatings(prev => ({ ...prev, workload: rating }))}
              />
              <RatingStars 
                label="Difficulty" 
                value={ratings.difficulty} 
                onChange={(rating) => setRatings(prev => ({ ...prev, difficulty: rating }))}
              />
            </div>
          </div>

          {/* Additional Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Would you take this professor again?</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Would you recommend this course?</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Checkbox />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Mode</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance Mandatory?</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hours">Hours per week</Label>
                <Input type="number" placeholder="e.g., 8" />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags (select all that apply)</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (50-600 characters)</Label>
            <Textarea
              placeholder="Share your experience with this professor and course. Be specific and constructive."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/600 characters
            </div>
          </div>

          {/* Guidelines */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Please keep your review constructive and focused on the academic experience. 
              Avoid personal attacks or sharing personal information. Reviews are anonymous but moderated for quality.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Save as Draft</Button>
            <Button className="shadow-glow">
              Submit Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WriteReview;