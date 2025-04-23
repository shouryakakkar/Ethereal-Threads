import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';


const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
   <div className="pt-24 pb-16">
  {/* Hero Section */}
  <section className="py-16 md:py-24">
    <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Intro Text Section */}
      <div 
        className={cn(
          "transition-all duration-700 transform", 
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0" // Simple entrance animation
        )}
      >
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          WELCOME TO <span className="text-glam-purple">ETHEREAL THREADS</span>
        </h1>
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          Unveil the magic of handcrafted jewelry, where artistry meets individuality. 
          Every piece tells a story, meticulously crafted to adorn your unique journey.
        </p>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          From delicate, ethereal designs to bold statement pieces, our collection 
          blends tradition with modern elegance. Find the perfect piece that resonates with you.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-glam-purple hover:bg-glam-purple-dark text-lg px-8 py-6">
            <Link to="/products">
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="text-lg px-8 py-6 border-glam-purple text-glam-purple hover:text-glam-purple-dark hover:bg-gray-50"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div 
        className={cn(
          "transition-all duration-700 delay-300 transform", 
          isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
        )}
      >
        <div className="rounded-lg overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105">
          <img 
            src={`${import.meta.env.VITE_API_URL}/api/images/static/hero-image.jpeg`}
            alt="Luxury pearl necklace in an elegant jewelry box" 
            className="w-auto h-auto object-cover"
            onError={(e) => {
              console.error('Image load error for hero image');
              const target = e.target as HTMLImageElement;
              target.src = `${import.meta.env.VITE_API_URL}/api/images/static/placeholder-image.jpg`;
            }}
          />
        </div>
      </div>
    </div>
  </section>

  

  {/* Testimonials Section */}
  <section className="py-16">
    <div className="container-custom">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: "Ayesha", img: `${import.meta.env.VITE_API_URL}/api/images/static/testimonial-1.jpg`, quote: "Wow, this is gorgeous! I love how it's minimalist but still has that earthy, unique vibe. And wait—you made this yourself? That's insane! The fact that it's eco-friendly too just makes it even more special. You have to start selling these!" },
          { name: "Kritika",  img: `${import.meta.env.VITE_API_URL}/api/images/static/testimonial-2.jpg`, quote: "This is really impressive. Using sustainable materials like this is such a smart move—it's so important right now. I like how you've combined style with purpose. You've got something powerful here, not just jewelry, but a message." },
          { name: "Aditi",  img: `${import.meta.env.VITE_API_URL}/api/images/static/testimonial-3.jpg`, quote: "This is so cool! What's it made of? It doesn't even look like recycled stuff—it looks legit boutique-level. I'd totally wear this. Can you customize pieces too? Like if I wanted a specific color or shape?" }
        ].map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.name}
            name={testimonial.name}
            image={testimonial.img}
            quote={testimonial.quote}
            delay={index * 100} // Slightly staggered animation delay
          />
        ))}
      </div>
    </div>
  </section>

  {/* Call to Action */}
  <section className="py-16 bg-gradient-to-r from-glam-purple/90 to-glam-purple-dark/90 text-white">
    <div className="container-custom text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Discover Your Perfect Piece</h2>
      <p className="text-lg mb-8 max-w-2xl mx-auto">
        From elegant classics to bold statements, find jewelry that resonates with your personal style.
      </p>
      <Button asChild size="lg" variant="outline" className="text-black  border-purple hover:bg-white/10">
        <Link to="/products">Explore Collection</Link>
      </Button>
    </div>
  </section>
</div>

  );
};

// Category Card Component
const CategoryCard = ({ 
  title, 
  image, 
  link, 
  delay = 0 
}: { 
  title: string; 
  image: string; 
  link: string; 
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <Link 
      to={link} 
      className={cn(
        "group block rounded-lg overflow-hidden shadow-md transition-all duration-700 transform hover-lift",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-square">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all duration-300">
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ 
  name, 
  image, 
  quote, 
  delay = 0 
}: { 
  name: string; 
  image: string; 
  quote: string; 
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600 + delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={cn(
        "bg-white p-6 rounded-lg shadow-md transition-all duration-700 transform hover-lift",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4">
        <svg className="h-6 w-6 text-glam-purple" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-600 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover mr-4" 
          onError={(e) => {
            console.error('Image load error for testimonial:', name);
            const target = e.target as HTMLImageElement;
            target.src = `${import.meta.env.VITE_API_URL}/api/images/static/placeholder-image.jpg`;
          }}
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
        </div>
      </div>
    </div>
  );
};

export default Home;
