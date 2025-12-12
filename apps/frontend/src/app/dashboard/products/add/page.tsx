"use client";
import React from "react";
import { useState } from "react";
// import { API_URL } from "@/lib/config";
import { API_URL } from "../../../../lib/config";
// import Cookies from "js-cookie";

function Page() {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    paymentType: "",
    brand: "",
    rom: "",
    ram: "",
    price: "",
    displayType: "",
    displaySize: "",
    stock: "",
    file: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showSuccess, setShowSuccess] = useState(false); // Success popup state

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Basic validation ---
    if (!form.name.trim()) {
      alert('Product name is required');
      setLoading(false);
      return;
    }
    if (Number(form.price) <= 0) {
      alert('Price must be a positive number');
      setLoading(false);
      return;
    }
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      alert('Stock must be a non-negative integer');
      setLoading(false);
      return;
    }
    if (!imageFile) {
      alert('Product image is required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append all form fields
      formData.append('name', form.name.trim());
      formData.append('categoryId', form.categoryId);
      formData.append('description', form.description);
      formData.append('paymentType', form.paymentType);
      formData.append('brand', form.brand);
      formData.append('rom', form.rom);
      formData.append('ram', form.ram);
      formData.append('price', String(Number(form.price)));
      formData.append('displayType', form.displayType);
      formData.append('displaySize', form.displaySize);
      formData.append('stock', String(Number(form.stock)));

      // Append the image file with the correct field name
      formData.append('file', imageFile);

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      console.log(data);
      if (res.ok) {
        setShowSuccess(true);
        setForm({
          name: '',
          categoryId: '',
          description: '',
          paymentType: '',
          brand: '',
          rom: '',
          ram: '',
          price: '',
          displayType: '',
          displaySize: '',
          stock: '',
          file: '',
        });
      } else {
        alert(data.message || 'Failed to add product.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2 text-[#037F44]">✔️</div>
            <h3 className="text-xl font-bold mb-2 text-[#037F44]">
              Successful
            </h3>
            <p className="mb-4 text-[#353535] text-center">
              Your product has been added successfully.{" "}
            </p>
            <button
              className="bg-[#037F44] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#025c32] transition"
              onClick={() => setShowSuccess(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex flex-col items-center">
        <div className="bg-white rounded-[12px] shadow p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6 text-[#353535] text-center">
            Add a New Product{" "}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              {/* <label className="block mb-1 font-medium text-[#212121] text-[16px]">
                Product Category
              </label> */}
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 bg-white text-[#212121] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#037F44]"
              >
                <option value="">Product category</option>
                <option value="1">Phones</option>
                <option value="2">Laptops</option>
                <option value="3">Tablets</option>
                <option value="4">Accessories</option>
              </select>
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Payment Type
              </label> */}
              <select
                name="paymentType"
                value={form.paymentType}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#037F44]"
              >
                <option value=""> Payment type</option>
                <option value="Full Payment">Full Payment</option>
                <option value="Installment">Installment</option>
                <option value="Swap">Swap</option>
              </select>
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Product Name
              </label> */}
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Product Brand
              </label> */}
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                placeholder="Product Brand"
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                RAM
              </label> */}
              <input
                type="text"
                name="ram"
                value={form.ram}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="RAM"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                ROM
              </label> */}
              <input
                type="text"
                name="rom"
                value={form.rom}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="ROM"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                ROM
              </label> */}
              <input
                type="text"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="stock"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Display Size
              </label> */}
              <input
                type="text"
                name="displayType"
                value={form.displayType}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="Display Size"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Display Type
              </label> */}
              <input
                type="text"
                name="displaySize"
                value={form.displaySize}
                onChange={handleChange}
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                placeholder="Display Type"
              />
            </div>
            <div>
              {/* <label className="block mb-1 font-medium text-[#353535]">
                Description
              </label> */}
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Product Description"
                className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44] resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-[#353535]">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
                min="0"
                step="0.01"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="deviceImage"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Product Image{" "}
              </label>
              <input
                type="file"
                // id="deviceImage"
                // value={form.file}
                name="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                accept=".jpg,.jpeg,.png,.pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Supports: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>

            <button
              type="submit"
              className="bg-[#037F44] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#025c32] transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
            {loading && (
              <div className="text-center text-[#037F44] mt-2">
                Submitting, please wait...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
