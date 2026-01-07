import { HeroSection } from '../components/landing/HeroSection';
import { ChallengeSection } from '../components/landing/ChallengeSection';
import { PillarsSection } from '../components/landing/PillarsSection';
import { AutonomySection } from '../components/landing/AutonomySection';
import { DealbreakersSection } from '../components/landing/DealbreakersSection';
import { EvaluationSection } from '../components/landing/EvaluationSection';
import { CTASection } from '../components/landing/CTASection';
import { AboutUs } from '../components/landing/aboutUs';

export function LandingPage() {
  return (
    <>
      <div className="paper-texture" />
      <HeroSection />
      <AboutUs />
      <ChallengeSection />
      <PillarsSection />
      <AutonomySection />
      <DealbreakersSection />
      <EvaluationSection />
      <CTASection />
    </>
  );
}

