import { Header } from "@/components/header"
import { CheckCircle, Sparkles, Shield, Zap, Heart, Github, Twitter } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Elegant Design",
    description: "A refined interface that makes task management a pleasure, not a chore.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant updates and smooth animations keep you in the flow state.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays yours. We never sell or share your information.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            About Ticked
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            The elegant task manager designed for those who appreciate both 
            simplicity and sophistication.
          </p>
        </div>

        {/* Story */}
        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Ticked was born from a simple belief: productivity tools should inspire, 
              not overwhelm. In a world of cluttered apps and endless features, we 
              chose a different path.
            </p>
            <p>
              We crafted Ticked for the discerning individual who values both form 
              and function. Every detail, from the typography to the animations, 
              has been thoughtfully considered to create an experience that feels 
              less like work and more like a ritual.
            </p>
            <p>
              Our mission is to help you focus on what truly matters, 
              elegantly checking off life&apos;s tasks one by one.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
            Why Ticked?
          </h2>
          <div className="grid gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="p-2.5 bg-secondary rounded-lg shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Made With Love */}
        <div className="text-center py-8 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>for the refined organizer</span>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="#"
              className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-foreground" />
            </a>
            <a
              href="#"
              className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-foreground" />
            </a>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Version 1.0.0
        </p>
      </main>
    </div>
  )
}

