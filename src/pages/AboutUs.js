import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assest/Ab&Emu logo 3.png';

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-10 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Header */}
        <div className="text-center mb-16">
          <img src={Logo} alt="Ab & Emu Fruit Cart Logo" className="w-28 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
            Flavour Fruit Cart
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Bringing nature’s sweetness to your doorstep.
          </p>
          <div className="w-24 h-1 bg-green-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Story & Image */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 mb-20">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-green-800 mb-6">Our Journey</h2>
            <p className="text-lg text-gray-700 mb-4">
              Since 2023, Flavour Fruit Cart has been a go-to destination for fresh, organic, and
              locally-sourced fruits. Born out of a passion for healthy living, we connect farms to
              families with care and convenience.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We focus on quality, sustainability, and making your fruit shopping simple and joyful.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white p-4 rounded-xl shadow-md flex-1 min-w-[200px]">
                <h3 className="text-2xl font-bold text-green-600 mb-2">200+</h3>
                <p className="text-gray-600">Fruit Varieties</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md flex-1 min-w-[200px]">
                <h3 className="text-2xl font-bold text-green-600 mb-2">1M+</h3>
                <p className="text-gray-600">Satisfied Customers</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md flex-1 min-w-[200px]">
                <h3 className="text-2xl font-bold text-green-600 mb-2">365 Days</h3>
                <p className="text-gray-600">Fresh Deliveries</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1576402187878-974f52b6c29d"
              alt="Fresh Fruits Basket"
              className="rounded-xl shadow-xl w-full"
            />
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-xl p-10 text-white mb-20 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg mb-6">
            To nourish lives with the freshest fruits from trusted farms—delivered quickly, safely, and sustainably.
          </p>
          <div className="flex flex-wrap gap-4">
            {['Farm Fresh', 'Eco-Friendly Packaging', 'Fast Delivery'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold">
                  ✓
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-12">Why Choose Flavour Cart?</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: '🍎',
                title: 'Organic Selection',
                desc: 'We hand-pick fruits that are naturally grown without harmful chemicals.',
              },
              {
                icon: '🚛',
                title: 'Same-Day Delivery',
                desc: 'Our logistics network ensures fruits reach your table at peak freshness.',
              },
              {
                icon: '💬',
                title: 'Expert Guidance',
                desc: 'Chat with our fruit experts for tips, recipes, or storage advice.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow text-left"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
