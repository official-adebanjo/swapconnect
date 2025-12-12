"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { useAuthToken } from "@/hooks/useAuthToken";

export default function EditProductPage() {
  const { productId } = useParams();
  const token = useAuthToken();
  const router = useRouter();
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token || !productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        if (data?.data) {
          setForm({
            name: data.data.name || "",
            categoryId: data.data.categoryId || "",
            description: data.data.description || "",
            paymentType: data.data.paymentType || "",
            brand: data.data.brand || "",
            rom: data.data.rom || "",
            ram: data.data.ram || "",
            price: data.data.price || "",
            displayType: data.data.displayType || "",
            displaySize: data.data.displaySize || "",
            stock: data.data.stock || "",
          });
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [token, productId]);

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
    setError(null);
    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Failed to update product");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/products"), 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading product details...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="pt-[110px] md:pl-[252px] pl-8 pr-8 pb-8 min-h-screen bg-[#F8F9FB] flex flex-col items-center">
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-3xl mb-2 text-[#037F44]">✔️</div>
            <h3 className="text-xl font-bold mb-2 text-[#037F44]">
              Product Updated!
            </h3>
            <p className="mb-4 text-[#353535] text-center">
              Your product was updated successfully.
            </p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-[12px] shadow p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-[#353535] text-center">
          Edit Product
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            required
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
          />
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            placeholder="Product Brand"
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
          />
          <input
            type="text"
            name="ram"
            value={form.ram}
            onChange={handleChange}
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
            placeholder="RAM"
          />
          <input
            type="text"
            name="rom"
            value={form.rom}
            onChange={handleChange}
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
            placeholder="ROM"
          />
          <input
            type="text"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
            placeholder="Stock"
          />
          <input
            type="text"
            name="displayType"
            value={form.displayType}
            onChange={handleChange}
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
            placeholder="Display Type"
          />
          <input
            type="text"
            name="displaySize"
            value={form.displaySize}
            onChange={handleChange}
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44]"
            placeholder="Display Size"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Product Description"
            className="w-full border border-[#E5E7EB] text-[#212121] text-[16px] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#037F44] resize-none"
            rows={3}
          />
          <label className="block mb-1 font-medium text-[#353535]">Price</label>
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
          <button
            type="submit"
            className="bg-[#037F44] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#025c32] transition"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
