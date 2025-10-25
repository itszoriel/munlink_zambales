import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Building, Heart, Shield, Globe, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const [hoveredMunicipality, setHoveredMunicipality] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const features = [
    {
      icon: Building,
      title: 'Municipal Services',
      description: 'Access official documents, permits, and certificates from your municipality online.'
    },
    {
      icon: Users,
      title: 'Community Marketplace',
      description: 'Connect with neighbors across Zambales through our cross-municipal marketplace.'
    },
    {
      icon: Heart,
      title: 'Issue Reporting',
      description: 'Report municipal issues and track their resolution progress in real-time.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.'
    }
  ];

  const municipalities = [
    'Botolan', 'Cabangan', 'Candelaria', 'Castillejos', 'Iba',
    'Masinloc', 'Palauig', 'San Antonio', 'San Felipe',
    'San Marcelino', 'San Narciso', 'Santa Cruz', 'Subic'
  ];

  // Mapping municipality names to their image filenames
  const municipalityImages: { [key: string]: string } = {
    'Botolan': 'Botolan Hall.png',
    'Cabangan': 'Cabangan,Zambalesjf8645_09.png',
    'Candelaria': 'Candelaria_Municipal_Hall,_Zambales.png',
    'Castillejos': 'Castillejos.png',
    'Iba': 'Zambales_Provincial_Capitol_(Olongapo-Bugallon_Road,_Iba,_Zambales__05-21-2023).png',
    'Masinloc': 'Massive_church(Masinloc,_Zambales).png',
    'Palauig': 'Palauig,Zambalesjf0969_32.png',
    'San Antonio': 'San Antonio.png',
    'San Felipe': 'SanFelipe,Zambalesjf0695_02.png',
    'San Marcelino': 'San Marcelino.png',
    'San Narciso': 'San_Narciso_Municipal_Hall,_Zambales,_Aug_2025.png',
    'Santa Cruz': 'SantaCruz,Zambalesjf9968_08.png',
    'Subic': 'Subic_Municipal_Hall,_Zambales,_Aug_2025_(1).png'
  };

  // Handle mouse enter with delay
  const handleMouseEnter = (municipality: string) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Set new timeout for 1.5 seconds
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMunicipality(municipality);
    }, 1500);
  };

  // Handle mouse leave - clear timeout and set delay before hiding
  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Don't hide immediately if image is showing - let the modal handle it
    if (!hoveredMunicipality) {
      // Only hide if no image is currently shown
      setHoveredMunicipality(null);
    }
  };

  // Handle mouse enter on the modal/photo area
  const handleModalMouseEnter = () => {
    // Clear any hide timeout when mouse enters the modal
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Handle mouse leave on the modal/photo area
  const handleModalMouseLeave = () => {
    // Hide image immediately when leaving modal
    setHoveredMunicipality(null);
  };

  // Handle clicking outside the modal to close it
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setHoveredMunicipality(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                src={new URL('../../../../public/logos/zambales/512px-Seal_of_Province_of_Zambales.svg.png', import.meta.url).toString()}
                alt="Zambales Seal"
                className="w-32 h-32"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About MunLink Zambales
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive digital governance platform connecting all 13 municipalities 
              of Zambales Province for seamless municipal services and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To modernize municipal governance in Zambales Province by providing 
                a unified digital platform that enhances citizen engagement, streamlines 
                municipal services, and fosters cross-municipal community connections.
              </p>
              <p className="text-lg text-gray-600">
                We believe that technology should bridge the gap between government 
                and citizens, making municipal services more accessible, transparent, 
                and efficient for all residents of Zambales.
              </p>
            </div>
            <div className="bg-primary-50 rounded-lg p-8">
              <div className="text-center">
                <Globe className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Digital Transformation</h3>
                <p className="text-gray-600">
                  Bringing Zambales municipalities into the digital age with 
                  modern, user-friendly solutions for municipal governance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools for municipal governance and community engagement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Municipalities Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Serving All Zambales Municipalities</h2>
            <p className="text-xl text-gray-600">
              MunLink connects all 13 municipalities of Zambales Province
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hover over each municipality for 1.5 seconds to see their municipal hall or landmark. The image will stay visible as long as you keep your mouse over the card or the image itself.
            </p>
          </div>
          
          {/* Hover Image Display */}
          {hoveredMunicipality && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300"
              onClick={handleModalClick}
            >
              <div 
                className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onMouseEnter={handleModalMouseEnter}
                onMouseLeave={handleModalMouseLeave}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{hoveredMunicipality}</h3>
                </div>
                <div className="relative">
                  <img
                    src={`/Zambales Trademark/${municipalityImages[hoveredMunicipality]}`}
                    alt={`${hoveredMunicipality} Municipal Hall`}
                    className="w-full h-auto rounded-lg shadow-lg animate-in fade-in duration-500 delay-150"
                    style={{ maxHeight: '60vh', objectFit: 'contain' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-lg">
                    <p className="text-white text-sm">
                      {hoveredMunicipality === 'Iba' ? 'Provincial Capitol' : 'Municipal Hall'} - {hoveredMunicipality}, Zambales
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {municipalities.map((municipality, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-sm border p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group h-24 flex flex-col justify-center hover:border-primary-200"
                onMouseEnter={() => handleMouseEnter(municipality)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-primary-500 mr-2 group-hover:text-primary-600 transition-colors" />
                  <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{municipality}</span>
                </div>
                {municipality === 'Iba' && (
                  <span className="text-xs text-yellow-600 font-medium">Provincial Capital</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Built with Modern Technology</h2>
              <p className="text-lg text-gray-600 mb-6">
                MunLink is built using cutting-edge web technologies to ensure 
                reliability, security, and excellent user experience across all devices.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">React 18 with TypeScript for robust frontend</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Flask with SQLAlchemy for scalable backend</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">JWT authentication with bcrypt security</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Mobile-first responsive design</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Security & Privacy</h3>
              <p className="text-gray-600 mb-6">
                Your data security and privacy are our top priorities. We implement 
                industry-standard security measures to protect your information.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  End-to-end encryption for sensitive data
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Regular security audits and updates
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  GDPR-compliant data handling
                </li>
                <li className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  Secure file upload and storage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Digital Municipal Services?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Zambales residents who are already using MunLink 
            for their municipal service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link
              to="/municipalities"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-medium"
            >
              Explore Municipalities
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              MunLink Zambales - Connecting Communities, Empowering Citizens
            </p>
            <p className="text-sm text-gray-500">
              © 2025 MunLink Zambales. All rights reserved. | 
              <Link to="/privacy" className="ml-1 hover:text-primary-600">Privacy Policy</Link> | 
              <Link to="/terms" className="ml-1 hover:text-primary-600">Terms of Service</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
