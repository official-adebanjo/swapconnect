import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSectionComponent = () => {
  return (
    <section className="bg-[#04512d] p-12 rounded-[10px] mt-0 md:mt-0 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        {/* Image Column */}
        <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
          <Image
            src="https://res.cloudinary.com/ds83mhjcm/image/upload/v1719932255/SwapConnect/swap/swap_hero_ehzmko.png"
            alt="Swap Hero"
            width={500}
            height={400}
            className="rounded-lg object-contain w-full h-auto"
            priority
          />
        </div>
        {/* Text Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Welcome <br /> Upgrade Your tech, <br /> Simplify Your Life!
          </h1>
          <p className="text-white text-sm text-justify mb-6">
            We&apos;re thrilled to introduce our new Device Swapping feature,
            designed to make upgrading your mobile phones or PCs a breeze! At{" "}
            <strong className="text-[#d7a825]">SwapConnect</strong>, we
            understand the importance of staying up-to-date with the latest
            technology. Whether you&apos;re eyeing that shiny new smartphone or
            a powerful PC upgrade, our swapping process is here to elevate your
            tech experience. Say goodbye to the hassle of selling your old
            device privately. Our swapping process is quick, easy, and
            hassle-free.
          </p>
          <Link href="/trade-in-calculator" className="w-fit">
            <span className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition-colors duration-200">
              Proceed
              <ChevronRight size={18} className="ml-2" />
              <ChevronRight size={18} className="-ml-2 opacity-70" />
              <ChevronRight size={18} className="-ml-2 opacity-40" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionComponent;
