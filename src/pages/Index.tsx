import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Home from "./Home";
import Professor from "./Professor";
import Course from "./Course";
import Department from "./Department";
import SearchResults from "./SearchResults";
import WriteReview from "./WriteReview";

const Index = () => {
  const location = useLocation();
  
  const renderContent = () => {
    if (location.pathname.startsWith('/professor/')) return <Professor />;
    if (location.pathname.startsWith('/course/')) return <Course />;
    if (location.pathname.startsWith('/department/')) return <Department />;
    if (location.pathname === '/search') return <SearchResults />;
    if (location.pathname === '/write-review') return <WriteReview />;
    return <Home />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
