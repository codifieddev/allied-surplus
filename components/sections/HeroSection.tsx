// "use client";

// import React, { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { motion, AnimatePresence } from "motion/react";
// import { Link } from "@/lib/router";
// import { cn } from "@/lib/utils";
// import { useParams } from "next/navigation";

// const heroSlides = [
//   {
//     title: "Custom Dog Tags  ",
//     description:
//       "Authentic stainless-steel military dog tags engraved with any text. Perfect for veterans, service members, and gifts.",
//     buttonText: "Customize Now",
//     buttonLink: "/shop",
//     image:
//       "https://alliedsurplus.com/wp-content/uploads/2019/10/Dog_Tags_Small_Banner.jpg",
//   },
//   {
//     title: "Forged for the Field",
//     description:
//       "Premium military-grade tactical gear trusted by veterans, law enforcement, and outdoor professionals across the nation.",
//     buttonText: "Shop Now",
//     buttonLink: "/shop",
//     image:
//       "https://alliedsurplus.com/wp-content/uploads/2019/10/WideBanner.jpg",
//   },
//   {
//     title: "Built for Every Mission",
//     description:
//       "Combat-tested boots and tactical footwear from Belleville, Bates, Reebok, and Propper. Berry compliant, waterproof and field-ready.",
//     buttonText: "Shop Footwear",
//     buttonLink: "/shop",
//     image: "https://alliedsurplus.com/wp-content/uploads/2019/10/Reebok2.jpg",
//   },
// ];

// const autoplayTime = 5000;

// interface HeroSectionProps {
//   heroSection: any;
//   showToast?: (msg: string) => void;
// }

// export default function HeroSection({
//   heroSection,
//   showToast,
// }: HeroSectionProps) {
//   const crousel = heroSection?.columns[0]?.find(
//     (section: any) => section.type === "carousel",
//   );
//   const { locale } = useParams();
//   const [activeSlide, setActiveSlide] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveSlide((prev) => (prev + 1) % heroSlides.length);
//     }, autoplayTime);

//     return () => clearInterval(timer);
//   }, []);

//   const nextSlide = () => {
//     setActiveSlide((prev) => (prev + 1) % heroSlides.length);
//   };

//   const prevSlide = () => {
//     setActiveSlide(
//       (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
//     );
//   };

//   return (
//     <section className="relative overflow-hidden">
//       <div className="relative h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] w-full">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeSlide}
//             initial={{ opacity: 0.4 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0.4 }}
//             transition={{ duration: 0.5 }}
//             className="absolute inset-0"
//           >
//             <img
//               src={heroSlides[activeSlide].image}
//               alt={heroSlides[activeSlide].title}
//               className="h-full w-full object-cover"
//             />

//             <div className="absolute inset-0 bg-black/45" />

//             <div className="absolute inset-0 flex items-center">
//               <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//                 <motion.div
//                   initial={{ opacity: 0, y: 24 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="max-w-2xl text-white"
//                 >
//                   <h1 className="text-4xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-8xl">
//                     {heroSlides[activeSlide].title}
//                   </h1>

//                   <p className="mt-4 text-sm leading-6 text-white/85 sm:text-base md:text-lg">
//                     {heroSlides[activeSlide].description}
//                   </p>

//                   <div className="mt-6">
//                     <Link
//                       href={heroSlides[activeSlide].buttonLink}
//                       className="inline-flex items-center justify-center rounded-none bg-red-600 px-6 py-4 text-md font-semibold text-white transition hover:bg-red-700"
//                     >
//                       {/* {heroSlides[activeSlide].buttonText} */}
//                       CUSTOMIZE NOW
//                     </Link>
//                     <Link
//                       href={heroSlides[activeSlide].buttonLink}
//                       className="ms-4 inline-flex items-center justify-center rounded-none bg-transprant  px-8 py-4 text-md font-semibold text-white transition hover:bg-white/10 border border-white"
//                     >
//                       {/* {heroSlides[activeSlide].buttonText} */}
//                       LEARN MORE
//                     </Link>
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>

//         <button
//           onClick={prevSlide}
//           aria-label="Previous Slide"
//           className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
//         >
//           <ChevronLeft className="h-5 w-5" />
//         </button>

//         <button
//           onClick={nextSlide}
//           aria-label="Next Slide"
//           className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
//         >
//           <ChevronRight className="h-5 w-5" />
//         </button>

//         <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
//           {heroSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//               className={cn(
//                 "h-2.5 w-2.5 rounded-full transition-all",
//                 activeSlide === index
//                   ? "bg-white w-7"
//                   : "bg-white/50 hover:bg-white/80",
//               )}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const autoplayTime = 5000;

interface HeroSectionProps {
  heroSection: any;
  showToast?: (msg: string) => void;
}

export default function HeroSection({
  heroSection,
  showToast,
}: HeroSectionProps) {
  const { locale } = useParams();
  const currentLocale = (locale as string) || "en";
  const carousel = heroSection?.columns[0]?.find(
    (section: any) => section.type === "carousel",
  );

  // Transform carousel data into slides format
  const slides =
    carousel?.items?.map((item: any) => {
      const column = item.columns?.[0] || [];

      const heading = column.find((block: any) => block.type === "heading");
      const paragraph = column.find((block: any) => block.type === "paragraph");
      const buttonBlock = column.find((block: any) => block.type === "button");
      const buttons = buttonBlock?.buttons || [];

      return {
        id: item.id,
        title: heading?.text?.[currentLocale] || heading?.text?.en || "",
        description:
          paragraph?.text?.[currentLocale] || paragraph?.text?.en || "",
        buttons: buttons.map((btn: any) => ({
          id: btn.id,
          label: btn.label?.[currentLocale] || btn.label?.en || "",
          link: btn.link || "#",
          actionType: btn.actionType || "link",
        })),
        // You'll need to add image URLs to your data structure
        // For now, using fallback images
        image: item.image || getDefaultImage(item.adminTitle),
      };
    }) || [];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, autoplayTime);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Fallback if no slides
  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] sm:h-[500px] md:h-[580px] lg:h-[640px] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.4 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl text-white"
                >
                  <h1 className="text-4xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-8xl">
                    {slides[activeSlide].title}
                  </h1>

                  <p className="mt-4 text-sm leading-6 text-white/85 sm:text-base md:text-lg">
                    {slides[activeSlide].description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-4">
                    {slides[activeSlide].buttons.map((button: any) => (
                      <Link
                        key={button.id}
                        href={button.link}
                        className={cn(
                          "inline-flex items-center justify-center rounded-none px-6 py-4 text-md font-semibold transition",
                          button.id === slides[activeSlide].buttons[0]?.id
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-transparent border border-white text-white hover:bg-white/10",
                        )}
                      >
                        {button.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                activeSlide === index
                  ? "bg-white w-7"
                  : "bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function to get default images based on adminTitle
function getDefaultImage(adminTitle: string): string {
  const imageMap: Record<string, string> = {
    dog_tags:
      "https://alliedsurplus.com/wp-content/uploads/2019/10/Dog_Tags_Small_Banner.jpg",
    FIELD: "https://alliedsurplus.com/wp-content/uploads/2019/10/Reebok2.jpg",
  };

  return (
    imageMap[adminTitle] ||
    "https://alliedsurplus.com/wp-content/uploads/2019/10/WideBanner.jpg"
  );
}
