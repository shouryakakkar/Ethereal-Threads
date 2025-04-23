import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Menu, ShoppingCart, LogOut, User, Home, Package, Info, Phone, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { cn } from '@/lib/utils';

type NavLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

type MobileNavLinkProps = NavLinkProps & {
  onClick: () => void;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = isAuthenticated && (user as { role?: string })?.role === 'admin';

  return (
    <header
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <img 
          className='logo' 
          src={`${import.meta.env.VITE_API_URL}/api/images/static/logo.png`}
          alt="Ethereal Threads Logo"
          onError={(e) => {
            console.error('Logo image load error');
            const target = e.target as HTMLImageElement;
            target.src = `${import.meta.env.VITE_API_URL}/api/images/static/placeholder-image.jpg`;
          }}
        />
        <Link to="/"></Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" icon={<Home size={18} />} label="HOME" />
          <NavLink to="/products" icon={<Package size={18} />} label="PRODUCTS" />
          <NavLink to="/about" icon={<Info size={18} />} label="ABOUT" />
          <NavLink to="/contact" icon={<Phone size={18} />} label="CONTACT" />
          {!isAdmin && (
            <NavLink 
              to="/cart" 
              icon={
                <div className="relative">
                  <ShoppingCart size={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-glam-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </div>
              } 
              label="CART" 
            />
          )}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-glam-purple"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          {!isAdmin && (
            <Link to="/cart" className="mr-4 relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-glam-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          <button onClick={toggleMobileMenu} className="text-glam-purple focus:outline-none">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ top: '60px' }}
      >
        <div className="container py-5 flex flex-col space-y-5">
          <MobileNavLink to="/" icon={<Home size={18} />} label="HOME" onClick={toggleMobileMenu} />
          <MobileNavLink to="/products" icon={<Package size={18} />} label="PRODUCTS" onClick={toggleMobileMenu} />
          <MobileNavLink to="/about" icon={<Info size={18} />} label="ABOUT" onClick={toggleMobileMenu} />
          <MobileNavLink to="/contact" icon={<Phone size={18} />} label="CONTACT" onClick={toggleMobileMenu} />
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button asChild className="w-full bg-glam-purple hover:bg-glam-purple-dark transition-colors duration-300">
              <Link to="/login" onClick={toggleMobileMenu}>
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => (
  <Link to={to} className="custom-link flex items-center space-x-1 text-sm font-medium">
    {icon}
    <span>{label}</span>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, icon, label, onClick }) => (
  <Link to={to} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200" onClick={onClick}>
    <span className="text-glam-purple">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default Header;
