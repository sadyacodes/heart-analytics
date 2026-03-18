import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="px-8 py-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025. Built with</span>
            <Heart className="w-4 h-4 text-primary fill-current" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              caffeine.ai
            </a>
          </div>
          <div className="text-xs text-muted-foreground max-w-2xl">
            <strong className="text-foreground">Medical Disclaimer:</strong> This tool provides AI-based risk assessments for educational purposes only. 
            Results are not a substitute for professional medical advice, diagnosis, or treatment.
          </div>
        </div>
      </div>
    </footer>
  );
}
