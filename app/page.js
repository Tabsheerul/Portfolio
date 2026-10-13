import HeroSection from '@/components/hero/HeroSection';
import SectionTransition from '@/components/transitions/SectionTransition';
import SystemArchitecture from '@/components/diagram/SystemArchitecture';
import AboutSection from '@/components/about/AboutSection';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectList from '@/components/projects/ProjectList';
import SectionTransitionProjects from '@/components/transitions/SectionTransitionProjects';
import SkillsHeader from '@/components/skills/SkillsHeader';
import SkillsMarquee from '@/components/skills/SkillsMarquee';
import SkillsGrid from '@/components/skills/SkillsGrid';
import FreelanceImpact from '@/components/testimonials/FreelanceImpact';
import RecognitionSection from '@/components/recognition/RecognitionSection';
import ContactSection from '@/components/contact/ContactSection';

export default function Home() {
  return (
    <>
      {/* PART 2 */}
      <HeroSection />
      <SectionTransition />
      <SystemArchitecture />
      <AboutSection />
      
      {/* PART 3 */}
      <ProjectsHeader />
      <ProjectList />
      <SectionTransitionProjects />
      <SkillsHeader />
      <SkillsMarquee />
      <SkillsGrid />
      <FreelanceImpact />
      <RecognitionSection />
      
      {/* PART 4 */}
      <ContactSection />
    </>
  );
}
