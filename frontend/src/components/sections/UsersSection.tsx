import { motion } from "framer-motion";

const users = [
  { id: 1, name: "Sarah Chen", role: "ML Engineer", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", models: 12, accuracy: "98.5%" },
  { id: 2, name: "Alex Rodriguez", role: "Data Scientist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", models: 8, accuracy: "97.2%" },
  { id: 3, name: "Emily Johnson", role: "AI Researcher", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", models: 15, accuracy: "99.1%" },
  { id: 4, name: "Michael Kim", role: "Computer Vision", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", models: 6, accuracy: "96.8%" },
  { id: 5, name: "Lisa Wang", role: "Deep Learning", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", models: 10, accuracy: "98.9%" },
  { id: 6, name: "David Park", role: "ML Ops", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", models: 7, accuracy: "97.6%" }
];

export default function UsersSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Active Community</h2>
          <p className="text-xl text-gray-600">Join thousands of ML practitioners building amazing models</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-green-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{user.models}</div>
                  <div className="text-xs text-gray-500">Models</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{user.accuracy}</div>
                  <div className="text-xs text-gray-500">Avg Accuracy</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}