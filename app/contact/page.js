// ContactUsPage.jsx
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section (Adjusted font sizes) */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-400 mb-3">
            Get In Touch
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We&apos;re here to help. Select a method that works best for you, or fill out the quick form below.
          </p>
        </header>
        
        {/* Main Content Grid - CORRECTED MARGINS & GRID */}
        {/* Changed grid back to lg:grid-cols-3 for balanced layout (1/3 and 2/3 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> 
          
          {/* A. Contact Information Panel (Left/Side) - Now uses lg:col-span-1 for 1/3 width */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-md shadow-xl h-fit border border-indigo-900/50 shadow-indigo-900/20">
            <h2 className="text-xl font-bold mb-4 text-white border-b border-indigo-900 pb-2">
              Contact Details
            </h2>
            
            {/* Contact Method 1: Email */}
            <div className="flex items-start mb-4">
              <FiMail className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
              <div className="ml-3 text-sm">
                <h3 className="font-semibold text-gray-300">Email Us</h3>
                <p className="text-gray-400 text-xs">Response within 24 hours.</p>
                <a 
                  href="mailto:support@trustconsult.com" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  support@trustconsult.com
                </a>
              </div>
            </div>
            
            {/* Contact Method 2: Phone */}
            <div className="flex items-start mb-4">
              <FiPhone className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
              <div className="ml-3 text-sm">
                <h3 className="font-semibold text-gray-300">Call Us</h3>
                <p className="text-gray-400 text-xs">Mon-Fri, 9am - 5pm IST.</p>
                <a 
                  href="tel:+919876543210" 
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  +91 0958134442
                </a>
              </div>
            </div>
            
            {/* Contact Method 3: Location (Optional) */}
            <div className="flex items-start">
              <FiMapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
              <div className="ml-3 text-sm">
                <h3 className="font-semibold text-gray-300">Our Office</h3>
                <p className="text-gray-400 text-xs">
                  108 Pacivid, Knowledge town,<br/>
                  New Delhi, India 110001
                </p>
              </div>
            </div>

            {/* Social Links (Optional Placeholder) */}
            <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Connect on Social</h3>
                {/* Add social media icons here */}
                <div className="flex gap-3">
                    {/* Placeholder Icons */}
                </div>
            </div>
          </div>
          
          {/* B. Contact Form (Right/Main) - Now uses lg:col-span-2 for 2/3 width */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-md shadow-xl border border-indigo-900/50 shadow-indigo-900/20">
            <h2 className="text-xl font-bold mb-4 text-white border-b border-indigo-900 pb-2">
              Send Us a Message
            </h2>
            
            <form className="space-y-4">
              {/* Name and Email Group */}
              {/* Removed mx-5 and ensured children use w-full */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Sahil Kushwaha"
                    required
                    // Corrected to w-full
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white placeholder-gray-400 transition duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                    // Corrected to w-full
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white placeholder-gray-400 transition duration-200"
                  />
                </div>
              </div>
              
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Need help with a booking..."
                  required
                  // Corrected to w-full
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white placeholder-gray-400 transition duration-200"
                />
              </div>
              
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-gray-300 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Describe your query here..."
                  required
                  // Corrected to w-full
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm text-white placeholder-gray-400 transition duration-200 resize-none"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  // Corrected to w-full
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-full shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition duration-300"
                >
                  <FiSend className="w-4 h-4"/>
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;