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
      
      <main className="min-h-screen">
        <div className="container py-12 px-4 md:py-16">
          <TubeFinder />
        </div>
        
        {/* Footer */}
        <footer className="border-t border-primary/10 py-6 bg-gradient-aubergine">
          <div className="container text-center text-sm text-white/80">
            <p>Enter your tire size to find compatible inner tubes.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Index;
