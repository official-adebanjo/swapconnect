"use client";

import type React from "react";
import { useState } from "react";
import { API_URL } from "../lib/config";

interface SwapOfferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  targetProductId: string;
  targetProductName: string;
}

const SwapOfferDialog: React.FC<SwapOfferDialogProps> = ({
  isOpen,
  onClose,
  targetProductId,
  targetProductName,
}) => {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    brand: "",
    rom: "",
    ram: "",
    price: "",
    displayType: "",
    displaySize: "",
    stock: "1",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!form.name.trim()) {
      alert("Product name is required");
      setLoading(false);
      return;
    }
    if (Number(form.price) <= 0) {
      alert("Price must be a positive number");
      setLoading(false);
      return;
    }
    if (!imageFile) {
      alert("Product image is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to make a swap offer");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("targetProductId", targetProductId);
      formData.append("name", form.name.trim());
      formData.append("categoryId", form.categoryId);
      formData.append("description", form.description);
      formData.append("brand", form.brand);
      formData.append("ram", form.ram);
      formData.append("rom", form.rom);
      formData.append("price", String(Number(form.price)));
      formData.append("displayType", form.displayType);
      formData.append("displaySize", form.displaySize);
      formData.append("stock", form.stock);
      formData.append("message", `Swap offer for ${targetProductName}`);
      formData.append("image", imageFile);

      const response = await fetch(`${API_URL}/bid/swap-offer`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        // Reset form
        setForm({
          name: "",
          categoryId: "",
          description: "",
          brand: "",
          rom: "",
          ram: "",
          price: "",
          displayType: "",
          displaySize: "",
          stock: "1",
        });
        setImageFile(null);
      } else {
        alert(data.error || data.message || "Failed to create swap offer.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setShowSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 relative w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Success Popup */}
        {showSuccess && (
          <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#037F44]">✔️</div>
              <h3 className="text-xl font-bold mb-2 text-[#037F44]">
                Swap Offer Sent!
              </h3>
              <p className="mb-4 text-[#353535] text-center">
                Your swap offer has been sent successfully. The seller will be
                notified.
              </p>
              <button
                className="bg-[#037F44] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#025c32] transition"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 disabled:opacity-50"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            id="dialog-title"
            className="text-2xl font-bold text-[#353535] mb-2"
          >
            Make Swap Offer
          </h2>
          <p className="text-gray-600">
            Add details of your product to swap with &quot;{targetProductName}
            &quot;
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 bg-white text-[#212121] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                aria-label="Product category"
              >
                <option value="">Product category</option>
                <option value="1">Phones</option>
                <option value="2">Laptops</option>
                <option value="3">Tablets</option>
                <option value="4">Accessories</option>
              </select>
            </div>

            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                aria-label="Product Name"
              />
            </div>

            <div>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                placeholder="Product Brand"
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                aria-label="Product Brand"
              />
            </div>

            <div>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="Estimated Value (₦)"
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                aria-label="Estimated Value"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="RAM (optional)"
                aria-label="RAM"
              />
            </div>

            <div>
              <input
                type="text"
                name="rom"
                value={form.rom}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="Storage (optional)"
                aria-label="Storage"
              />
            </div>

            <div>
              <input
                type="text"
                name="displayType"
                value={form.displayType}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="Display Size (optional)"
                aria-label="Display Size"
              />
            </div>

            <div>
              <input
                type="text"
                name="displaySize"
                value={form.displaySize}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="Display Type (optional)"
                aria-label="Display Type"
              />
            </div>
          </div>

          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Product Description"
              className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44] resize-none"
              aria-label="Product Description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Product Image
            </label>
            <input
              type="file"
              name="image"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              accept=".jpg,.jpeg,.png"
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Supports: JPG, PNG (Max 5MB)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#037F44] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#025c32] transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating Swap Offer..." : "Make Swap Offer"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          {loading && (
            <div className="text-center text-[#037F44] mt-2">
              Processing your swap offer, please wait...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SwapOfferDialog;
