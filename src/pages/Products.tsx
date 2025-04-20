import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ShoppingCart, ArrowLeft, ArrowRight, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  isNew: boolean;
}

const categories = [
  { id: "all", name: "All Jewelry" },
  { id: "necklaces", name: "Necklaces" },
  { id: "earrings", name: "Earrings" },
  { id: "bracelets", name: "Bracelets" },
  { id: "pendants", name: "Pendants" },
  { id: "rings", name: "Rings" },
];

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
    // Reset to first page when category changes
    setCurrentPage(1);
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-16">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
        <p className="text-gray-600 mb-8">Discover our handcrafted jewelry pieces</p>

        {/* Mobile Filter */}
        <div className="md:hidden mb-6">
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>Filter: {categories.find(cat => cat.id === selectedCategory)?.name}</span>
            <Filter size={16} />
          </Button>
          
          <div className={cn(
            "mt-2 bg-white shadow-md rounded-md overflow-hidden transition-all duration-300",
            isFilterOpen ? "max-h-96 py-2" : "max-h-0"
          )}>
            {categories.map(category => (
              <button
                key={category.id}
                className={cn(
                  "block w-full text-left px-4 py-2 transition-colors",
                  selectedCategory === category.id 
                    ? "bg-glam-purple/10 text-glam-purple" 
                    : "hover:bg-gray-100"
                )}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setIsFilterOpen(false);
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Category Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h3 className="bg-glam-purple text-white font-semibold py-3 px-4">Categories</h3>
              <div className="py-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={cn(
                      "block w-full text-left px-4 py-2 transition-colors",
                      selectedCategory === category.id 
                        ? "bg-glam-purple/10 text-glam-purple" 
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className={cn(
                    "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-700 transform hover-lift",
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${product.image}`}
                      alt={product.name} 
                      className="w-full h-48 object-cover" 
                      onError={(e) => {
                        console.error('Image load error for:', product.name);
                        console.error('Image path:', product.image);
                        console.error('Full image URL:', `${import.meta.env.VITE_API_URL}${product.image}`);
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                      }}
                    />
                    {product.isNew && (
                      <span className="absolute top-2 right-2 bg-glam-purple text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-glam-purple font-bold mb-3">RS {product.price.toFixed(2)}</p>
                    <Button 
                      className="w-full bg-glam-purple hover:bg-glam-purple-dark"
                      onClick={() => handleAddToCart(product)}
                    >
                      <Plus size={16} className="mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button 
                      key={page}
                      variant="outline" 
                      className={cn(
                        currentPage === page 
                          ? "bg-glam-purple text-white hover:bg-glam-purple-dark" 
                          : ""
                      )}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
