import { motion } from "framer-motion";

const trainedModels = [
  {
    id: 1,
    name: "Animal Classifier",
    user: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    classes: ["Dogs", "Cats", "Birds"],
    accuracy: "98.5%",
    images: 1250,
    date: "2 days ago",
    sampleImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop"
  },
  {
    id: 2,
    name: "Food Recognition",
    user: "Alex Rodriguez", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    classes: ["Pizza", "Burger", "Salad"],
    accuracy: "97.2%",
    images: 890,
    date: "1 week ago",
    sampleImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop"
  },
  {
    id: 3,
    name: "Vehicle Detection",
    user: "Emily Johnson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", 
    classes: ["Car", "Truck", "Motorcycle"],
    accuracy: "99.1%",
    images: 2100,
    date: "3 days ago",
    sampleImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop"
  },
  {
    id: 4,
    name: "Plant Species",
    user: "Michael Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    classes: ["Rose", "Tulip", "Sunflower"],
    accuracy: "96.8%",
    images: 750,
    date: "5 days ago",
    sampleImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"
  }
];

export default function TrainedModelsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Trained Models</h2>
          <p className="text-xl text-gray-600">Explore models created by our community</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trainedModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden"
            >
              <img
                src={model.sampleImage}
                alt={model.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{model.name}</h3>
                  <span className="text-sm text-gray-500">{model.date}</span>
                </div>

                <div className="flex items-center mb-4">
                  <img
                    src={model.avatar}
                    alt={model.user}
                    className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-green-100"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{model.user}</p>
                    <p className="text-sm text-gray-600">{model.images} training images</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Classes:</p>
                  <div className="flex flex-wrap gap-2">
                    {model.classes.map((cls, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{model.accuracy}</div>
                    <div className="text-xs text-gray-500">Accuracy</div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                    Try Model
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}