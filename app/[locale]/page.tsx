// import { getTranslations } from 'next-intl/server';
// import HeroUploadSection from '@/components/home/HeroUploadSection';

// export default async function HomePage() {
//   const t = await getTranslations('Index');

//   return (
//     <div className="flex-1 flex flex-col p-6 md:p-10 bg-background">
//       <div className="max-w-6xl mx-auto w-full space-y-6">
//         <div className="space-y-4 max-w-3xl">
//           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
//             Élevez la précision de vos recrutements.
//           </h1>
//           <p className="text-base text-muted-foreground leading-relaxed">
//             Analysez instantanément les CV par rapport aux descriptions de poste. Découvrez les meilleurs talents plus rapidement grâce à notre cartographie des compétences par l'IA et notre score de correspondance prédictif.
//           </p>
//         </div>

//         <HeroUploadSection />
//       </div>
//     </div>
//   );
// }

import HeroSection from "@/components/home/HeroSection";
import CVCarousel from "@/components/home/CVCarousel";
import HowItWorks from "@/components/home/HowItWorks";
// import FeaturesSection from '@/components/home/FeaturesSection';
import PricingSection from "@/components/home/PricingSection";
import HeroUploadSection from "@/components/home/HeroUploadSection";
import PaymentSync from "@/components/results/PaymentSync";

export default async function HomePage() {
  return (
    <div className="flex-1 flex flex-col overflow-x-hidden">
      <PaymentSync />
      <HeroSection />

      <section id="analyze" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <HeroUploadSection />
      </section>

      <HowItWorks />

      <CVCarousel />

      {/* <FeaturesSection /> */}

      <PricingSection />
    </div>
  );
}
