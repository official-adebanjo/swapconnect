// src/app/auth/CenterCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CenterCardProps {
  children: React.ReactNode;
  leftImageSrc: string;
  leftImageAlt: string;
  leftLogoSrc: string;
}

const CenterCard: React.FC<CenterCardProps> = ({
  children,
  leftImageSrc,
  leftImageAlt,
  leftLogoSrc,
}) => {
  return (
    <div className="flex justify-center items-center h-full w-full overflow-hidden">
      <div
        className="max-w-4xl w-full rounded-2xl shadow-xl overflow-hidden
                      flex flex-col md:flex-row max-h-[95vh]"
      >
        {/* Left Section (Image and Logo) */}
        <div
          className="md:w-1/2 bg-green-700 flex flex-col items-center justify-center p-6 md:p-8 text-white
                        min-h-0                   
                        sm:h-auto sm:max-h-56     
                        md:max-h-none             
                        hidden sm:flex           
                        "
        >
          <Link href="/" passHref className="mb-6 mt-4">
            <Image
              src={leftLogoSrc}
              alt="Logo"
              width={180}
              height={50}
              className="object-contain"
            />
          </Link>

          <Image
            src={leftImageSrc}
            alt={leftImageAlt}
            width={400}
            height={400}
            className="object-contain w-full h-auto max-w-[200px] sm:max-w-xs md:max-w-none p-0"
            priority
          />
        </div>

        {/* Right Section (Form/Content Area) */}
        <div
          className="md:w-1/2 bg-white flex flex-col justify-center p-6 md:p-8
                        overflow-y-auto          
                        min-h-0                   
                        flex-grow                
                        "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CenterCard;
