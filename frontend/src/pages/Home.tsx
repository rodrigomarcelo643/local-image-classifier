import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const partners = [
  { name: "TechCorp", logo: "🏢" },
  { name: "DataFlow", logo: "📊" },
  { name: "AI Solutions", logo: "🤖" },
  { name: "CloudTech", logo: "☁️" },
  { name: "InnovateLab", logo: "🔬" },
  { name: "SmartVision", logo: "👁️" }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Data Scientist at TechCorp",
    content: "This platform revolutionized our image classification workflow. The accuracy is outstanding!",
    avatar: "👩‍💼"
  },
  {
    name: "Michael Chen",
    role: "ML Engineer at DataFlow",
    content: "Easy to use interface with powerful AI capabilities. Saved us months of development time.",
    avatar: "👨‍💻"
  },
  {
    name: "Emily Rodriguez",
    role: "Research Lead at InnovateLab",
    content: "The model training is incredibly fast and the results are consistently reliable.",
    avatar: "👩‍🔬"
  }
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-16 md:py-24"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12"
        >
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Smart Image Classification
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl mb-8 opacity-90"
          >
            Transform your images into intelligent insights with AI-powered classification
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/upload"
                className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg inline-block"
              >
                Start Classifying
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/docs"
                className=" flex -row border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-green-700 transition-all duration-200  items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Read the Docs</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              title: "Upload & Label",
              description: "Easily upload your images and assign accurate labels for training your custom models."
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Train Models",
              description: "Leverage powerful machine learning algorithms to train accurate classification models."
            },
            {
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              title: "Analyze Results",
              description: "Monitor your trained models' performance and manage your classification pipeline efficiently."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-green-100 mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "99%", label: "Accuracy" },
              { value: "50+", label: "Model Types" },
              { value: "1M+", label: "Images Processed" },
              { value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center"
              >
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.2 + index * 0.1 }}
                  className="text-2xl font-bold text-green-600 mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Partners Marquee */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="py-16 bg-gray-50 rounded-2xl mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Trusted by Industry Leaders</h2>
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "0%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex space-x-12 whitespace-nowrap"
          >
            {[...partners, ...partners].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-3 bg-white px-6 py-4 rounded-xl shadow-md min-w-max"
              >
                <span className="text-2xl">{partner.logo}</span>
                <span className="font-semibold text-gray-700">{partner.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3 }}
        className="py-16"
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.2 + index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-green-100"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{testimonial.avatar}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 3.5 + index * 0.2 + i * 0.1 }}
                    className="text-yellow-400 text-lg"
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 4 }}
        className="text-center py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl"
      >
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 4.2 }}
          className="text-4xl font-bold mb-6"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 4.4 }}
          className="text-xl mb-8 opacity-90"
        >
          Join thousands of developers and businesses using our platform
        </motion.p>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 4.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/upload"
            className="bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg inline-block"
          >
            Start Your Free Trial
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}