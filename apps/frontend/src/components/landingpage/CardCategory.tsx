"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BorderlessCardProps {
  productName: string;
  category: string;
  imageUrl: string;
  backgroundColor: string;
  link: string;
}

const BorderlessCard: React.FC<BorderlessCardProps> = ({
  productName,
  category,
  imageUrl,
  backgroundColor,
  link,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <Link href={link} passHref>
      <div
        className="relative flex flex-col justify-start p-6 rounded-2xl overflow-hidden h-60 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl group"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        {/* Text content */}
        <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          <p className="uppercase text-white/80 text-xs font-bold tracking-wider mb-1">
            {productName}
          </p>
          <h3 className="text-white font-extrabold text-4xl leading-tight mb-4 uppercase drop-shadow-sm">
            {category}
          </h3>
          <button
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-2 cursor-pointer rounded-full text-sm font-bold hover:bg-white transition-colors duration-200"
            type="button"
            onClick={(e) => e.stopPropagation()}
          >
            Check
          </button>
        </div>

        {/* Image positioned absolutely to the bottom right */}
        <div className="absolute right-0 bottom-0 z-0 w-full h-full flex items-end justify-end group">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 bg-white/10" />
          )}
          <Image
            src={imageUrl}
            alt={category}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "auto",
              height: "80%",
              maxHeight: "180px",
              objectFit: "contain",
            }}
            className={cn(
              "object-contain transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3",
              isImageLoading ? "opacity-0" : "opacity-100",
            )}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </div>
      </div>
    </Link>
  );
};

export default BorderlessCard;
