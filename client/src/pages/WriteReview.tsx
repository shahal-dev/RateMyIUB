import { useState, useEffect } from "react";
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
import { SignInButton, useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { CONTROLLED_TAGS } from '@shared/schema';

const WriteReview = () => {
  const { isSignedIn, user } = useUser();
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
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [section, setSection] = useState("");
  const [wouldTakeAgain, setWouldTakeAgain] = useState<boolean | null>(null);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [delivery, setDelivery] = useState<'in_person' | 'online' | 'hybrid' | ''>('');
  const [attendanceMandatory, setAttendanceMandatory] = useState<boolean | null>(null);
  const [gradeReceived, setGradeReceived] = useState<'A' | 'B' | 'C' | 'D' | 'F' | 'W' | 'NA' | ''>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = CONTROLLED_TAGS;

  // Fetch professors and courses
  const { data: professors = [] } = useQuery({
    queryKey: ['professors'],
    queryFn: async () => {
      const response = await fetch('/api/professors');
      return response.json();
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      return response.json();
    },
  });

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              You need to sign in with your IUB email to write a review.
            </p>
            <SignInButton mode="modal">
              <Button>Sign In to Continue</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProfessor || !selectedCourse || !semester || !year) {
      alert('Please fill in all required fields.');
      return;
    }

    if (ratings.overall === 0) {
      alert('Please provide an overall rating.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getToken()}`,
        },
        body: JSON.stringify({
          professorId: selectedProfessor,
          courseId: selectedCourse,
          semester,
          year,
          section: section || null,
          overall: ratings.overall,
          clarity: ratings.clarity || null,
          engagement: ratings.engagement || null,
          fairness: ratings.fairness || null,
          grading: ratings.grading || null,
          workload: ratings.workload || null,
          difficulty: ratings.difficulty || null,
          wouldTakeAgain,
          recommend,
          delivery: delivery || null,
          attendanceMandatory,
          gradeReceived: gradeReceived || null,
          hoursPerWeek: hoursPerWeek || null,
          tags: selectedTags,
          comment: comment.trim() || null,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        // Reset form
        setRatings({
          overall: 0,
          clarity: 0,
          engagement: 0,
          fairness: 0,
          grading: 0,
          workload: 0,
          difficulty: 0
        });
        setSelectedTags([]);
        setComment('');
        setSelectedProfessor('');
        setSelectedCourse('');
        setSemester('');
        setSection('');
        setWouldTakeAgain(null);
        setRecommend(null);
        setDelivery('');
        setAttendanceMandatory(null);
        setGradeReceived('');
        setHoursPerWeek('');
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={handleSubmit}>
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
                <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professors.map((prof: any) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.titleEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Semester & Year */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">Spring</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                    <SelectItem value="Autumn">Autumn</SelectItem>
                    <SelectItem value="Fall">Fall</SelectItem>
                    <SelectItem value="Winter">Winter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                  min={2020}
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g., 01, 02"
                />
              </div>
            </div>

            {/* Rating Section */}
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Would you take this course again?</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={wouldTakeAgain === true ? 'default' : 'outline'}
                    onClick={() => setWouldTakeAgain(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={wouldTakeAgain === false ? 'default' : 'outline'}
                    onClick={() => setWouldTakeAgain(false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Would you recommend this professor?</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={recommend === true ? 'default' : 'outline'}
                    onClick={() => setRecommend(true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={recommend === false ? 'default' : 'outline'}
                    onClick={() => setRecommend(false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>

            {/* Delivery & Grade */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Delivery Mode</Label>
                <Select value={delivery} onValueChange={(value: any) => setDelivery(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_person">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grade Received</Label>
                <Select value={gradeReceived} onValueChange={(value: any) => setGradeReceived(value)}>
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
              <div className="space-y-2">
                <Label>Hours per Week</Label>
                <Input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || '')}
                  placeholder="e.g., 10"
                  min={1}
                  max={40}
                />
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
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your detailed experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={600}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/600 characters
              </p>
            </div>

            {/* Community Guidelines */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please keep your review honest, respectful, and constructive. Avoid personal attacks or inappropriate content.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8" 
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default WriteReview;