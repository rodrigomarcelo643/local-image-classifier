-- New tables for trained data
CREATE TABLE `trained_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `model_id` int(11) DEFAULT NULL,
  `trained_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `model_id` (`model_id`),
  CONSTRAINT `trained_images_ibfk_1` FOREIGN KEY (`model_id`) REFERENCES `models` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `trained_labels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trained_image_id` int(11) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `trained_image_id` (`trained_image_id`),
  CONSTRAINT `trained_labels_ibfk_1` FOREIGN KEY (`trained_image_id`) REFERENCES `trained_images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;