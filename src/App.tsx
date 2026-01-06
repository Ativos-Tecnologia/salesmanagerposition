import { HeroSection } from './components/HeroSection';
import { ChallengeSection } from './components/ChallengeSection';
import { PillarsSection } from './components/PillarsSection';
import { AutonomySection } from './components/AutonomySection';
import { DealbreakersSection } from './components/DealbreakersSection';
import { EvaluationSection } from './components/EvaluationSection';
import { CTASection } from './components/CTASection';

function App() {
  return (
    <>
      <div className="paper-texture" />
      <HeroSection />
      <ChallengeSection />
      <PillarsSection />
      <AutonomySection />
      <DealbreakersSection />
      <EvaluationSection />
      <CTASection />
    </>
  );
}

export default App;
