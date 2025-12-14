import { TubeFinder } from "@/components/TubeFinder/TubeFinder";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Bicycle Inner Tube Finder | Find the Right Tube for Your Tire</title>
        <meta 
          name="description" 
          content="Find the perfect inner tube for your bicycle tire. Enter your tire size and get matched with compatible tubes instantly. Supports road, MTB, gravel, and kids' bikes."
        />
      </Helmet>
      
      <main className="min-h-screen bg-background">
        <div className="container py-12 px-4 md:py-16">
          <TubeFinder />
        </div>
        
        {/* Footer */}
        <footer className="border-t border-border py-6">
          <div className="container text-center text-sm text-muted-foreground">
            <p>Enter your tire size to find compatible inner tubes.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;
