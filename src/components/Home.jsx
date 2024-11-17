import React from 'react';
import Navbar from './Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="border-t-2 border-white mx-4"></div>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-black text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Abstract pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
            <div className="absolute inset-0 bg-[linear-gradient(30deg,#ffffff11_1px,transparent_1px)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8 text-center">
            <h1 className="text-6xl font-light tracking-tight">
              <span className="block">Leaf Quality</span>
              <span className="block mt-2 font-extralight">Analysis System</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Elevating agricultural intelligence through precise leaf analysis and sophisticated health monitoring.
            </p>
            <div className="mt-8">
              <a
                href="#features"
                className="inline-block border border-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                Discover More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-light text-center mb-16">Core Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-8 border border-gray-100 hover:border-black transition-all duration-300"
                >
                  <div className="h-full flex flex-col">
                    <span className="text-sm text-gray-400 mb-4">0{index + 1}</span>
                    <h3 className="text-xl font-light mb-4">{feature.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-6 overflow-hidden">
                      <span className="block w-8 h-px bg-black transform group-hover:translate-x-full transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-800 pb-12 mb-12">
              <div>
                <h3 className="text-2xl font-light mb-4">Leaf Quality Analysis</h3>
                <p className="text-gray-400 font-light max-w-md">
                  Pioneering the future of agricultural analysis through advanced technology and data-driven insights.
                </p>
              </div>
              <div className="md:text-right">
                <div className="space-x-6">
                  {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social.toLowerCase()}.com`}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Leaf Quality Analysis System. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const features = [
  {
    title: "Health Analysis",
    description: "Advanced leaf disease detection and health monitoring using sophisticated computer vision algorithms."
  },
  {
    title: "Quality Assessment",
    description: "Precise evaluation of leaf characteristics for optimal yield prediction and resource management."
  },
  {
    title: "Data Intelligence",
    description: "Comprehensive analytics and visualization tools for deeper agricultural insights."
  }
];

export default HomePage;