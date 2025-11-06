import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
// Simple Label component (avoid importing SelectLabel from radix which must be used inside SelectGroup)
const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium mb-2 text-white ${className}`}
  >
    {children}
  </label>
);
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Toaster } from "../components/ui/toaster";
import ImageUploader from "../components/ImageUploader";
import { toast } from "../hooks/use-toast";
import {
  Package,
  Plus,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  X,
  ImageIcon,
  ShoppingBag as ShoppingBagIcon,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  // use 'all' as a sentinel for no category filter (radix Select disallows empty string values)
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [imageUploadStatus, setImageUploadStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    images: [],
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory && selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const response = await fetch(
        `http://localhost:4001/admin/products?${params}`
      );
      const result = await response.json();

      if (response.ok && result.status === "success") {
        const productsData = result.data?.products || [];
        const pagination = result.data?.pagination || {};

        setProducts(productsData);
        setTotalPages(pagination.totalPages || 1);
        setTotalProducts(pagination.totalProducts || 0);
      } else {
        toast.error("Failed to fetch products");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:4001/admin/products/categories"
      );
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setCategories(result.data?.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Product title is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      parseFloat(formData.price) <= 0
    ) {
      errors.price = "Valid price is required";
    }

    if (
      !formData.stock ||
      isNaN(formData.stock) ||
      parseInt(formData.stock) < 0
    ) {
      errors.stock = "Valid stock quantity is required";
    }

    if (!formData.category) {
      errors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Product description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setActionLoading(true);
      const productData = {
        ...formData,
        slug:
          formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        category: [
          {
            id: "1",
            name: formData.category,
            slug: formData.category.toLowerCase().replace(/\s+/g, "-"),
            image: "",
            creationAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        images: uploadedImages.length > 0 ? uploadedImages : [],
      };

      const response = await fetch("http://localhost:4001/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success("Product added successfully!");
        setShowAddModal(false);
        resetForm();
        fetchProducts();
        fetchCategories();
      } else {
        toast.error(result.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setActionLoading(true);
      const productData = {
        ...formData,
        category: [
          {
            id: "1",
            name: formData.category,
            slug: formData.category.toLowerCase().replace(/\s+/g, "-"),
            image: "",
            creationAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        images: uploadedImages.length > 0 ? uploadedImages : formData.images,
      };

      const response = await fetch(
        `http://localhost:4001/admin/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success("Product updated successfully!");
        setShowEditModal(false);
        setSelectedProduct(null);
        resetForm();
        fetchProducts();
        fetchCategories();
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `http://localhost:4001/admin/products/${productToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success("Product deleted successfully!");
        setShowDeleteModal(false);
        setProductToDelete(null);
        fetchProducts();
        fetchCategories();
      } else {
        toast.error(result.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setImageLoading(true);
    setImageUploadStatus("Uploading images...");

    try {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          if (file.size > 5 * 1024 * 1024) {
            reject(new Error("File size should be less than 5MB"));
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target.result);
          };
          reader.onerror = () => {
            reject(new Error("Failed to read file"));
          };
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...imageUrls]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      setImageUploadStatus(
        `✅ ${imageUrls.length} image(s) uploaded successfully!`
      );

      setTimeout(() => setImageUploadStatus(""), 3000);
    } catch (error) {
      console.error("Image upload error:", error);
      setImageUploadStatus("❌ Failed to upload some images");
      setTimeout(() => setImageUploadStatus(""), 3000);
    } finally {
      setImageLoading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      price: "",
      stock: "",
      description: "",
      category: "",
      images: [],
    });
    setUploadedImages([]);
    setSelectedProduct(null);
    setFormErrors({});
    setImageUploadStatus("");
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      slug: product.slug,
      price: product.price,
      stock: product.stock || 0,
      description: product.description,
      category: product.category?.[0]?.name || "",
      images: product.images || [],
    });
    setUploadedImages(product.images || []);
    setFormErrors({});
    setImageUploadStatus("");
    setShowEditModal(true);
  };

  const openPreviewModal = (product) => {
    setSelectedProduct(product);
    setShowPreviewModal(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={
            i === currentPage
              ? "bg-blue-600 text-white"
              : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
          }
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-zinc-400 text-center sm:text-left w-full sm:w-auto">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
          {totalProducts} products
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronFirst className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {pages}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLast className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock < 10) {
      return <Badge variant="warning">Low Stock</Badge>;
    } else {
      return <Badge variant="success">In Stock</Badge>;
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="h-6 sm:h-8 bg-zinc-800 rounded-lg w-48 sm:w-64 animate-pulse"></div>
            <div className="h-3 sm:h-4 bg-zinc-800 rounded-lg w-64 sm:w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(3)].map((_, i) => (
              <Card
                key={i}
                className="bg-zinc-900/50 border-zinc-800 animate-pulse"
              >
                <CardContent className="p-4 lg:p-6">
                  <div className="space-y-3 lg:space-y-4">
                    <div className="h-3 sm:h-4 bg-zinc-800 rounded w-20 sm:w-24"></div>
                    <div className="h-6 sm:h-8 bg-zinc-800 rounded w-24 sm:w-32"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4 lg:p-6">
              <div className="animate-pulse space-y-3 lg:space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 sm:h-16 bg-zinc-800 rounded"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-3 lg:space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-['Montserrat']">
                  Products Management
                </h1>
                <p className="text-sm sm:text-base text-zinc-400 font-['Montserrat']">
                  Manage your product catalog and pricing
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={true}
                    className="border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Bulk Upload</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                  <DialogHeader>
                    <DialogTitle className="text-white font-['Montserrat']">
                      Bulk Upload Products
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 font-['Montserrat']">
                      Upload a CSV or Excel file to add multiple products at
                      once.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white font-['Montserrat']">
                        Choose File
                      </label>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBulkUpload(false)}
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={showAddModal}
                onOpenChange={(open) => {
                  setShowAddModal(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white border-0 shadow-lg transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Add Product</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0b1020] border-[#1f2a44] max-w-3xl rounded-xl shadow-xl p-0">
                  <div className="flex flex-col max-h-[90vh] sm:max-h-[80vh]">
                    <DialogHeader className="p-6 pb-0">
                      <DialogTitle className="text-white font-['Montserrat']">
                        Add New Product
                      </DialogTitle>
                      <DialogDescription className="text-zinc-400 font-['Montserrat']">
                        Fill in the product details below
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleAddProduct}
                      className="flex flex-col flex-1 min-h-0"
                    >
                      <div className="p-6 space-y-4 overflow-y-auto min-h-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              Product Title *
                            </label>
                            <Input
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="Enter product title"
                              required
                            />
                            {formErrors.title && (
                              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.title}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              Price *
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  price: e.target.value,
                                })
                              }
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="0.00"
                              required
                            />
                            {formErrors.price && (
                              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.price}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              Category *
                            </label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData({ ...formData, category: value })
                              }
                            >
                              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => {
                                  const label =
                                    typeof category === "string"
                                      ? category
                                      : category.name ||
                                        category.slug ||
                                        category._id;
                                  return (
                                    <SelectItem key={label} value={label}>
                                      {label}
                                    </SelectItem>
                                  );
                                })}
                                <SelectItem value="Electronics">
                                  Electronics
                                </SelectItem>
                                <SelectItem value="Clothing">
                                  Clothing
                                </SelectItem>
                                <SelectItem value="Books">Books</SelectItem>
                                <SelectItem value="Home & Garden">
                                  Home & Garden
                                </SelectItem>
                                <SelectItem value="Sports">Sports</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.category && (
                              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.category}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              Stock Quantity *
                            </label>
                            <Input
                              type="number"
                              value={formData.stock}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  stock: e.target.value,
                                })
                              }
                              className="bg-zinc-800 border-zinc-700 text-white"
                              placeholder="0"
                              required
                            />
                            {formErrors.stock && (
                              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {formErrors.stock}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Description *
                          </label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Enter product description"
                            rows={3}
                            required
                          />
                          {formErrors.description && (
                            <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {formErrors.description}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Product Images
                          </label>
                          <div className="max-h-48 sm:max-h-56 overflow-auto rounded-md">
                            <ImageUploader
                              onFilesSelected={(files) =>
                                handleImageUpload({ target: { files } })
                              }
                              images={uploadedImages}
                              onRemove={removeImage}
                              disabled={imageLoading}
                            />
                          </div>
                          {imageUploadStatus && (
                            <p className="text-sm mt-2 text-zinc-300">
                              {imageUploadStatus}
                            </p>
                          )}
                        </div>
                      </div>

                      <DialogFooter className="flex-shrink-0 p-4 pt-0 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddModal(false);
                            resetForm();
                          }}
                          className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {actionLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Product"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-800/30">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-blue-200">
                    Total Products
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {totalProducts}
                  </p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-800/30">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-green-200">
                    Categories
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {categories.length}
                  </p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-800/30">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-purple-200">
                    Current Page
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {currentPage} / {totalPages}
                  </p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-0 max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:text-white"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              {(searchTerm ||
                selectedCategory !== "all" ||
                minPrice ||
                maxPrice) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-300 hover:text-white"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Category
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => {
                          const label =
                            typeof category === "string"
                              ? category
                              : category.name || category.slug || category._id;
                          return (
                            <SelectItem key={label} value={label}>
                              {label}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Sort By
                    </label>
                    <Select
                      value={`${sortBy}-${sortOrder}`}
                      onValueChange={(value) => {
                        const [field, order] = value.split("-");
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                    >
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt-desc">
                          Newest First
                        </SelectItem>
                        <SelectItem value="createdAt-asc">
                          Oldest First
                        </SelectItem>
                        <SelectItem value="title-asc">Name A-Z</SelectItem>
                        <SelectItem value="title-desc">Name Z-A</SelectItem>
                        <SelectItem value="price-asc">
                          Price Low-High
                        </SelectItem>
                        <SelectItem value="price-desc">
                          Price High-Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Table */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white font-['Montserrat']">
              Products ({totalProducts})
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Manage and monitor your product inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 text-zinc-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Loading products...
                </h3>
              </div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No products found
                </h3>
                <p className="text-zinc-400 mb-4">
                  {searchTerm || selectedCategory || minPrice || maxPrice
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first product"}
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800">
                        <TableHead className="text-zinc-300">Product</TableHead>
                        <TableHead className="text-zinc-300 hidden md:table-cell">
                          Category
                        </TableHead>
                        <TableHead className="text-zinc-300">Price</TableHead>
                        <TableHead className="text-zinc-300 hidden sm:table-cell">
                          Stock
                        </TableHead>
                        <TableHead className="text-zinc-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow
                          key={product._id}
                          className="border-zinc-800 hover:bg-zinc-800/30"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                                {product.images?.[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-10 h-10 object-cover rounded-lg"
                                  />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-zinc-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">
                                  {product.title}
                                </p>
                                <p className="text-xs text-zinc-400 truncate max-w-[150px] sm:max-w-[200px]">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">
                              {product.category?.[0]?.name || "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-white">
                              ₹{product.price}
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {getStockBadge(product.stock || 0)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <MoreVertical className="h-4 w-4 text-zinc-400" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-zinc-900 border-zinc-700">
                                <DropdownMenuItem
                                  onClick={() => openPreviewModal(product)}
                                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditModal(product)}
                                  className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openDeleteModal(product)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="p-4 border-t border-zinc-800">
                    {renderPagination()}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Product Modal - Redesigned with ShadeCN UI */}
      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="bg-[#0b1020] border-[#1f2a44] max-w-full sm:max-w-3xl rounded-xl shadow-2xl p-0">
          <div className="flex flex-col max-h-[100vh] sm:max-h-[100vh]">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-white font-bold text-2xl font-['Montserrat']">
                Edit Product
              </DialogTitle>
              <DialogDescription className="text-zinc-400 font-['Montserrat']">
                Update the product details below
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleEditProduct}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="p-6 pt-2 space-y-6 overflow-y-auto min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      label="Product Title *"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter product title"
                      required
                      className="shadecn-input"
                    />
                    {formErrors.title && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      label="Price *"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                      className="shadecn-input"
                    />
                    {formErrors.price && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      id="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger className="shadecn-input">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          const label =
                            typeof category === "string"
                              ? category
                              : category.name || category.slug || category._id;
                          return (
                            <SelectItem key={label} value={label}>
                              {label}
                            </SelectItem>
                          );
                        })}
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Home & Garden">
                          Home & Garden
                        </SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      label="Stock Quantity *"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="0"
                      required
                      className="shadecn-input"
                    />
                    {formErrors.stock && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.stock}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    label="Description *"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter product description"
                    rows={3}
                    required
                    className="shadecn-input bg-inherit"
                  />
                  {formErrors.description && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="images">Product Images</Label>
                  <div className="max-h-48 sm:max-h-56 overflow-auto rounded-md">
                    <ImageUploader
                      id="images"
                      onFilesSelected={(files) =>
                        handleImageUpload({ target: { files } })
                      }
                      images={uploadedImages}
                      onRemove={removeImage}
                      disabled={imageLoading}
                    />
                  </div>
                  {imageUploadStatus && (
                    <p className="text-sm mt-2 text-zinc-300">
                      {imageUploadStatus}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex-shrink-0 p-4 pt-0 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-['Montserrat']">
              Product Details
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="w-full">
                  <div className="w-full rounded-lg overflow-hidden bg-zinc-800">
                    {selectedProduct.images?.[0] ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        className="w-full h-56 sm:h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 sm:h-64 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-zinc-500" />
                      </div>
                    )}
                  </div>
                  {selectedProduct.images?.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto">
                      {selectedProduct.images.map((img, i) => (
                        <div
                          key={i}
                          className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-700"
                        >
                          <img
                            src={img}
                            alt={`${selectedProduct.title} ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-2xl font-bold text-blue-400 mt-1">
                      ₹{selectedProduct.price}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="text-sm">
                      {selectedProduct.category?.[0]?.name || "Uncategorized"}
                    </Badge>
                    {getStockBadge(selectedProduct.stock || 0)}
                    <div className="text-sm text-zinc-400 ml-auto sm:ml-0">
                      <div>ID</div>
                      <div className="text-xs font-mono text-zinc-300">
                        {selectedProduct._id}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">
                      Description
                    </h4>
                    <p className="text-zinc-300 text-sm">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-white">Stock</h4>
                      <p className="text-zinc-300">
                        {selectedProduct.stock || 0} units
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Sold</h4>
                      <p className="text-zinc-300">
                        {selectedProduct.sold || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowPreviewModal(false);
                openEditModal(selectedProduct);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-['Montserrat']">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete "{productToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-white">
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDeleteProduct}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700 text-white inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Product"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
}
