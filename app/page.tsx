import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity, Brain, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'healthpredict AI - Home',
  description: 'Welcome to healthpredict AI - Your AI-powered health prediction platform',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">healthpredict AI</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">login</Button>
            </Link>
            <Link href="/register">
              <Button>get started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              predict, prevent, protect.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            managing chronic conditions with personalized health insights.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg">
                start your health journey
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              key features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="health predictions"
              description="machine learning predicts your next health disaster—you're welcome. panic now, thank me later."
            />
            <FeatureCard
              icon={Activity}
              title="real-time monitoring"
              description="it’s like a tiny doctor in your pocket, watching your every move. creepy, but useful."
            />
            <FeatureCard
              icon={Shield}
              title="data security"
              description="your health data's locked up tighter than my secret taco stash. only hackers can ruin this party."
            />
          </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 healthpredict AI. all rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <Icon className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}