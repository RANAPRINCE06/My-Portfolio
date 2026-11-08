import React from 'react';
import {
  HeroSection,
  LiveTelemetry,
  ProjectsSection,
  BentoShowcase,
  ContactSection,
} from '@/components/sections';

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 sm:gap-28 md:gap-32">
      <HeroSection />
      <LiveTelemetry />
      <ProjectsSection />
      <BentoShowcase />
      <ContactSection />
    </div>
  );
}
