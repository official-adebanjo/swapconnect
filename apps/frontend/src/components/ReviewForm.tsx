"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import useReviewStore from "../stores/useReviewStore";

interface ReviewFormProps {
  productTitle?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productTitle = "this product",
}) => {
  const reviews = useReviewStore((state) => state.reviews);
  const form = useReviewStore((state) => state.form);
  const rating = useReviewStore((state) => state.rating);
  const hover = useReviewStore((state) => state.hover);
  const currentReviewIndex = useReviewStore(
    (state) => state.currentReviewIndex,
  );

  const setProductTitle = useReviewStore((state) => state.setProductTitle);
  const loadReviews = useReviewStore((state) => state.loadReviews);
  const handleChange = useReviewStore((state) => state.handleChange);
  const setRating = useReviewStore((state) => state.setRating);
  const setHover = useReviewStore((state) => state.setHover);
  const handleSubmit = useReviewStore((state) => state.handleSubmit);
  const nextReview = useReviewStore((state) => state.nextReview);
  const prevReview = useReviewStore((state) => state.prevReview);

  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    setProductTitle(productTitle);
  }, [productTitle, setProductTitle]);

  useEffect(() => {
    loadReviews(productTitle);
  }, [productTitle, loadReviews]);

  const currentReview = reviews[currentReviewIndex];

  return (
    <div className="my-5 container mx-auto px-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            REVIEWS ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("checkout")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "checkout"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            CHECKOUT
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-xl font-semibold mb-4">Reviews</h5>
              {reviews.length === 0 ? (
                <p className="text-gray-600">There are no reviews yet.</p>
              ) : (
                <div>
                  {currentReview && (
                    <div className="review-carousel flex items-center mb-6 p-4 border rounded-lg shadow-sm">
                      {reviews.length > 1 && (
                        <ChevronLeft
                          size={28}
                          className="cursor-pointer text-gray-600 hover:text-gray-800 mr-2"
                          onClick={prevReview}
                        />
                      )}
                      <div className="flex-grow">
                        <div className="font-bold text-lg mb-1">
                          {currentReview.name}
                        </div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={`mr-1 ${
                                currentReview.rating >= star
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(currentReview.date).toLocaleDateString()}
                        </div>
                        <div className="text-gray-700">
                          {currentReview.review}
                        </div>
                      </div>
                      {reviews.length > 1 && (
                        <ChevronRight
                          size={28}
                          className="cursor-pointer text-gray-600 hover:text-gray-800 ml-2"
                          onClick={nextReview}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h6 className="text-lg font-semibold mb-2">
                Be the first to review “{productTitle}”
              </h6>
              <small className="text-gray-600 block mb-4">
                Your email address will not be published. Required fields are
                marked <span className="text-red-500">*</span>
              </small>
              <form className="mt-3 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={24}
                        className={`cursor-pointer mr-1 ${
                          (hover !== null && hover >= star) || rating >= star
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        data-testid={`star-${star}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="review"
                    rows={3}
                    required
                    name="review"
                    value={form.review}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "checkout" && (
          <div>
            <p className="text-gray-700">Checkout content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
