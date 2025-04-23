
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    console.log('Subscribed!');
    // You would typically handle the subscription logic here
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-6 mt-16 border-t border-gray-200">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold text-glam-purple mb-4">ETHEREAL THREADS</h3>
            <p className="text-gray-600 mb-4">
              Plot Nos 8, 11,<br />
              TechZone 2, Greater Noida,<br />
              Uttar Pradesh 201310
            </p>
            <div className="flex space-x-4 mt-4">
              <SocialIcon icon={<Facebook size={18} />} ariaLabel="Facebook" />
              <SocialIcon icon={<Instagram size={18} />} ariaLabel="Instagram" />
              <SocialIcon icon={<Twitter size={18} />} ariaLabel="Twitter" />
              <SocialIcon icon={<Linkedin size={18} />} ariaLabel="LinkedIn" />
            </div>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <FooterLink href="/contact" label="Contact Us" />
              <FooterLink href="/about" label="About Page" />
              <FooterLink href="/sizing" label="Size Guide" />
              <FooterLink href="/returns" label="Shopping & Returns" />
              <FooterLink href="/privacy" label="Privacy" />
            </ul>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <FooterLink href="/products/earrings" label="Earrings" />
              <FooterLink href="/products/necklaces" label="Necklaces" />
              <FooterLink href="/products/bracelets" label="Bracelets" />
              <FooterLink href="/products/pendants" label="Pendants" />
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/about" label="About" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/affiliate" label="Affiliate" />
              <FooterLink href="/login" label="Login" />
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 pt-10 pb-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Subscribe</h3>
            <p className="text-gray-600 mb-4">Get the latest news and updates</p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 focus-visible:ring-glam-purple"
                required
              />
              <Button type="submit" className="bg-glam-purple hover:bg-glam-purple-dark">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 mt-8 text-center text-gray-500 text-sm">
          <p>Copyright © 2024. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

// Social Media Icon Component
const SocialIcon = ({ icon, ariaLabel }: { icon: React.ReactNode; ariaLabel: string }) => (
  <a 
    href="#" 
    aria-label={ariaLabel}
    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-glam-purple hover:text-white transition-all duration-300"
  >
    {icon}
  </a>
);

// Footer Link Component
const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link to={href} className="text-gray-600 hover:text-glam-purple transition-colors duration-200">
      {label}
    </Link>
  </li>
);

export default Footer;
