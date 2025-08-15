import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Cpu, 
  DollarSign, 
  FlaskConical, 
  Leaf, 
  Mic, 
  BookOpen,
  Building
} from "lucide-react";

const departments = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    nameBn: "কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং",
    code: "CSE",
    icon: Code,
    professors: 24,
    courses: 45,
    reviews: 1240
  },
  {
    id: "eee",
    name: "Electrical & Electronic Engineering", 
    nameBn: "ইলেকট্রিক্যাল ও ইলেকট্রনিক ইঞ্জিনিয়ারিং",
    code: "EEE",
    icon: Cpu,
    professors: 18,
    courses: 38,
    reviews: 892
  },
  {
    id: "bba",
    name: "Business Administration",
    nameBn: "ব্যবসায় প্রশাসন",
    code: "BBA", 
    icon: DollarSign,
    professors: 22,
    courses: 52,
    reviews: 1015
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    nameBn: "ফার্মেসি",
    code: "PHARM",
    icon: FlaskConical,
    professors: 16,
    courses: 34,
    reviews: 623
  },
  {
    id: "env",
    name: "Environmental Science",
    nameBn: "পরিবেশ বিজ্ঞান",
    code: "ENV",
    icon: Leaf,
    professors: 12,
    courses: 28,
    reviews: 445
  },
  {
    id: "media",
    name: "Media & Communication",
    nameBn: "মিডিয়া ও যোগাযোগ", 
    code: "MEDIA",
    icon: Mic,
    professors: 14,
    courses: 31,
    reviews: 567
  },
  {
    id: "eng",
    name: "English",
    nameBn: "ইংরেজি",
    code: "ENG",
    icon: BookOpen,
    professors: 15,
    courses: 26,
    reviews: 389
  },
  {
    id: "arch",
    name: "Architecture",
    nameBn: "স্থাপত্য",
    code: "ARCH",
    icon: Building,
    professors: 11,
    courses: 22,
    reviews: 298
  }
];

const DepartmentGrid = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Browse by Department</h2>
        <p className="text-muted-foreground">Explore professors and courses across all IUB departments</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map((dept) => {
          const IconComponent = dept.icon;
          return (
            <Card key={dept.id} className="group hover:shadow-elevated transition-smooth cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-muted-foreground">{dept.code}</div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{dept.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{dept.nameBn}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-primary">{dept.professors}</div>
                    <div className="text-xs text-muted-foreground">Professors</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-primary">{dept.courses}</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-primary">{dept.reviews}</div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-smooth"
                >
                  Explore {dept.code}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentGrid;