-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2025 at 03:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `terapia_libre`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `nombre`, `correo`, `contrasena`, `created_at`) VALUES
(1, 'Admin', 'admin@terapia.com', '$2b$10$MSdANBurinT8kDynwVIBj.zXuQn/XIu4Jlm1uJJy6EEbqKX5Pa3h6', '2025-03-25 13:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `ausencias`
--

CREATE TABLE `ausencias` (
  `id_ausencia` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `motivo` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ausencias`
--

INSERT INTO `ausencias` (`id_ausencia`, `id_profesional`, `fecha`, `hora_inicio`, `hora_fin`, `motivo`, `creado_en`) VALUES
(1, 25, '2025-06-03', '08:00:00', '15:00:00', 'congreso', '2025-05-31 01:27:46');

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `chats` (
  `id_chat` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cupones`
--

CREATE TABLE `cupones` (
  `codigo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `descuento` decimal(5,2) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `solo_una_vez` tinyint(1) DEFAULT 1,
  `dado_por` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cupones`
--

INSERT INTO `cupones` (`codigo`, `descripcion`, `descuento`, `activo`, `solo_una_vez`, `dado_por`) VALUES
('primeraSesion', '60% de descuento', 0.30, 1, 1, 'Flor');

-- --------------------------------------------------------

--
-- Table structure for table `cupones_usados`
--

CREATE TABLE `cupones_usados` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `codigo_cupon` varchar(100) NOT NULL,
  `usado_en` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `disponibilidad`
--

CREATE TABLE `disponibilidad` (
  `id_disponibilidad` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `dia_semana` enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disponibilidad`
--

INSERT INTO `disponibilidad` (`id_disponibilidad`, `id_profesional`, `dia_semana`, `hora_inicio`, `hora_fin`, `creado_en`) VALUES
(39, 25, 'Lunes', '08:00:00', '20:00:00', '2025-04-23 12:12:31'),
(40, 27, 'Miércoles', '17:00:00', '20:00:00', '2025-04-23 19:55:26'),
(41, 27, 'Jueves', '08:00:00', '17:00:00', '2025-04-24 11:48:33'),
(42, 27, 'Viernes', '08:00:00', '17:00:00', '2025-04-25 11:51:55'),
(46, 28, 'Lunes', '17:00:00', '20:00:00', '2025-04-28 13:19:28'),
(49, 28, 'Martes', '14:00:00', '16:29:00', '2025-04-28 13:20:31'),
(50, 28, 'Viernes', '13:00:00', '18:00:00', '2025-04-28 13:20:58'),
(51, 28, 'Sábado', '10:00:00', '14:00:00', '2025-04-28 13:21:26'),
(52, 40, 'Lunes', '08:00:00', '08:45:00', '2025-04-29 15:29:17'),
(53, 40, 'Viernes', '17:30:00', '18:15:00', '2025-04-29 15:30:20'),
(54, 40, 'Martes', '08:00:00', '08:45:00', '2025-04-29 15:30:49'),
(59, 40, 'Viernes', '08:00:00', '08:45:00', '2025-04-29 15:35:48'),
(60, 40, 'Viernes', '19:45:00', '20:30:00', '2025-04-29 15:36:11'),
(62, 40, 'Miércoles', '19:00:00', '19:45:00', '2025-04-29 15:40:36'),
(65, 38, 'Lunes', '09:00:00', '11:00:00', '2025-04-29 15:55:09'),
(66, 38, 'Viernes', '14:00:00', '15:00:00', '2025-04-29 15:57:08'),
(67, 38, 'Martes', '11:00:00', '14:00:00', '2025-04-29 15:59:07'),
(68, 38, 'Miércoles', '18:00:00', '21:00:00', '2025-04-29 15:59:37'),
(72, 38, 'Jueves', '09:00:00', '12:00:00', '2025-04-29 16:00:47'),
(75, 40, 'Lunes', '17:30:00', '18:15:00', '2025-04-29 21:54:07'),
(76, 40, 'Lunes', '18:15:00', '19:00:00', '2025-04-29 21:54:28'),
(77, 40, 'Miércoles', '18:15:00', '19:00:00', '2025-04-29 21:55:29'),
(78, 40, 'Miércoles', '19:45:00', '20:30:00', '2025-04-29 21:56:50'),
(79, 40, 'Viernes', '18:15:00', '19:00:00', '2025-04-29 22:00:14'),
(80, 40, 'Viernes', '19:00:00', '19:45:00', '2025-04-29 22:00:41'),
(81, 41, 'Miércoles', '15:00:00', '15:45:00', '2025-04-29 22:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`) VALUES
(47, 'Neuropsicología'),
(2, 'Psicologia'),
(50, 'Psicología Ambiental'),
(43, 'Psicología Clínica'),
(54, 'Psicología Comunitaria'),
(48, 'Psicología de la Salud'),
(3, 'Psicologia del color'),
(55, 'Psicología del Consumidor'),
(49, 'Psicología del Deporte'),
(56, 'Psicología del Deporte y del Ejercicio'),
(52, 'Psicología del Desarrollo'),
(53, 'Psicología del Trabajo y de las Organizaciones'),
(46, 'Psicología Educativa'),
(58, 'Psicología Forense'),
(60, 'Psicología Gerontológica'),
(44, 'Psicología Infantil'),
(59, 'Psicología Intercultural'),
(45, 'Psicología Organizacional'),
(57, 'Psicología Positiva'),
(51, 'Psicología Transpersonal'),
(62, 'Psicopedagogía'),
(61, 'Psiquiatría');

-- --------------------------------------------------------

--
-- Table structure for table `mensajes`
--

CREATE TABLE `mensajes` (
  `id_mensaje` int(11) NOT NULL,
  `id_chat` int(11) NOT NULL,
  `id_remitente` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  `leido` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_profesional` int(11) DEFAULT NULL,
  `id_mensaje` int(11) NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pagos`
--

CREATE TABLE `pagos` (
  `id_pago` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `metodo_pago` enum('MercadoPago','PayPal') NOT NULL,
  `estado` enum('Pendiente','Pagado','Reembolsado') DEFAULT 'Pendiente',
  `id_transaccion` varchar(100) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_turno`, `monto`, `metodo_pago`, `estado`, `id_transaccion`, `fecha_pago`) VALUES
(40, 73, 1.00, 'MercadoPago', 'Pagado', '109036097773', '2025-04-25 15:55:08'),
(41, 74, 1.00, 'MercadoPago', 'Pagado', '109036591865', '2025-04-25 15:59:33'),
(47, 86, 1.00, 'MercadoPago', 'Pagado', '109044766309', '2025-04-25 17:22:47'),
(50, 100, 1.00, 'MercadoPago', 'Pagado', '109501705646', '2025-04-25 20:18:21'),
(51, 109, 1.00, 'MercadoPago', 'Pagado', '109552966798', '2025-04-26 11:31:48'),
(52, 119, 60.00, 'PayPal', 'Pagado', '1RB75472M6461530G', '2025-05-31 00:22:48'),
(53, 120, 60.00, 'MercadoPago', 'Pagado', '113383812730', '2025-05-31 00:41:15');

-- --------------------------------------------------------

--
-- Table structure for table `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `titulo_universitario` varchar(150) NOT NULL,
  `matricula_nacional` varchar(50) DEFAULT NULL,
  `matricula_provincial` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `disponibilidad` enum('24 horas','48 horas','72 horas','96 horas') NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `foto_perfil_url` varchar(255) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `valor_internacional` decimal(10,2) NOT NULL DEFAULT 0.00,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` tinyint(1) NOT NULL DEFAULT 0,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expira` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesionales`
--


-- --------------------------------------------------------

--
-- Table structure for table `profesional_especialidad`
--

CREATE TABLE `profesional_especialidad` (
  `id_profesional` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesional_especialidad`
--

INSERT INTO `profesional_especialidad` (`id_profesional`, `id_especialidad`) VALUES
(25, 50),
(27, 2),
(28, 43),
(31, 2),
(32, 2),
(37, 47),
(38, 43),
(40, 43),
(40, 60),
(41, 43),
(41, 58),
(43, 2),
(50, 44),
(50, 53);

-- --------------------------------------------------------

--
-- Table structure for table `tokens_temporales`
--

CREATE TABLE `tokens_temporales` (
  `booking_token` varchar(100) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_turno` date NOT NULL,
  `hora_turno` time NOT NULL,
  `precio_original` decimal(10,2) NOT NULL,
  `precio_final` decimal(10,2) NOT NULL,
  `cupon` varchar(100) DEFAULT NULL,
  `registrar_cupon` tinyint(1) DEFAULT 0,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens_temporales`
--

-- --------------------------------------------------------

--
-- Table structure for table `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_turno` date NOT NULL,
  `hora_turno` time NOT NULL,
  `estado` enum('Pendiente','Confirmado','Cancelado','Completado') DEFAULT 'Pendiente',
  `motivo_cancelacion` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `meet_url` varchar(255) DEFAULT NULL,
  `meet_creado_en` timestamp NULL DEFAULT NULL,
  `google_event_id_paciente` varchar(255) DEFAULT NULL,
  `google_event_id_profesional` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turnos`
--
-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `contrasena_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(255) DEFAULT NULL,
  `id_google` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expira` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indexes for table `ausencias`
--
ALTER TABLE `ausencias`
  ADD PRIMARY KEY (`id_ausencia`),
  ADD KEY `id_profesional` (`id_profesional`);

--
-- Indexes for table `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`codigo`);

--
-- Indexes for table `cupones_usados`
--
ALTER TABLE `cupones_usados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unico_usuario_cupon` (`id_usuario`,`codigo_cupon`);

--
-- Indexes for table `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD PRIMARY KEY (`id_disponibilidad`),
  ADD KEY `id_profesional` (`id_profesional`);

--
-- Indexes for table `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `id_chat` (`id_chat`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_mensaje` (`id_mensaje`);

--
-- Indexes for table `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `id_transaccion` (`id_transaccion`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indexes for table `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD UNIQUE KEY `matricula_nacional` (`matricula_nacional`),
  ADD UNIQUE KEY `matricula_provincial` (`matricula_provincial`);

--
-- Indexes for table `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD PRIMARY KEY (`id_profesional`,`id_especialidad`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indexes for table `tokens_temporales`
--
ALTER TABLE `tokens_temporales`
  ADD PRIMARY KEY (`booking_token`);

--
-- Indexes for table `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id_ausencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `chats`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `cupones_usados`
--
ALTER TABLE `cupones_usados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT for table `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ausencias`
--
ALTER TABLE `ausencias`
  ADD CONSTRAINT `ausencias_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`);

--
-- Constraints for table `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `cupones_usados`
--
ALTER TABLE `cupones_usados`
  ADD CONSTRAINT `cupones_usados_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Constraints for table `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD CONSTRAINT `disponibilidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE;

--
-- Constraints for table `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chats` (`id_chat`);

--
-- Constraints for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `notificaciones_ibfk_3` FOREIGN KEY (`id_mensaje`) REFERENCES `mensajes` (`id_mensaje`);

--
-- Constraints for table `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`) ON DELETE CASCADE;

--
-- Constraints for table `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE CASCADE;

--
-- Constraints for table `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
