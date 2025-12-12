"use client";
import React, { useEffect, useState } from "react";
// import { MoreVertical, Filter } from "lucide-react";
// import Cookies from "js-cookie";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import PageButton from "./PageButton";
import { useUserStore } from "@/stores/AuthStore";

import { useAuthToken } from "@/hooks/useAuthToken"; // Assuming you have a hook to get the auth token

// const PAGE_SIZE = 5;

interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  views: number;
  bidsCount: number;
  createdAt: string;
}

function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const token = useAuthToken(); // Use the custom hook to get the token

  // Get unique categories for filter dropdown
  useEffect(() => {
    if (!token || !user?.id) {
      setloading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/user/${user.id}/?page=${page}&limit=10`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        // console.log("API Response:", data);
        if (Array.isArray(data.data)) {
          setProducts(data.data);
          setPage(data.pagination.page);
          setTotalPages(data.pagination.pages);
        } else {
          console.error("Unexpected API response format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [token, page, user?.id]); // ✅ include user?.id

  // Filter and search logic
  // const filteredProducts = useMemo(() => {
  //   return products.filter(
  //     (prod) =>
  //       (!category || prod.categoryId === category) &&
  //       prod.name.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [search, category, products]);

  // Pagination logic
  // const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  // const paginatedProducts = filteredProducts.slice(
  //   (page - 1) * PAGE_SIZE,
  //   page * PAGE_SIZE
  // );

  // Reset to first page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  // Add handlers for edit and delete
  const handleEdit = (id: string) => {
    router.push(`/dashboard/products/edit/${id}`);
  };
  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/products/${selectedProductId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== selectedProductId));
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
    } finally {
      setIsModalOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[#353535]">Product List</h2>
        <button
          className="bg-[#037F44] w-[180px] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#025c32] transition"
          onClick={() => router.push("/dashboard/products/add")}
        >
          Add Product
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3 mb-8">
        <Input
          placeholder="Search product's name..."
          className="bg-white border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative hidden md:block">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#037F44] pointer-events-none"
            size={20}
          />
          <select
            className="border rounded-md pl-10 pr-3 py-2 text-[#353535] bg-white appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="phone">Phone</option>
            <option value="laptop">Laptop</option>
            <option value="smart watch">Smart Watch</option>
          </select>
        </div>
        {/* <select
          className="hidden md:block border rounded-md px-3 py-2 text-[#353535] bg-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option value={cat} key={cat}>
              {cat}
            </option>
          ))}
        </select> */}
      </div>
      {/* Desktop Table */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div>
          <p className="text-center text-[#848484] mt-6">No products found</p>
        </div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow border-collapse hidden md:table">
          <thead>
            <tr className="bg-[#CCDCD4] ">
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                PRODUCT NAME
              </th>
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                CATEGORY
              </th>
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                DESCRIPTION
              </th>
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                PRICE
              </th>
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                VIEWS
              </th>
              {/* <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                BIDS
              </th> */}
              <th className="text-left px-4 py-3 text-[#505050] text-[14px] font-semibold">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b border-[#F0F0F0]">
                <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.name}
                </td>
                <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.categoryId}
                </td>
                <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.description}
                </td>
                <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.price}
                </td>
                <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.views}
                </td>
                {/* <td className="px-4 py-3 text-[#434343] text-[14px]">
                  {prod.bidsCount}
                </td> */}
                <td className="px-4 py-3 relative text-[#434343] text-[14px]">
                  <button
                    className="p-1 rounded hover:bg-[#F8F9FB]"
                    onClick={() =>
                      setActionMenuId(actionMenuId === prod.id ? null : prod.id)
                    }
                  >
                    <MoreVertical size={20} />
                  </button>
                  {actionMenuId === prod.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#F8F9FB] text-[#037F44]"
                        onClick={() => handleEdit(prod.id)}
                      >
                        <Edit size={16} /> Edit Product
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#F8F9FB] text-[#F87171]"
                        onClick={() => handleDeleteClick(prod.id)}
                      >
                        <Trash2 size={16} /> Delete Product
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Mobile List */}
      <div className="md:hidden flex flex-col gap-4">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-lg shadow px-4 py-3 border"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold text-[#353535]">{prod.name}</div>
                <div className="text-[#848484] text-[14px]">
                  {prod.categoryId}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[14px] text-[#05B756]">
                  {prod.price}
                </div>
                <div className="text-[#848484] text-[14px]">
                  {prod.createdAt}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-2">
              <button
                className="flex items-center text-[#037F44] text-sm font-medium"
                onClick={() => handleEdit(prod.id)}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button
                className="flex items-center text-[#F87171] text-sm font-medium"
                onClick={() => handleDeleteClick(prod.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* <div>
        {paginatedProducts.length === 0 && (
          <div className="text-center text-[#848484] mt-6">
            No products found
          </div>
        )}
      </div> */}
      {/* Pagination */}
      <PageButton page={page} setPage={setPage} totalPages={totalPages} />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F9FB] bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-[#353535] mb-4">
              Confirm Delete
            </h2>
            <p className="text-sm text-[#6B7280] mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm rounded bg-gray-200 text-[#353535]"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded bg-[#F87171] text-white"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTable;
