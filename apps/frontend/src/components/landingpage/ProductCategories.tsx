"use client";
import React from "react";
import BorderlessCard from "./CardCategory";

const cardData = [
  {
    productName: "ios",
    category: "Apple",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/apple_t6b7my.png",
    backgroundColor: "#F43F5E", // Rose 500
    link: "/category/apple",
  },
  {
    productName: "Bluetooths",
    category: "Speakers",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/speakers_rfiz7v.png",
    backgroundColor: "#FACC15", // Yellow 400
    link: "/category/speakers",
  },
  {
    productName: "Watches",
    category: "Handband",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/handband_crl0o1.png",
    backgroundColor: "#1F2937", // Gray 800
    link: "/category/handband",
  },
  {
    productName: "Accessories",
    category: "Mouse",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/mouse_cm3v2k.png",
    backgroundColor: "#3B82F6", // Blue 500
    link: "/category/mouse",
  },
  {
    productName: "Androids",
    category: "Mobile",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/mobile_cy7ugt.png",
    backgroundColor: "#10B981", // Emerald 500
    link: "/category/mobile",
  },
  {
    productName: "Laptops",
    category: "MacBook",
    imageUrl:
      "https://res.cloudinary.com/ds83mhjcm/image/upload/v1719573351/SwapConnect/home/categories/macbook_hdscrm.png",
    backgroundColor: "#0EA5E9", // Sky 500
    link: "/category/macbook",
  },
];

const ProductCategories: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <BorderlessCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
