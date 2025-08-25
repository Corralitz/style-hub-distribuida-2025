import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useFooterColumns } from '../../hooks/useContentful';

const Footer = () => {
  const { columns, loading, error } = useFooterColumns();

  // Fallback/default footer data in case Contentful is not configured
  const defaultColumns = [
    {
      title: 'Customer Service',
      links: [
        { text: 'Contact Us', url: '/contact' },
        { text: 'Size Guide', url: '/size-guide' },
        { text: 'Shipping Info', url: '/shipping' },
        { text: 'Returns', url: '/returns' }
      ]
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', url: '/about' },
        { text: 'Careers', url: '/careers' },
        { text: 'Privacy Policy', url: '/privacy' },
        { text: 'Terms of Service', url: '/terms' }
      ]
    }
  ];

  // Use Contentful columns if available, otherwise use defaults
  const footerColumns = columns.length > 0 ? columns : defaultColumns;

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column - Always show this */}
          <div>
            <Link to="/" className="text-xl font-bold mb-4 block">
              StyleHub
            </Link>
            <p className="text-gray-400 mb-4">
              Your one-stop shop for trendy and affordable clothing.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Dynamic Columns from Contentful */}
          {footerColumns.map((column) => (
            <div key={column.id || column.title}>
              <h4 className="font-semibold mb-4">{column.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {column.links.map((link, index) => (
                  <li key={index}>
                    {link.url.startsWith('http') ? (
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        {link.text}
                      </a>
                    ) : (
                      <Link 
                        to={link.url} 
                        className="hover:text-white transition-colors"
                      >
                        {link.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column - Always show this */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <a href="mailto:info@stylehub.com" 
                 className="flex items-center hover:text-white transition-colors">
                <Mail size={18} className="mr-2" />
                info@stylehub.com
              </a>
              <a href="tel:+15551234567" 
                 className="flex items-center hover:text-white transition-colors">
                <Phone size={18} className="mr-2" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Fashion Ave<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading state indicator (subtle) */}
        {loading && !error && columns.length === 0 && (
          <div className="text-center text-gray-500 text-xs mt-4">
            Loading footer content...
          </div>
        )}

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 StyleHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
