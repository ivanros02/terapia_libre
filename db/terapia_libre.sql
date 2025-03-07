-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2025 a las 01:50:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `terapia_libre`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad_profesional`
--

CREATE TABLE `disponibilidad_profesional` (
  `id_disponibilidad` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('disponible','ocupado','cancelado') NOT NULL DEFAULT 'disponible'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `disponibilidad_profesional`
--

INSERT INTO `disponibilidad_profesional` (`id_disponibilidad`, `id_profesional`, `fecha`, `hora_inicio`, `hora_fin`, `estado`) VALUES
(1, 11, '2025-03-10', '08:00:00', '10:00:00', 'ocupado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`) VALUES
(2, 'Psicologia'),
(3, 'Psicologia del color');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `titulo_universitario` varchar(150) NOT NULL,
  `matricula_nacional` varchar(50) NOT NULL,
  `matricula_provincial` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `disponibilidad` enum('24 horas','48 horas','72 horas','96 horas') NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `foto_perfil_url` varchar(255) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL DEFAULT 0.00,
  `valor_internacional` decimal(10,2) NOT NULL DEFAULT 0.00,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `nombre`, `titulo_universitario`, `matricula_nacional`, `matricula_provincial`, `descripcion`, `telefono`, `disponibilidad`, `correo_electronico`, `contrasena_hash`, `foto_perfil_url`, `valor`, `valor_internacional`, `creado_en`) VALUES
(10, 'Ivan', 'Lic. Psicologia', '789', '456', 'asdasdasdadasdasdasdasdasdasd', '1139114579', '24 horas', 'ivanrosendo@gmail.com', '$2b$10$l3FwOpPUgpy9gFFx6ABrGuKBsYr4zweB2rGoqkp7WfCUA.E6zUMqG', 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg', 10000.00, 100.00, '2025-03-03 21:37:00'),
(11, 'Test', 'Lic. Psiquiatria', '5844', '5894', 'adasdasdsadasdasdasdasd', '1139114579', '24 horas', 'paginaswebs2002@gmail.com', '$2b$10$gZLRZy01nJimeReLux0WSeZr.T.9d02ghmtA20lKME/Rgh8ALY4z6', 'https://s.france24.com/media/display/d58b579c-6ab0-11ed-8c29-005056a90284/w:1280/p:16x9/11-22-22%20Cristiano.jpg', 1000.00, 100.00, '2025-03-04 13:24:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_especialidad`
--

CREATE TABLE `profesional_especialidad` (
  `id_profesional` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesional_especialidad`
--

INSERT INTO `profesional_especialidad` (`id_profesional`, `id_especialidad`) VALUES
(10, 2),
(10, 3),
(11, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_disponibilidad` int(11) NOT NULL,
  `motivo_consulta` text NOT NULL,
  `estado` enum('confirmado','cancelado','completado') NOT NULL DEFAULT 'confirmado',
  `fecha_reserva` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_profesional`, `id_paciente`, `id_disponibilidad`, `motivo_consulta`, `estado`, `fecha_reserva`) VALUES
(1, 11, 3, 1, 'Dolor de cabeza', 'confirmado', '2025-03-06 21:58:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `correo_electronico` varchar(255) NOT NULL,
  `contrasena_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre` varchar(255) DEFAULT NULL,
  `id_google` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo_electronico`, `contrasena_hash`, `created_at`, `nombre`, `id_google`) VALUES
(2, 'ivanrosendo1102@gmail.com', NULL, '2025-03-04 00:07:10', 'Ivan Rosendo', '109221331586509303464'),
(3, 'test@test.com', '$2b$10$zaoahQ8W.2oLX5kAV8HwO.uXuf2BZKu9J5CIs7ZCOvghDxrlaylk2', '2025-03-04 16:50:39', 'Nuevo Usuario', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `disponibilidad_profesional`
--
ALTER TABLE `disponibilidad_profesional`
  ADD PRIMARY KEY (`id_disponibilidad`),
  ADD KEY `id_profesional` (`id_profesional`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD UNIQUE KEY `matricula_nacional` (`matricula_nacional`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD UNIQUE KEY `matricula_provincial` (`matricula_provincial`);

--
-- Indices de la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD PRIMARY KEY (`id_profesional`,`id_especialidad`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_disponibilidad` (`id_disponibilidad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `disponibilidad_profesional`
--
ALTER TABLE `disponibilidad_profesional`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `disponibilidad_profesional`
--
ALTER TABLE `disponibilidad_profesional`
  ADD CONSTRAINT `disponibilidad_profesional_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `turnos_ibfk_3` FOREIGN KEY (`id_disponibilidad`) REFERENCES `disponibilidad_profesional` (`id_disponibilidad`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
