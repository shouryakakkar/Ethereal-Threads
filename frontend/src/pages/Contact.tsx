import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Contact Us
          </h1>
          <p 
            className={cn(
              "text-lg text-gray-600 max-w-3xl mx-auto transition-all duration-700 delay-100 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}
          >
            We'd love to hear from you. Reach out with any questions or inquiries.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div 
              className={cn(
                "transition-all duration-700 delay-200 transform",
                isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
              )}
            >
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have a question about our collections or need assistance with an order? 
                Fill out the form below, and we'll get back to you shortly.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formState.name}
                      onChange={handleInputChange}
                      placeholder="Ethereal Threads" 
                      className="focus-visible:ring-glam-purple"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formState.email}
                      onChange={handleInputChange}
                      placeholder="etherealthreads@example.com" 
                      className="focus-visible:ring-glam-purple"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    value={formState.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?" 
                    className="focus-visible:ring-glam-purple"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..." 
                    className="min-h-[150px] focus-visible:ring-glam-purple" 
                    required 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-glam-purple hover:bg-glam-purple-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            {/* Contact Information */}
            <div 
              className={cn(
                "transition-all duration-700 delay-300 transform",
                isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              )}
            >
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Visit our store or get in touch through any of the following channels. 
                We're here to make your jewelry experience exceptional.
              </p>
              
              <div className="space-y-8">
                <ContactInfo 
                  icon={<MapPin className="text-glam-purple h-5 w-5" />}
                  title="Our Location"
                  content={
                    <>
                      <p>Plot Nos 8, 11,</p>
                      <p>TechZone 2, Greater Noida,</p>
                      <p>Uttar Pradesh 201310</p>
                    </>
                  }
                />
                
                <ContactInfo 
                  icon={<Phone className="text-glam-purple h-5 w-5" />}
                  title="Phone Number"
                  content={<p>+91 98765 43xxx</p>}
                />
                
                <ContactInfo 
                  icon={<Mail className="text-glam-purple h-5 w-5" />}
                  title="Email Address"
                  content={<p>contact@etherealthreads.com</p>}
                />
                
                <ContactInfo 
                  icon={<Clock className="text-glam-purple h-5 w-5" />}
                  title="Operating Hours"
                  content={
                    <>
                      <p>Monday - Friday: 10:00 AM - 10:00 PM</p>
                      <p>Saturday: 10:00 AM - 3:00 PM</p>
                      <p>Sunday: Closed</p>
                    </>
                  }
                />
              </div>
           
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Contact Info Component
const ContactInfo = ({ 
  icon, 
  title, 
  content 
}: { 
  icon: React.ReactNode; 
  title: string; 
  content: React.ReactNode;
}) => (
  <div className="flex">
    <div className="mr-4 mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <div className="text-gray-600">{content}</div>
    </div>
  </div>
);

export default Contact;
