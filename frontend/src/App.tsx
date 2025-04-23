import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import React from 'react';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-20">
                <div className="container-custom py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute requireAdmin />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/messages" element={<Messages />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
