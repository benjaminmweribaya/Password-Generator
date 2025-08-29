import PasswordGenerator from '@/components/PasswordGenerator';
import heroImage from '@/assets/hero-security.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Fortify Pass Gen
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Generate ultra-secure passwords with military-grade randomization and advanced customization options
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-security-very-strong rounded-full animate-pulse" />
                <span>Cryptographically Secure</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Privacy First</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-security-strong rounded-full animate-pulse" />
                <span>Local Storage</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <PasswordGenerator />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Fortify Pass Gen. Your passwords are generated locally and never transmitted.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
