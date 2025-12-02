import { motion } from "framer-motion";

const stats = [
  { label: "Active Users", value: "2,847", icon: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=80&h=80&fit=crop" },
  { label: "Models Trained", value: "15,392", icon: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=80&h=80&fit=crop" },
  { label: "Images Processed", value: "1.2M+", icon: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&h=80&fit=crop" },
  { label: "Avg Accuracy", value: "98.3%", icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&h=80&fit=crop" }
];

export default function StatsSection() {
  return (
    <section className="py-16 mt-5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
          <p className="text-xl text-green-100">Real-time metrics from our growing community</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <img
                src={stat.icon}
                alt={stat.label}
                className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover border-2 border-white/20"
              />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-green-100">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}