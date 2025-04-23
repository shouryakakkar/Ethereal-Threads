import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom text-center">
          <h1 
            className={cn(
              "text-4xl md:text-5xl font-bold mb-4 transition-all duration-700 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            Our Story
          </h1>
          <p 
            className={cn(
              "text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            Discover the artistry and passion behind Ethereal Threads
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div 
              className={cn(
                "transition-all duration-700 delay-200 transform",
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
              )}
            >
              <h2 className="text-3xl font-bold mb-6">The Ethereal Threads Journey</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Ethereal Threads was born from a shared passion for artistry and a vision to create jewelry that transcends mere accessories. Our journey began in 2025 when three friends with diverse backgrounds in design, technology, and business came together with a common dream: to craft jewelry that tells stories and captures emotions.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                What started as a small workshop has evolved into a beloved brand that celebrates the intersection of traditional craftsmanship and contemporary design. Each piece in our collection is thoughtfully created, drawing inspiration from nature, culture, and the stories of the people who wear them.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, Ethereal Threads stands as a testament to the power of passion and perseverance. We continue to grow, innovate, and create, always guided by our core values of authenticity, sustainability, and the belief that jewelry should be as unique as the individuals who wear it.
              </p>
            </div>
            <div 
              className={cn(
                "rounded-lg overflow-hidden shadow-xl transition-all duration-700 delay-300 transform",
                isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              )}
            >
              <img 
                src={`${import.meta.env.VITE_API_URL}/api/images/static/about/story.jpeg`}
                alt="Jewelry workshop" 
                className="w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 
            className={cn(
              "text-3xl font-bold text-center mb-16 transition-all duration-700 delay-400 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              title="Artisanal Craftsmanship"
              description=" We believe in preserving traditional techniques while embracing modern innovation."
              icon="🔨"
              delay={500}
              isVisible={isVisible}
            />
            <ValueCard
              title="Ethical Sourcing"
              description=" We prioritize fair trade relationships with our suppliers."
              icon="🌍"
              delay={600}
              isVisible={isVisible}
            />
            <ValueCard
              title="Timeless Design"
              description="We create jewelry that transcends trends, focusing on timeless elegance and versatility."
              icon="✨"
              delay={700}
              isVisible={isVisible}
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container-custom">
          <h2 
            className={cn(
              "text-3xl font-bold text-center mb-16 transition-all duration-700 delay-800 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Akshita Singh"
              role="Founder & Lead Designer"
              image={`${import.meta.env.VITE_API_URL}/api/images/static/about/team1.jpeg`}
              delay={900}
              isVisible={isVisible}
            />
            <TeamMember
              name="Shourya Kakkar"
              role="Co-Founder & Tech Head"
              image={`${import.meta.env.VITE_API_URL}/api/images/static/about/team2.jpg`}
              delay={1000}
              isVisible={isVisible}
            />
            <TeamMember
              name="Devyansh Mittal"
              role="Creative Director"
              image={`${import.meta.env.VITE_API_URL}/api/images/static/about/team3.jpeg`}
              delay={1100}
              isVisible={isVisible}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Value Card Component
const ValueCard = ({ 
  title, 
  description, 
  icon, 
  delay = 0,
  isVisible 
}: { 
  title: string; 
  description: string; 
  icon: string;
  delay?: number;
  isVisible: boolean;
}) => (
  <div 
    className={cn(
      "bg-white p-8 rounded-lg shadow-md text-center transition-all duration-700 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-2"
    )}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Team Member Component
const TeamMember = ({ 
  name, 
  role, 
  image, 
  delay = 0,
  isVisible 
}: { 
  name: string; 
  role: string; 
  image: string;
  delay?: number;
  isVisible: boolean;
}) => (
  <div 
    className={cn(
      "text-center transition-all duration-700 transform hover-lift",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="rounded-full overflow-hidden w-48 h-48 mx-auto mb-4 shadow-md">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover" 
      />
    </div>
    <h3 className="text-xl font-semibold">{name}</h3>
    <p className="text-gray-400">{role}</p>
  </div>
);

export default About;
