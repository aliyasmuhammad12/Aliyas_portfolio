import { FloatingChatWidget } from "@/components/chat/floating-chat-widget";
import { ChatDemoSection } from "@/components/sections/chat-demo";
import { FaqSection } from "@/components/sections/faq-section";
import { FeaturedCaseStudiesSection } from "@/components/sections/featured-case-studies";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { HeroSection } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem-section";
import { TechStackSection } from "@/components/sections/tech-stack";
import { TrustBarSection } from "@/components/sections/trust-bar";
import { TwoWaysSection } from "@/components/sections/two-ways";
import { getFeaturedCaseStudies } from "@/lib/content/posts";

export default function HomePage() {
  const featuredStudies = getFeaturedCaseStudies(3);

  return (
    <>
      <HeroSection />
      <TrustBarSection />
      <TwoWaysSection />
      <TechStackSection />
      <FeaturedCaseStudiesSection studies={featuredStudies} />
      <ProblemSection />
      <ChatDemoSection />
      <FaqSection />
      <FinalCtaSection />
      <FloatingChatWidget />
    </>
  );
}
