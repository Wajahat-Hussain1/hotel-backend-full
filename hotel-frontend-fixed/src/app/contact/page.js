// File: src/app/contact/page.js

"use client";

import React, { useState } from 'react';
import Navbar from "../components/Navbar"; // Make sure the path to Navbar is correct

// Dummy map component for placeholder
const GoogleMapPlaceholder = () => (
    <div className="w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg border-4 border-white flex items-center justify-center text-gray-500 font-semibold text-lg">
        
        {/* Real Google Map iframe ya component yahan add kiya ja sakta hai */}
    </div>
);

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend API
        console.log("Form submitted:", formData);
        alert("Thank you for your message! We will get back to you soon.");
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div>
            {/* Navbar is used here */}
            <Navbar /> 

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    VELVET     <span className="text-blue-600"> Hotel</span>
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        We're here to help you with your booking, questions, or concerns.
                    </p>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT: Contact Information */}
                    <div className="space-y-8 lg:col-span-1 p-6 bg-blue-600 rounded-xl shadow-2xl text-white">
                        <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
                        
                        {/* Address */}
                        <div className="flex items-start space-x-4">
                            <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m11.314 0a7 7 0 11-11.314 0m11.314 0H12m0 0v-5m0 5a2 2 0 11-4 0m4 0a2 2 0 10-4 0m0 0H12"></path></svg>
                            <div>
                                <p className="font-semibold">Our Location</p>
                                <p className="text-sm opacity-90">123 Hotel Avenue, City Center, Karachi, Pakistan</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start space-x-4">
                            <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.5l1.5 4-4 1.5 4 1.5-1.5 4H5a2 2 0 01-2-2v-3zm0 0l-1 1m0 0l1 1m0 0v-2m0 2l-1 1m0 0l1 1m0 0v-2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6m0-4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-8a2 2 0 01-2-2v-4z"></path></svg>
                            <div>
                                <p className="font-semibold">Call Us</p>
                                <p className="text-sm opacity-90">+92 3XX XXX XXXX (24/7 Support)</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4">
                            <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"></path></svg>
                            <div>
                                <p className="font-semibold">Email Us</p>
                                <p className="text-sm opacity-90">booking@flashboyhotel.com</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* RIGHT: Contact Form */}
                    <div className="lg:col-span-2 p-8 bg-white rounded-xl shadow-2xl">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Send a Message</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your full name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your message or inquiry here..."
                                ></textarea>
                            </div>
                            
                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
                
                {/* Map Section */}
                <div className="mt-12">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Find Us Here</h3>
                    <GoogleMapPlaceholder />
                </div>
            </div>
        </div>
    );
}