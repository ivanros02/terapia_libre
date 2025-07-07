-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 07-07-2025 a las 09:12:31
-- Versión del servidor: 10.11.13-MariaDB-cll-lve-log
-- Versión de PHP: 8.3.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `terapial_terapia_libre_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `nombre`, `correo`, `contrasena`, `created_at`) VALUES
(1, 'Admin', 'admin@terapia.com', '$2b$10$MSdANBurinT8kDynwVIBj.zXuQn/XIu4Jlm1uJJy6EEbqKX5Pa3h6', '2025-03-25 13:14:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ausencias`
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
-- Volcado de datos para la tabla `ausencias`
--

INSERT INTO `ausencias` (`id_ausencia`, `id_profesional`, `fecha`, `hora_inicio`, `hora_fin`, `motivo`, `creado_en`) VALUES
(1, 25, '2025-05-31', '08:00:00', '17:00:00', 'hola hola', '2025-06-03 12:06:13'),
(2, 27, '2025-06-20', '08:00:00', '17:00:00', NULL, '2025-05-31 16:23:59'),
(3, 27, '2025-06-21', '08:00:00', '17:00:00', NULL, '2025-05-31 16:24:06'),
(4, 27, '2025-06-16', '08:00:00', '23:59:00', NULL, '2025-06-02 16:27:49'),
(5, 22, '2025-06-16', '08:00:00', '17:00:00', 'feriado nacional', '2025-06-02 19:59:55'),
(7, 22, '2025-08-18', '08:00:00', '17:00:00', 'feriado nacional ', '2025-06-02 20:01:23'),
(8, 25, '2025-06-03', '08:00:00', '17:00:00', NULL, '2025-06-03 12:07:35'),
(9, 41, '2025-07-07', '09:00:00', '19:00:00', NULL, '2025-06-03 12:12:08'),
(10, 22, '2025-07-28', '08:00:00', '17:00:00', NULL, '2025-06-04 17:00:37'),
(18, 125, '2025-06-16', '15:00:00', '16:00:00', NULL, '2025-06-13 23:42:43'),
(20, 125, '2025-06-18', '10:00:00', '11:00:00', NULL, '2025-06-13 23:42:02'),
(21, 125, '2025-06-18', '13:00:00', '14:00:00', NULL, '2025-06-13 23:42:12'),
(22, 125, '2025-06-19', '13:00:00', '14:00:00', NULL, '2025-06-13 23:41:39'),
(23, 125, '2025-06-19', '17:00:00', '18:00:00', NULL, '2025-06-13 23:41:49'),
(26, 129, '2025-06-23', '00:00:00', '23:59:00', NULL, '2025-06-10 22:09:09'),
(27, 129, '2025-06-30', '00:00:00', '23:59:00', NULL, '2025-06-10 22:09:52'),
(28, 129, '2025-07-07', '00:00:00', '23:59:00', NULL, '2025-06-10 22:10:05'),
(30, 129, '2025-06-11', '00:00:00', '23:59:00', NULL, '2025-06-10 22:11:42'),
(31, 129, '2025-06-13', '00:00:00', '23:59:00', NULL, '2025-06-10 22:11:54'),
(32, 129, '2025-06-18', '00:00:00', '23:59:00', NULL, '2025-06-10 22:12:09'),
(33, 129, '2025-06-25', '00:00:00', '23:59:00', NULL, '2025-06-10 22:12:27'),
(34, 129, '2025-06-27', '00:00:00', '23:59:00', NULL, '2025-06-10 22:12:37'),
(35, 129, '2025-07-02', '00:00:00', '23:59:00', NULL, '2025-06-10 22:12:50'),
(36, 129, '2025-07-04', '00:00:00', '23:59:00', NULL, '2025-06-10 22:12:58'),
(37, 129, '2025-07-09', '00:00:00', '23:59:00', NULL, '2025-06-10 22:13:09'),
(38, 129, '2025-07-11', '00:00:00', '23:59:00', NULL, '2025-06-10 22:13:29'),
(39, 125, '2025-06-18', '11:00:00', '12:00:00', NULL, '2025-06-13 23:39:39'),
(42, 27, '2025-06-19', '08:00:00', '17:00:00', NULL, '2025-06-19 22:03:26'),
(43, 141, '2025-06-24', '11:00:00', '12:00:00', NULL, '2025-06-21 15:53:36'),
(44, 141, '2025-06-24', '12:30:00', '13:30:00', NULL, '2025-06-21 15:54:05'),
(45, 141, '2025-06-24', '15:00:00', '16:00:00', NULL, '2025-06-21 15:56:28'),
(46, 141, '2025-06-24', '16:00:00', '17:00:00', NULL, '2025-06-21 15:56:54'),
(47, 141, '2025-06-25', '14:00:00', '15:00:00', NULL, '2025-06-21 15:58:38'),
(48, 141, '2025-06-25', '15:00:00', '16:00:00', NULL, '2025-06-21 15:58:54'),
(49, 27, '2025-07-02', '08:00:00', '20:00:00', NULL, '2025-06-30 17:24:40'),
(50, 22, '2025-08-04', '08:00:00', '17:00:00', NULL, '2025-06-30 19:02:22'),
(51, 22, '2025-08-11', '08:00:00', '17:00:00', NULL, '2025-06-30 19:02:30'),
(52, 22, '2025-08-25', '08:00:00', '17:00:00', NULL, '2025-06-30 19:02:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `id_chat` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones`
--

CREATE TABLE `cupones` (
  `codigo` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `descuento` decimal(5,2) NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `solo_una_vez` tinyint(1) DEFAULT 1,
  `dado_por` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupones_usados`
--

CREATE TABLE `cupones_usados` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `codigo_cupon` varchar(100) NOT NULL,
  `usado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_uso` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cupones_usados`
--

INSERT INTO `cupones_usados` (`id`, `id_usuario`, `codigo_cupon`, `usado_en`, `fecha_uso`) VALUES
(1, 43, 'PRIMERASESION', '2025-05-28 10:27:44', '0000-00-00'),
(2, 102, 'PRIMERASESION', '2025-06-01 18:16:36', '2025-06-01'),
(3, 104, 'PRIMERASESION', '2025-06-01 18:50:40', '2025-06-01'),
(4, 110, 'PRIMERASESION', '2025-06-01 20:32:08', '2025-06-01'),
(5, 117, 'PRIMERASESION', '2025-06-01 22:00:19', '2025-06-01'),
(6, 121, 'PRIMERASESION', '2025-06-02 00:05:28', '2025-06-02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disponibilidad`
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
-- Volcado de datos para la tabla `disponibilidad`
--

INSERT INTO `disponibilidad` (`id_disponibilidad`, `id_profesional`, `dia_semana`, `hora_inicio`, `hora_fin`, `creado_en`) VALUES
(39, 25, 'Lunes', '08:00:00', '17:00:00', '2025-04-23 12:12:31'),
(46, 28, 'Lunes', '17:00:00', '20:00:00', '2025-04-28 13:19:28'),
(49, 28, 'Martes', '14:00:00', '16:29:00', '2025-04-28 13:20:31'),
(50, 28, 'Viernes', '13:00:00', '18:00:00', '2025-04-28 13:20:58'),
(51, 28, 'Sábado', '10:00:00', '14:00:00', '2025-04-28 13:21:26'),
(52, 40, 'Lunes', '08:00:00', '08:45:00', '2025-04-29 15:29:17'),
(53, 40, 'Viernes', '17:30:00', '18:15:00', '2025-04-29 15:30:20'),
(54, 40, 'Martes', '08:00:00', '08:45:00', '2025-04-29 15:30:49'),
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
(83, 47, 'Sábado', '08:00:00', '12:00:00', '2025-04-30 22:21:57'),
(84, 46, 'Jueves', '12:00:00', '19:00:00', '2025-05-01 01:20:13'),
(85, 46, 'Viernes', '14:00:00', '18:00:00', '2025-05-01 01:21:31'),
(86, 46, 'Sábado', '09:00:00', '13:00:00', '2025-05-01 01:22:40'),
(91, 48, 'Lunes', '09:00:00', '10:00:00', '2025-05-05 12:54:52'),
(92, 48, 'Lunes', '13:00:00', '16:00:00', '2025-05-05 12:55:12'),
(95, 48, 'Miércoles', '09:00:00', '16:00:00', '2025-05-05 12:58:10'),
(97, 48, 'Jueves', '19:00:00', '21:00:00', '2025-05-05 12:59:21'),
(98, 48, 'Sábado', '14:30:00', '20:30:00', '2025-05-05 12:59:49'),
(101, 49, 'Lunes', '10:00:00', '10:50:00', '2025-05-05 19:06:52'),
(102, 49, 'Lunes', '11:00:00', '11:50:00', '2025-05-05 19:07:04'),
(103, 49, 'Jueves', '20:00:00', '20:50:00', '2025-05-05 19:27:23'),
(105, 49, 'Martes', '15:00:00', '15:50:00', '2025-05-05 19:28:13'),
(106, 49, 'Martes', '16:00:00', '16:50:00', '2025-05-05 19:30:21'),
(107, 49, 'Martes', '17:00:00', '17:50:00', '2025-05-05 19:30:35'),
(108, 49, 'Miércoles', '10:00:00', '10:50:00', '2025-05-05 19:30:47'),
(110, 49, 'Miércoles', '15:00:00', '15:50:00', '2025-05-05 19:31:23'),
(111, 49, 'Miércoles', '17:00:00', '17:50:00', '2025-05-05 19:31:36'),
(112, 49, 'Jueves', '10:00:00', '10:50:00', '2025-05-05 19:34:56'),
(114, 49, 'Jueves', '15:00:00', '15:50:00', '2025-05-05 19:35:14'),
(116, 49, 'Jueves', '16:00:00', '16:50:00', '2025-05-05 19:35:43'),
(117, 54, 'Lunes', '17:00:00', '20:00:00', '2025-05-06 14:15:18'),
(118, 54, 'Martes', '14:00:00', '20:00:00', '2025-05-06 14:16:26'),
(119, 54, 'Miércoles', '16:00:00', '20:00:00', '2025-05-06 14:16:49'),
(120, 54, 'Jueves', '16:00:00', '20:00:00', '2025-05-06 14:17:16'),
(121, 51, 'Martes', '08:00:00', '20:00:00', '2025-05-06 15:31:59'),
(122, 51, 'Miércoles', '14:00:00', '17:00:00', '2025-05-06 15:36:37'),
(123, 51, 'Lunes', '14:00:00', '16:00:00', '2025-05-06 15:38:12'),
(124, 51, 'Jueves', '14:00:00', '20:00:00', '2025-05-06 15:39:11'),
(125, 51, 'Viernes', '08:00:00', '17:00:00', '2025-05-06 15:39:29'),
(126, 57, 'Viernes', '08:00:00', '13:00:00', '2025-05-06 18:10:41'),
(127, 57, 'Jueves', '15:00:00', '19:00:00', '2025-05-06 18:12:06'),
(129, 57, 'Miércoles', '13:00:00', '15:00:00', '2025-05-06 20:55:55'),
(143, 63, 'Lunes', '18:00:00', '22:00:00', '2025-05-08 12:39:08'),
(144, 63, 'Martes', '18:00:00', '22:00:00', '2025-05-08 12:39:16'),
(145, 63, 'Miércoles', '20:30:00', '22:30:00', '2025-05-08 12:39:30'),
(146, 63, 'Jueves', '18:00:00', '22:00:00', '2025-05-08 12:39:40'),
(147, 63, 'Viernes', '18:00:00', '22:00:00', '2025-05-08 12:40:37'),
(148, 63, 'Sábado', '08:00:00', '13:00:00', '2025-05-08 12:40:50'),
(149, 57, 'Martes', '11:00:00', '15:00:00', '2025-05-08 14:06:59'),
(150, 65, 'Lunes', '08:00:00', '20:00:00', '2025-05-08 17:08:55'),
(151, 65, 'Martes', '08:00:00', '20:00:00', '2025-05-08 17:09:01'),
(152, 65, 'Miércoles', '08:00:00', '20:00:00', '2025-05-08 17:09:07'),
(153, 65, 'Jueves', '08:00:00', '20:00:00', '2025-05-08 17:09:14'),
(154, 65, 'Viernes', '08:00:00', '18:00:00', '2025-05-08 17:09:26'),
(157, 68, 'Lunes', '18:30:00', '21:00:00', '2025-05-11 04:56:42'),
(158, 68, 'Martes', '18:30:00', '21:00:00', '2025-05-11 04:56:52'),
(159, 68, 'Miércoles', '18:30:00', '21:00:00', '2025-05-11 04:56:58'),
(160, 68, 'Jueves', '18:30:00', '21:00:00', '2025-05-11 04:57:06'),
(161, 68, 'Viernes', '18:30:00', '22:00:00', '2025-05-11 04:57:15'),
(162, 68, 'Sábado', '10:00:00', '15:00:00', '2025-05-11 04:57:36'),
(168, 27, 'Sábado', '08:00:00', '17:00:00', '2025-05-15 13:45:05'),
(169, 27, 'Martes', '08:00:00', '17:00:00', '2025-05-15 13:45:41'),
(170, 27, 'Miércoles', '08:00:00', '17:00:00', '2025-05-15 13:45:46'),
(171, 27, 'Jueves', '08:00:00', '17:00:00', '2025-05-15 13:45:52'),
(172, 27, 'Viernes', '08:00:00', '17:00:00', '2025-05-15 13:45:55'),
(174, 75, 'Jueves', '08:00:00', '17:00:00', '2025-05-16 15:14:32'),
(175, 75, 'Martes', '08:00:00', '17:00:00', '2025-05-16 15:14:37'),
(181, 78, 'Lunes', '08:00:00', '20:00:00', '2025-05-19 19:26:56'),
(182, 78, 'Martes', '08:00:00', '20:00:00', '2025-05-19 19:27:03'),
(183, 78, 'Miércoles', '08:00:00', '20:00:00', '2025-05-19 19:27:09'),
(184, 78, 'Jueves', '08:00:00', '20:00:00', '2025-05-19 19:27:16'),
(185, 78, 'Viernes', '08:00:00', '20:00:00', '2025-05-19 19:27:21'),
(187, 49, 'Lunes', '12:00:00', '12:50:00', '2025-05-23 14:07:06'),
(188, 49, 'Lunes', '16:00:00', '16:50:00', '2025-05-23 14:07:33'),
(189, 49, 'Lunes', '17:00:00', '17:50:00', '2025-05-23 14:07:42'),
(190, 49, 'Lunes', '15:00:00', '15:50:00', '2025-05-23 14:17:13'),
(191, 49, 'Martes', '10:00:00', '10:50:00', '2025-05-23 14:17:27'),
(192, 49, 'Martes', '11:00:00', '11:50:00', '2025-05-23 14:17:41'),
(193, 49, 'Martes', '12:00:00', '12:50:00', '2025-05-23 14:17:52'),
(194, 49, 'Martes', '20:00:00', '20:50:00', '2025-05-23 14:18:21'),
(195, 49, 'Miércoles', '12:00:00', '12:50:00', '2025-05-23 14:18:42'),
(196, 49, 'Miércoles', '13:00:00', '13:50:00', '2025-05-23 14:18:54'),
(200, 40, 'Lunes', '19:00:00', '19:45:00', '2025-05-26 16:44:27'),
(201, 40, 'Lunes', '19:45:00', '20:30:00', '2025-05-26 16:44:57'),
(203, 40, 'Miércoles', '17:30:00', '18:15:00', '2025-05-26 16:46:15'),
(204, 40, 'Miércoles', '08:00:00', '08:45:00', '2025-05-26 16:46:49'),
(205, 40, 'Jueves', '08:00:00', '08:45:00', '2025-05-26 16:47:32'),
(206, 40, 'Viernes', '08:45:00', '09:30:00', '2025-05-26 16:47:54'),
(207, 40, 'Jueves', '08:45:00', '09:30:00', '2025-05-26 16:48:15'),
(208, 40, 'Jueves', '09:30:00', '10:15:00', '2025-05-26 16:48:34'),
(209, 40, 'Jueves', '10:15:00', '11:00:00', '2025-05-26 16:48:57'),
(210, 40, 'Jueves', '17:30:00', '18:15:00', '2025-05-26 16:49:20'),
(211, 40, 'Jueves', '19:45:00', '20:30:00', '2025-05-26 16:50:12'),
(213, 27, 'Sábado', '15:20:00', '22:00:00', '2025-05-28 20:21:54'),
(214, 22, 'Lunes', '15:00:00', '15:50:00', '2025-05-29 11:42:06'),
(215, 25, 'Sábado', '08:00:00', '20:00:00', '2025-05-31 01:45:04'),
(216, 81, 'Viernes', '14:00:00', '14:45:00', '2025-06-01 15:37:39'),
(217, 82, 'Martes', '08:00:00', '13:00:00', '2025-06-01 15:43:45'),
(218, 82, 'Jueves', '13:00:00', '15:00:00', '2025-06-01 15:45:29'),
(219, 84, 'Miércoles', '08:00:00', '16:00:00', '2025-06-01 16:15:30'),
(220, 84, 'Sábado', '08:00:00', '14:00:00', '2025-06-01 16:16:34'),
(221, 86, 'Lunes', '14:00:00', '22:03:00', '2025-06-01 17:05:13'),
(222, 86, 'Martes', '00:00:00', '22:03:00', '2025-06-01 17:05:29'),
(223, 86, 'Miércoles', '00:00:00', '22:03:00', '2025-06-01 17:05:35'),
(224, 86, 'Jueves', '15:00:00', '22:03:00', '2025-06-01 17:06:02'),
(225, 86, 'Sábado', '08:00:00', '15:03:00', '2025-06-01 17:06:21'),
(226, 90, 'Viernes', '08:30:00', '18:55:00', '2025-06-01 18:24:21'),
(228, 97, 'Jueves', '10:00:00', '19:00:00', '2025-06-01 21:24:28'),
(229, 99, 'Miércoles', '14:45:00', '18:30:00', '2025-06-01 22:05:25'),
(230, 99, 'Jueves', '09:00:00', '12:00:00', '2025-06-01 22:05:44'),
(231, 99, 'Martes', '09:30:00', '10:15:00', '2025-06-01 22:13:19'),
(232, 99, 'Martes', '09:30:00', '10:15:00', '2025-06-01 22:13:19'),
(233, 101, 'Lunes', '08:00:00', '10:00:00', '2025-06-01 22:25:11'),
(234, 83, 'Martes', '10:00:00', '14:45:00', '2025-06-02 00:33:53'),
(235, 83, 'Viernes', '10:15:00', '23:30:00', '2025-06-02 00:34:31'),
(236, 83, 'Lunes', '08:20:00', '09:45:00', '2025-06-02 00:35:37'),
(237, 108, 'Lunes', '11:00:00', '17:00:00', '2025-06-02 01:20:57'),
(238, 108, 'Miércoles', '11:00:00', '19:00:00', '2025-06-02 01:21:26'),
(239, 108, 'Jueves', '11:00:00', '15:00:00', '2025-06-02 01:21:43'),
(241, 80, 'Lunes', '18:30:00', '19:45:00', '2025-06-02 06:25:26'),
(242, 118, 'Lunes', '08:00:00', '16:00:00', '2025-06-02 11:35:07'),
(243, 118, 'Martes', '08:00:00', '16:00:00', '2025-06-02 11:35:16'),
(244, 118, 'Miércoles', '08:00:00', '16:00:00', '2025-06-02 11:35:21'),
(245, 118, 'Jueves', '08:00:00', '16:00:00', '2025-06-02 11:35:25'),
(246, 118, 'Viernes', '08:00:00', '16:00:00', '2025-06-02 11:35:30'),
(247, 118, 'Sábado', '09:00:00', '13:00:00', '2025-06-02 11:35:52'),
(249, 41, 'Viernes', '10:00:00', '10:45:00', '2025-06-02 12:25:54'),
(251, 41, 'Lunes', '15:00:00', '15:45:00', '2025-06-02 12:28:28'),
(252, 41, 'Martes', '13:00:00', '13:45:00', '2025-06-02 12:28:54'),
(255, 102, 'Lunes', '12:00:00', '16:00:00', '2025-06-02 13:09:28'),
(256, 102, 'Martes', '15:00:00', '17:00:00', '2025-06-02 13:09:48'),
(257, 102, 'Viernes', '12:00:00', '16:00:00', '2025-06-02 13:10:22'),
(258, 27, 'Lunes', '08:00:00', '17:00:00', '2025-06-02 13:27:24'),
(259, 121, 'Lunes', '09:45:00', '16:00:00', '2025-06-02 14:56:38'),
(260, 121, 'Martes', '08:00:00', '19:00:00', '2025-06-02 14:58:02'),
(261, 121, 'Miércoles', '08:00:00', '12:30:00', '2025-06-02 14:59:07'),
(262, 121, 'Jueves', '08:00:00', '12:30:00', '2025-06-02 14:59:30'),
(263, 121, 'Viernes', '08:00:00', '16:00:00', '2025-06-02 14:59:59'),
(264, 119, 'Viernes', '14:25:00', '18:15:00', '2025-06-02 15:31:15'),
(265, 89, 'Lunes', '11:00:00', '14:00:00', '2025-06-02 15:42:22'),
(266, 89, 'Martes', '14:00:00', '18:00:00', '2025-06-02 15:42:51'),
(267, 89, 'Miércoles', '17:00:00', '18:00:00', '2025-06-02 15:43:10'),
(268, 61, 'Martes', '12:30:00', '19:00:00', '2025-06-02 16:03:10'),
(271, 77, 'Viernes', '09:00:00', '16:00:00', '2025-06-02 18:07:51'),
(272, 111, 'Lunes', '08:30:00', '09:30:00', '2025-06-02 18:38:54'),
(273, 111, 'Martes', '08:30:00', '09:30:00', '2025-06-02 18:39:03'),
(274, 111, 'Viernes', '06:30:00', '21:00:00', '2025-06-02 18:39:08'),
(276, 116, 'Lunes', '13:00:00', '18:00:00', '2025-06-03 16:54:52'),
(277, 116, 'Martes', '13:00:00', '18:00:00', '2025-06-03 16:55:10'),
(278, 116, 'Miércoles', '17:30:00', '20:30:00', '2025-06-03 16:55:56'),
(279, 116, 'Jueves', '13:30:00', '17:30:00', '2025-06-03 16:56:41'),
(280, 116, 'Viernes', '13:30:00', '19:30:00', '2025-06-03 16:57:22'),
(282, 123, 'Miércoles', '09:00:00', '15:00:00', '2025-06-04 14:30:22'),
(285, 41, 'Lunes', '17:00:00', '17:45:00', '2025-06-06 15:11:02'),
(287, 125, 'Martes', '14:00:00', '18:00:00', '2025-06-07 14:13:01'),
(288, 125, 'Miércoles', '09:00:00', '18:00:00', '2025-06-07 14:17:49'),
(289, 125, 'Lunes', '14:00:00', '18:00:00', '2025-06-07 14:18:02'),
(290, 125, 'Jueves', '09:00:00', '17:00:00', '2025-06-07 14:18:47'),
(293, 76, 'Lunes', '17:00:00', '19:00:00', '2025-06-07 14:34:15'),
(294, 76, 'Lunes', '10:00:00', '11:00:00', '2025-06-07 14:35:11'),
(296, 76, 'Miércoles', '10:00:00', '11:00:00', '2025-06-07 14:35:53'),
(297, 76, 'Miércoles', '14:00:00', '15:00:00', '2025-06-07 14:36:11'),
(298, 76, 'Miércoles', '19:00:00', '20:00:00', '2025-06-07 14:36:41'),
(299, 76, 'Jueves', '18:00:00', '20:00:00', '2025-06-07 14:37:06'),
(300, 76, 'Viernes', '18:00:00', '19:00:00', '2025-06-07 14:37:53'),
(301, 119, 'Sábado', '07:00:00', '11:00:00', '2025-06-08 12:35:10'),
(302, 119, 'Lunes', '14:00:00', '16:00:00', '2025-06-08 12:35:34'),
(303, 119, 'Martes', '14:00:00', '19:00:00', '2025-06-08 12:35:51'),
(304, 119, 'Miércoles', '14:20:00', '17:15:00', '2025-06-08 12:36:41'),
(305, 119, 'Jueves', '02:00:00', '18:15:00', '2025-06-08 12:37:17'),
(307, 129, 'Lunes', '10:00:00', '18:00:00', '2025-06-10 22:05:22'),
(308, 129, 'Viernes', '10:00:00', '18:00:00', '2025-06-10 22:10:54'),
(309, 129, 'Miércoles', '10:00:00', '18:00:00', '2025-06-10 22:11:21'),
(311, 130, 'Lunes', '08:00:00', '10:00:00', '2025-06-11 10:58:42'),
(312, 131, 'Sábado', '08:00:00', '16:00:00', '2025-06-11 16:01:43'),
(313, 134, 'Lunes', '06:00:00', '17:00:00', '2025-06-11 16:15:19'),
(314, 134, 'Miércoles', '06:00:00', '17:00:00', '2025-06-11 16:15:28'),
(315, 134, 'Jueves', '06:00:00', '17:00:00', '2025-06-11 16:15:37'),
(316, 134, 'Martes', '06:00:00', '17:00:00', '2025-06-11 16:15:45'),
(321, 132, 'Lunes', '08:00:00', '21:00:00', '2025-06-17 14:29:53'),
(322, 132, 'Sábado', '08:00:00', '19:00:00', '2025-06-17 14:30:44'),
(323, 132, 'Miércoles', '09:00:00', '19:00:00', '2025-06-17 14:30:55'),
(324, 132, 'Jueves', '09:00:00', '11:00:00', '2025-06-17 14:31:12'),
(325, 132, 'Jueves', '15:00:00', '21:00:00', '2025-06-17 14:31:25'),
(326, 132, 'Viernes', '08:00:00', '13:00:00', '2025-06-17 14:31:49'),
(327, 132, 'Viernes', '17:00:00', '20:00:00', '2025-06-17 14:38:59'),
(330, 138, 'Lunes', '08:00:00', '17:00:00', '2025-06-19 17:35:12'),
(331, 138, 'Martes', '17:00:00', '21:00:00', '2025-06-19 17:35:37'),
(332, 138, 'Miércoles', '09:00:00', '12:00:00', '2025-06-19 17:36:07'),
(333, 138, 'Jueves', '09:00:00', '15:00:00', '2025-06-19 17:36:39'),
(334, 138, 'Viernes', '14:00:00', '19:00:00', '2025-06-19 17:37:20'),
(335, 139, 'Lunes', '14:00:00', '20:00:00', '2025-06-19 20:01:29'),
(337, 139, 'Miércoles', '16:00:00', '20:00:00', '2025-06-19 20:01:40'),
(338, 139, 'Jueves', '09:00:00', '19:00:00', '2025-06-19 20:01:44'),
(339, 139, 'Viernes', '08:00:00', '19:00:00', '2025-06-19 20:01:48'),
(340, 27, 'Lunes', '08:00:00', '17:00:00', '2025-06-19 22:03:05'),
(354, 41, 'Miércoles', '11:15:00', '12:00:00', '2025-06-20 14:21:36'),
(355, 137, 'Lunes', '16:00:00', '21:00:00', '2025-06-21 15:26:25'),
(356, 137, 'Martes', '16:00:00', '21:00:00', '2025-06-21 15:26:39'),
(359, 137, 'Miércoles', '09:00:00', '14:00:00', '2025-06-21 15:30:27'),
(360, 137, 'Jueves', '15:00:00', '21:00:00', '2025-06-21 15:31:59'),
(361, 137, 'Viernes', '15:00:00', '21:00:00', '2025-06-21 15:32:16'),
(362, 141, 'Lunes', '09:00:00', '18:00:00', '2025-06-21 15:44:19'),
(363, 141, 'Martes', '12:00:00', '21:00:00', '2025-06-21 15:44:59'),
(364, 141, 'Miércoles', '09:00:00', '21:00:00', '2025-06-21 15:45:41'),
(365, 141, 'Jueves', '15:00:00', '21:00:00', '2025-06-21 15:46:16'),
(366, 141, 'Viernes', '09:00:00', '17:00:00', '2025-06-21 15:47:02'),
(367, 141, 'Sábado', '09:00:00', '16:00:00', '2025-06-21 15:47:38'),
(370, 140, 'Sábado', '08:00:00', '13:00:00', '2025-06-21 16:01:03'),
(371, 140, 'Lunes', '14:00:00', '20:00:00', '2025-06-21 16:01:28'),
(372, 140, 'Martes', '14:00:00', '20:00:00', '2025-06-21 16:01:39'),
(373, 140, 'Miércoles', '17:00:00', '20:00:00', '2025-06-21 16:01:50'),
(374, 140, 'Jueves', '14:00:00', '20:00:00', '2025-06-21 16:02:13'),
(376, 140, 'Viernes', '08:00:00', '11:00:00', '2025-06-21 16:02:38'),
(377, 140, 'Viernes', '14:00:00', '20:00:00', '2025-06-21 16:03:03'),
(378, 72, 'Lunes', '14:00:00', '16:30:00', '2025-06-22 15:33:13'),
(379, 72, 'Viernes', '18:00:00', '20:00:00', '2025-06-23 12:27:05'),
(383, 72, 'Martes', '13:00:00', '15:00:00', '2025-06-27 13:08:44'),
(384, 46, 'Lunes', '12:00:00', '18:00:00', '2025-07-01 14:22:22'),
(385, 76, 'Viernes', '16:00:00', '17:00:00', '2025-07-01 20:56:05'),
(386, 62, 'Miércoles', '20:00:00', '21:00:00', '2025-07-06 23:20:15'),
(387, 144, 'Martes', '09:00:00', '12:00:00', '2025-07-07 03:04:02'),
(388, 144, 'Jueves', '09:00:00', '12:00:00', '2025-07-07 03:04:11'),
(389, 144, 'Miércoles', '15:00:00', '18:00:00', '2025-07-07 03:04:39'),
(390, 144, 'Lunes', '15:00:00', '18:00:00', '2025-07-07 03:04:49'),
(391, 145, 'Miércoles', '15:00:00', '19:00:00', '2025-07-07 04:51:11'),
(392, 146, 'Lunes', '08:00:00', '20:00:00', '2025-07-07 06:31:09'),
(393, 146, 'Martes', '08:00:00', '20:00:00', '2025-07-07 06:31:57'),
(394, 146, 'Miércoles', '08:00:00', '20:00:00', '2025-07-07 06:32:08'),
(395, 146, 'Jueves', '08:00:00', '20:00:00', '2025-07-07 06:32:17'),
(396, 146, 'Viernes', '08:00:00', '18:00:00', '2025-07-07 06:32:57');

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
-- Estructura de tabla para la tabla `mensajes`
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
-- Estructura de tabla para la tabla `notificaciones`
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
-- Estructura de tabla para la tabla `pagos`
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
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id_pago`, `id_turno`, `monto`, `metodo_pago`, `estado`, `id_transaccion`, `fecha_pago`) VALUES
(38, 62, 1.00, 'MercadoPago', 'Pagado', '109024353601', '2025-04-25 14:15:24'),
(39, 72, 1.00, 'MercadoPago', 'Pagado', '109036085063', '2025-04-25 15:54:26'),
(40, 73, 1.00, 'MercadoPago', 'Pagado', '109036097773', '2025-04-25 15:55:08'),
(41, 74, 1.00, 'MercadoPago', 'Pagado', '109036591865', '2025-04-25 15:59:33'),
(42, 75, 1.00, 'MercadoPago', 'Pagado', '109036963493', '2025-04-25 16:02:55'),
(43, 79, 1.00, 'MercadoPago', 'Pagado', '109479683714', '2025-04-25 16:21:25'),
(44, 80, 1.00, 'MercadoPago', 'Pagado', '109039679379', '2025-04-25 16:29:52'),
(45, 84, 1.00, 'MercadoPago', 'Pagado', '109042625263', '2025-04-25 17:00:10'),
(46, 85, 1.00, 'MercadoPago', 'Pagado', '109483594106', '2025-04-25 17:01:01'),
(47, 86, 1.00, 'MercadoPago', 'Pagado', '109044766309', '2025-04-25 17:22:47'),
(48, 87, 1.00, 'MercadoPago', 'Pagado', '109492083688', '2025-04-25 18:38:09'),
(49, 89, 1.00, 'MercadoPago', 'Pagado', '109053869003', '2025-04-25 19:06:10'),
(50, 100, 1.00, 'MercadoPago', 'Pagado', '109501705646', '2025-04-25 20:18:21'),
(51, 109, 1.00, 'MercadoPago', 'Pagado', '109552966798', '2025-04-26 11:31:48'),
(52, 129, 1.00, 'MercadoPago', 'Pagado', '110154150601', '2025-05-06 16:34:24'),
(53, 62, 1.00, 'MercadoPago', 'Pagado', '109240219870', '2025-05-11 11:12:09'),
(54, 72, 1.00, 'MercadoPago', 'Pagado', '108816098649', '2025-05-11 13:42:22'),
(55, 132, 1.00, 'MercadoPago', 'Pagado', '109255685990', '2025-05-11 13:54:27'),
(56, 141, 1.00, 'MercadoPago', 'Pagado', '110887564635', '2025-05-12 14:41:03'),
(57, 144, 1.00, 'MercadoPago', 'Pagado', '111440135014', '2025-05-13 11:52:39'),
(59, 146, 1.00, 'MercadoPago', 'Pagado', '111004312433', '2025-05-13 14:33:47'),
(70, 150, 1.00, 'MercadoPago', 'Pagado', '111027247513', '2025-05-13 18:07:32'),
(74, 153, 1.00, 'MercadoPago', 'Pagado', '111693658764', '2025-05-15 14:40:22'),
(75, 154, 1.00, 'MercadoPago', 'Pagado', '111363051365', '2025-05-16 15:16:56'),
(77, 155, 1.00, 'MercadoPago', 'Pagado', '112606416895', '2025-05-28 12:46:34'),
(78, 156, 0.40, 'MercadoPago', 'Pagado', '113078963722', '2025-05-28 13:27:44'),
(79, 157, 1.00, 'MercadoPago', 'Pagado', '112611328459', '2025-05-28 13:34:48'),
(80, 158, 7400.00, 'MercadoPago', 'Pagado', '113066029257', '2025-06-01 16:33:14'),
(81, 159, 23000.00, 'MercadoPago', 'Pagado', '113072560095', '2025-06-01 17:54:37'),
(82, 160, 9200.00, 'MercadoPago', 'Pagado', '113559305410', '2025-06-01 21:16:36'),
(83, 161, 9200.00, 'MercadoPago', 'Pagado', '113091212735', '2025-06-01 21:50:40'),
(84, 162, 8000.00, 'MercadoPago', 'Pagado', '113100507075', '2025-06-01 23:32:08'),
(85, 163, 8000.00, 'MercadoPago', 'Pagado', '113107637485', '2025-06-02 01:00:19'),
(86, 164, 9200.00, 'MercadoPago', 'Pagado', '113585784436', '2025-06-02 03:05:28'),
(87, 165, 23000.00, 'MercadoPago', 'Pagado', '113179544751', '2025-06-02 17:42:56'),
(88, 166, 18500.00, 'MercadoPago', 'Pagado', '113185640547', '2025-06-02 18:40:21'),
(89, 167, 18500.00, 'MercadoPago', 'Pagado', '113185689661', '2025-06-02 18:41:24'),
(90, 168, 18500.00, 'MercadoPago', 'Pagado', '113657473188', '2025-06-02 18:42:21'),
(91, 169, 23000.00, 'MercadoPago', 'Pagado', '113201117501', '2025-06-02 20:51:52'),
(92, 170, 30000.00, 'MercadoPago', 'Pagado', '113261530105', '2025-06-03 12:19:07'),
(93, 171, 23000.00, 'MercadoPago', 'Pagado', '113760174050', '2025-06-03 15:51:39'),
(94, 172, 23000.00, 'MercadoPago', 'Pagado', '113624765385', '2025-06-06 09:48:55'),
(95, 173, 20000.00, 'MercadoPago', 'Pagado', '113788710695', '2025-06-07 14:59:36'),
(96, 174, 20000.00, 'MercadoPago', 'Pagado', '114248614787', '2025-06-11 13:46:52'),
(97, 175, 23000.00, 'MercadoPago', 'Pagado', '114433271251', '2025-06-12 22:40:39'),
(98, 176, 30000.00, 'MercadoPago', 'Pagado', '114435573533', '2025-06-12 22:59:30'),
(99, 177, 25000.00, 'MercadoPago', 'Pagado', '114651418737', '2025-06-14 18:48:40'),
(100, 178, 25000.00, 'MercadoPago', 'Pagado', '115291698582', '2025-06-16 12:44:24'),
(101, 179, 23000.00, 'MercadoPago', 'Pagado', '114932182047', '2025-06-17 14:02:26'),
(102, 180, 23000.00, 'MercadoPago', 'Pagado', '114989780571', '2025-06-17 22:11:52'),
(103, 181, 20000.00, 'MercadoPago', 'Pagado', '115001248745', '2025-06-17 23:45:56'),
(104, 182, 20000.00, 'MercadoPago', 'Pagado', '115139521247', '2025-06-19 02:44:40'),
(105, 183, 23000.00, 'MercadoPago', 'Pagado', '115699276924', '2025-06-19 19:36:23'),
(106, 184, 25000.00, 'MercadoPago', 'Pagado', '115706447330', '2025-06-19 20:41:32'),
(107, 185, 20000.00, 'MercadoPago', 'Pagado', '115976010206', '2025-06-22 05:09:29'),
(108, 186, 20000.00, 'MercadoPago', 'Pagado', '115628281565', '2025-06-23 18:31:59'),
(109, 189, 25000.00, 'MercadoPago', 'Pagado', '115710183261', '2025-06-24 14:53:18'),
(110, 190, 25000.00, 'MercadoPago', 'Pagado', '116201765744', '2025-06-24 15:21:47'),
(111, 191, 23000.00, 'MercadoPago', 'Pagado', '115976441187', '2025-06-26 20:51:18'),
(112, 192, 20000.00, 'MercadoPago', 'Pagado', '116525830490', '2025-06-27 11:18:03'),
(113, 193, 23000.00, 'MercadoPago', 'Pagado', '116554251216', '2025-06-27 15:48:41'),
(114, 194, 23000.00, 'MercadoPago', 'Pagado', '116872787552', '2025-06-30 17:30:46'),
(115, 195, 20500.00, 'MercadoPago', 'Pagado', '116882212724', '2025-06-30 18:51:42'),
(116, 196, 20500.00, 'MercadoPago', 'Pagado', '116882442224', '2025-06-30 18:52:16'),
(117, 197, 20500.00, 'MercadoPago', 'Pagado', '116389662621', '2025-06-30 18:52:49'),
(118, 198, 20500.00, 'MercadoPago', 'Pagado', '116389697003', '2025-06-30 18:53:39'),
(119, 199, 20500.00, 'MercadoPago', 'Pagado', '116389665781', '2025-06-30 18:54:14'),
(120, 200, 20500.00, 'MercadoPago', 'Pagado', '116389723835', '2025-06-30 18:54:49'),
(121, 201, 23000.00, 'MercadoPago', 'Pagado', '116458427989', '2025-07-01 09:58:28'),
(122, 202, 25000.00, 'MercadoPago', 'Pagado', '116962062054', '2025-07-01 12:07:45'),
(123, 203, 20000.00, 'MercadoPago', 'Pagado', '116970176580', '2025-07-01 13:11:42'),
(124, 204, 25000.00, 'MercadoPago', 'Pagado', '117266998606', '2025-07-03 19:57:44'),
(125, 205, 20000.00, 'MercadoPago', 'Pagado', '117627018336', '2025-07-06 18:56:46'),
(126, 206, 22000.00, 'MercadoPago', 'Pagado', '117642701976', '2025-07-06 21:54:02'),
(127, 207, 22000.00, 'MercadoPago', 'Pagado', '117148571183', '2025-07-06 22:23:38'),
(128, 208, 23000.00, 'MercadoPago', 'Pagado', '117645950988', '2025-07-06 22:25:28'),
(129, 209, 20000.00, 'MercadoPago', 'Pagado', '117649744140', '2025-07-06 23:02:30'),
(130, 210, 20000.00, 'MercadoPago', 'Pagado', '117154410711', '2025-07-06 23:20:50'),
(131, 211, 20000.00, 'MercadoPago', 'Pagado', '117154527847', '2025-07-06 23:22:53'),
(132, 212, 20000.00, 'MercadoPago', 'Pagado', '117160004845', '2025-07-07 00:17:13'),
(133, 213, 20000.00, 'MercadoPago', 'Pagado', '117659168256', '2025-07-07 00:41:23'),
(134, 214, 20000.00, 'MercadoPago', 'Pagado', '117163170811', '2025-07-07 00:53:15'),
(135, 215, 20000.00, 'MercadoPago', 'Pagado', '117662834526', '2025-07-07 01:26:47'),
(136, 216, 25000.00, 'MercadoPago', 'Pagado', '117166262935', '2025-07-07 01:34:22'),
(137, 217, 25000.00, 'MercadoPago', 'Pagado', '117171255475', '2025-07-07 02:58:40'),
(138, 218, 25000.00, 'MercadoPago', 'Pagado', '117669636600', '2025-07-07 03:26:37'),
(139, 219, 25000.00, 'MercadoPago', 'Pagado', '117686071472', '2025-07-07 10:21:15'),
(140, 220, 20000.00, 'MercadoPago', 'Pagado', '117188785639', '2025-07-07 10:27:37'),
(141, 221, 25000.00, 'MercadoPago', 'Pagado', '117686458978', '2025-07-07 10:27:51'),
(142, 222, 25000.00, 'MercadoPago', 'Pagado', '117193098269', '2025-07-07 11:13:30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
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
  `reset_token_expira` bigint(20) DEFAULT NULL,
  `cbu` varchar(255) DEFAULT NULL,
  `cuit` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `nombre`, `titulo_universitario`, `matricula_nacional`, `matricula_provincial`, `descripcion`, `telefono`, `disponibilidad`, `correo_electronico`, `contrasena_hash`, `foto_perfil_url`, `valor`, `valor_internacional`, `creado_en`, `estado`, `reset_token`, `reset_token_expira`, `cbu`, `cuit`) VALUES
(22, 'Antonella Re', 'Lic. Psicologia ', '81503', NULL, 'Hola! Soy Acompañante terapéutico y psicoanalista. Trabajo con adolescentes, adultos y adultos mayores de forma virtual.  Me recibí en la UBA con promedio 8, y actualmente curso el segundo posgrado de Ulloa además de los múltiples cursos y seminarios que hago continuamente. La empatía y la ternura son dos pilares fundamentales, como dice Ulloa, para la labor analítica y no caer en la indolencia. La salud mental es un derecho y priorizo un honorario accesible y ético, teniendo siempre presente el sufrimiento con el que viene cada sujeto, superando muchas resistencias a pedir ayuda.', '11535793317', '72 horas', 'antonellare@gmail.com', '$2b$10$TUs3b6tH2Uakly69Fyo4/ukCHaTCnCnnhHKDvuwP5.F.MogRTC5zO', 'https://drive.google.com/uc?export=view&id=11rpztMJpooEM5wGyhDCKWddddiNrhs7e', 20500.00, 15.00, '2025-04-17 14:17:22', 1, NULL, NULL, NULL, NULL),
(25, 'Walter Rosendo', 'MEDICO PSIQUIATRICO', '35', NULL, 'Especialiesta ', '11615', '48 horas', 'wfrosendo@gmail.com', '$2b$10$zei9bCxTMRikWygKmkZRT.bx0bQSjMxu3enTLI4mjeNJyztXiJWO2', 'a', 1.00, 1.00, '2025-04-23 06:19:52', 0, NULL, NULL, NULL, NULL),
(27, 'Fernanda', 'Psicologa', '2', '1', ':)', 'TL', '48 horas', 'florencia.tamburelli@santodomingo.edu.ar', '$2b$10$S5eiBffRYcSpCkUt/FUyN.cJhTQjeP6eEGC6ySddwR35AuSvrOHBq', 'https://drive.google.com/uc?export=view&id=14-dPGsUkJi6u3ld_OraTIGET6k3cCELf', 1.00, 1.00, '2025-04-24 04:46:30', 0, NULL, NULL, NULL, NULL),
(28, 'Sebastian Racki', 'Lic. en Psicología', '83656', NULL, 'Soy psicuanalista con más de 7 años de experiencia trabajando con adolescentes, adultos y con la inmigración latino-americana en Australia y europa. ', '1169756308', '24 horas', 'sebiracki95@gmail.com', '$2b$10$W2B7VZAY0CIiRsefq7zpEukpLPUGZH8P13YFTcz5hu/bTbtyAqTOG', 'https://drive.google.com/uc?export=view&id=1ZxK5sx5e_XdAaqseOZ7mIncQgvgzyqtV', 25000.00, 25.00, '2025-04-28 18:32:15', 0, NULL, NULL, NULL, NULL),
(31, 'MICAELA NICOLAU', 'Lic. en Psicología', NULL, '11096', 'Psicóloga con orientación psiconalítica. Trabajo con jóvenes y adultos, de manera online y presencial (en Cba Capital).', '+5493491442263', '24 horas', 'micaelaanicolau@gmail.com', '$2b$10$OM4EJ0d2VGRJgLP.FWq0Ju0t12uqqE0hXZHXePavHwB8ZhIYxhZSK', 'https://drive.google.com/uc?export=view&id=1SczZReawvM6O0GjyniIfUMtty_rskFAg', 25000.00, 25.00, '2025-04-28 18:00:25', 0, NULL, NULL, NULL, NULL),
(32, 'Lucia Salomon', 'Lic. en Terapia Ocupacional', NULL, 'MPO 122', 'Lucía Salomón es Licenciada en Terapia Ocupacional por la Universidad Nacional de Mar del Plata, Argentina. En su formación de posgrado ha recorrido áreas diversas (modelos vinculados a la clínica pediátrica, modelo social de discapacidad , planificación centrada en la persona, experiencias de trabajo corporal integral, trabajo integral con adolescentes jóvenes y familias, entre otros) y actualmente se encuentra realizando una Maestría en Terapia Ocupacional en la Universidad Nacional de Quilmes.\nSe desempeña como TO en un equipo interdisciplinario que trabaja con jóvenes en contextos educativos, acompañándolos en la reflexión y acción sobre sus proyectos de vida.\nTambién se desempeña como docente de la asignatura “Dinámica de Grupos” del tercer año de la Licenciatura en Terapia Ocupacional de la Facultad de Ciencias de la Salud y Trabajo Social de la Universidad Nacional de Mar del Plata. En esta facultad también forma parte de un Programa de Acceso, Ingreso y Permanencia y Vida Universitaria, realizando un trabajo articulado con docentes y estudiantes ingresantes y como parte de un proyecto de investigación. ', '2235405493', '24 horas', 'toluciasalomon@gmail.com', '$2b$10$I6veOB/hMQoFDtH7GiDSbO3bjPOGZ.qArps8PlSsW7k9Jr4FJuvVm', 'https://drive.google.com/uc?export=view&id=11PttJmqkm4Ihki2WHCYGkv8OfFIJ06VS', 20000.00, 20.00, '2025-04-28 22:08:14', 0, NULL, NULL, NULL, NULL),
(37, 'Prueba', 'Psicologa', '0000000000000000000', '00000000000000000000000000', 'X', '2494495766', '24 horas', 'florencia.tamburelli@terapialibre.com', '$2b$10$VU/ukg3M3jRtSuf9WQOeDOjOCunniNLjpk317iK0BTYOxe.dzVUZW', '', 1.00, 1.00, '2025-04-29 14:25:23', 0, NULL, NULL, NULL, NULL),
(38, 'Milagros Santa Coloma', 'Lic. en Psicologia', '64727', NULL, 'Mi nombre es Milagros soy artista y licenciada en psicología, realicé mi especialización en psicología clínica en el servicio de Salud Mental del Hospital Ramos Mejía. Cuento con amplia experiencia en asistencia a pacientes en distintos ámbitos. Trabajé en instituciones públicas, privadas, fundaciones y de manera particular atendiendo, niños, adolescentes y adultos.\nEl espacio que ofrezco apunta a que el paciente logre de a poco escucharse a sí mismo en lo que está diciendo, ya que muchas veces hay una parte inconsciente del propio mal estar que es desconocida para el sujeto. A medida que se va tomando conocimiento de esto mediante la palabra, es que se logra aliviar algo de lo que uno sufre.\nNo es fácil hacer terapia, uno se encuentra con angustias, partes de si mismo que no quisiera, frustraciones y enojos en el camino, a la vez, es muy interesante lo que uno puede descubrir respecto de sí mismo y de todo lo que tiene para dar, lo he atravesado en mi propia experiencia analítica. Abierta a consutlas. Atiendo online y presencial.', '1156050718', '24 horas', 'milisantacoloma@gmail.com', '$2b$10$x3o1VypMP2iW93fPY9Qx2OWeilVNJLbUf7FNog8yyLC2u9irK.2Hm', 'https://drive.google.com/uc?export=view&id=1xOAste69Io7Ms5yhzFpGOl0o3oLChVun', 25000.00, 30.00, '2025-04-29 14:37:24', 0, NULL, NULL, NULL, NULL),
(40, 'Maria Elena Tallarico', 'Lic. en Psicologia', '56095', NULL, 'Psicóloga con más de 10 años de experiencia. Enfoco mi práctica, en la atención a trastornos como ansiedad, depresión, estrés, fobias, baja autoestima y manejo de emociones. También brindo apoyo en situaciones de duelo, conflictos familiares o de pareja, y en procesos de autoconocimiento y desarrollo personal. Trabajo con adolescentes, adultos y adultos mayores, proporcionando herramientas para mejorar el bienestar emocional, la gestión de conflictos y el crecimiento personal. Mi objetivo es ofrecer un espacio seguro y confidencial donde puedan explorar sus dificultades, encontrar soluciones efectivas y fortalecer su salud mental para lograr una mejor calidad de vida.', '1165311743', '24 horas', 'lictallarico@gmail.com', '$2b$10$TqvyXswmyN7UaffT01FDT.N48.YWAnDnXYXhz9tQjub3a5xsJt1GO', 'https://drive.google.com/uc?export=view&id=10ds_Zvf8JJJZLk_XTlshwqOab1Vlj_2v', 24000.00, 30.00, '2025-04-29 15:04:46', 0, NULL, NULL, NULL, NULL),
(41, 'Josefina Arrastua', 'Lic. en Psicología.', NULL, '35647', ' Lic. En psicología (UNLP) con 8 años de experiencia acompañando adolescentes y adultos en hospital público y sector privado, trabajo desde un enfoque integral de la salud mental con tratamientos personalizados según las necesidades de cada consultante. Realizo psicología clínica, principalmente con orientación psicoanalítica, me desempeño como psicóloga forense y en procesos de evaluación laboral/orientación vocacional.', '2281409382', '24 horas', 'Josefina.arrastua@outlook.com', '$2b$10$eQ8pqN.BynRALu4auhaJYeVuXXmWWi0mF4RaHq6MLapet1ieseiDu', 'https://drive.google.com/file/d/175TncTD2eLk6FA1LSWsKT7oVVCBaeKpm/view?usp=sharing', 25000.00, 35.00, '2025-04-30 23:17:01', 1, NULL, NULL, NULL, NULL),
(43, 'Fatima Gago', 'Lic. en Psicologia', '83289', NULL, 'Hola! mi nombre es Fatima y soy\nPsicóloga recibida en la Universidad del Salvador. Actualmente trabajo desde un enfoque Gestaltico, de manera virtual y presencial, en la zona de Belgrano.\nEn lo personal y profesional, considero que la terapia es una herramienta poderosa que nos invita a despertar nuestros sentidos y conectar con nuestras experiencias. Me apasiona acompañar personas en este proceso dentro de un espacio seguro, confidencial y libre de juicios.', '1139293373', '24 horas', 'fatima.gago2000@gmail.com', '$2b$10$GvqnvotSHQsm27QV.y7EuuPiklYZJ2JYP.5rhXnK9yB9yTlllNKsG', 'https://drive.google.com/uc?export=view&id=1oEmtx2mrbuYO20KQytmw_UiiB02bGfbK', 18000.00, 30.00, '2025-04-29 17:35:54', 0, NULL, NULL, NULL, NULL),
(44, 'maria', 'Psicóloga', '456', '123', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '0111565683621', '24 horas', 'victorinacarelli@gmail.com', '$2b$10$J4Pk4GhC5c7EpHuM4nUBtepbi6LUI2TamasK751y1Dq3tzisMsU5y', 'https://www.google.com/search?sca_esv=b8426464e8db000c&rlz=1C1GCUH_enAR1159&sxsrf=AHTn8zo7zuhzE0ALozuKmITXFp6CMcqHPw:1746022697972&q=foto+de+cara+de+mujer&udm=2&fbs=ABzOT_BnMAgCWdhr5zilP5f1cnRvK9uZj3HA_MTJAA6lXR8yQHNGH3ZsMTDAwt3AcRkz7p4yEDk3pA2-5-Gffi7qNY', 1000.00, 1000.00, '2025-04-30 14:20:56', 0, NULL, NULL, NULL, NULL),
(46, 'Katherina Serra', 'Lic. en Psicologia', NULL, '11235', 'Psicóloga cognitiva con enfoque integrativo. Desde 2017 me encuentro atendiendo niños, adolescentes y adultos con diversidad de situaciones, problemáticas, cuidando su salud mental, creando un espacio de escucha activa, empatía y acompañamiento. Te espero para que podamos juntos crear un espacio único, para tu cuidado', '3517049900', '24 horas', 'lic.katherinaserra@gmail.com', '$2b$10$XrqRxuyRLt8yBUgkHg8t/e2NnGl0nG9UIkufCdvWFMrQDfsa3Rhpq', 'https://drive.google.com/uc?export=view&id=1P4WU9ER-5BQkogVN-x3Dg11GebBzH2Im', 20000.00, 18.00, '2025-04-30 17:31:42', 1, NULL, NULL, NULL, NULL),
(47, 'Yanina Roldan', 'Lic. en Psicología', '0000000', '35289', 'Licenciada en Psicología con práctica clínica desde el año 2006. Formación sólida en Salud Mental y amplia trayectoria en el ámbito público y privado. Me desempeñé como Jefa del Servicio de Salud Mental en un hospital durante 4 años, coordinando equipos interdisciplinarios y abordando diversas problemáticas clínicas.', '+54 9 2314 47-6574', '24 horas', 'yaninaroldan63@gmail.com', '$2b$10$lhsbTUgAI3/WEYx5Hdzx0.o1wuAbK/Kk6P.9IYW3d5PtHyPSZnkT6', 'https://drive.google.com/uc?export=view&id=1i3rWRBH2rY5KeHPW0bUsFDTV4CBmQJBF', 30000.00, 34.00, '2025-04-30 23:57:37', 0, NULL, NULL, NULL, NULL),
(48, 'Paula Yañez', 'Psicóloga', '00000', '25878', 'Soy psicóloga clínica con más de 6 años de experiencia en atención de adolescentes y adultos desde el enfoque cognitivo conductual y terapias de tercera generación. Tengo un Grand Master en Neuropsicología clínica. Soy Instructora de Mindfulness y docente en constante formación, actualmente realizando un curso de posgrado en coordinación de psicoterapias grupales. ', '+54 9 2323 547405', '48 horas', 'psicologapaulayanez@gmail.com', '$2b$10$R9NiAfSZHFAA/7lVtTmYcehSx06ekjORckIYC14WX0yenPRSlpOge', 'https://drive.google.com/file/d/1b-0FDDDatT4shj9G07bnIEAgU6zyb9MA/view?usp=sharing', 30000.00, 37.00, '2025-05-06 03:21:44', 0, NULL, NULL, NULL, NULL),
(49, 'Camila Pérez', 'Lic. en Psicología', NULL, '12847', 'Soy Licenciada en Psicología, trabajo desde el enfoque sistémico, con perspectiva de género y de derechos. Acompaño a adolescentes y adultxs jóvenes a mejorar su calidad de vida, a fortalecer su autoestima y valoración personal, con una mirada relacional. También acompaño procesos migratorios.', '+5493515945854', '24 horas', 'lic.perezcamila@gmail.com', '$2b$10$uRTfP.ZsKMhM91Mft94oHuhd68VQ4KkkojcaELsMLeyDCB1JNUMFm', 'https://drive.google.com/uc?export=view&id=1cKwsNwF4wXk3yLOPltpW22A41a5KyFVv', 25000.00, 30.00, '2025-05-06 12:52:51', 0, NULL, NULL, NULL, NULL),
(50, 'Alfonsina de Urquiza', 'Licenciatura en psicología', '80873', NULL, 'Psicóloga con orientación en terapia cognitiva conductual (TCC). \n Realice mis estudios en la Universidad de Buenos Aires.', '2245427630', '24 horas', 'alfonsinadeurquiza@gmail.com', '$2b$10$HPWhN8qrVJnoDAGuN1IypexhXQ.AqVq62UZc8B6NIvLXuVXTnzgN.', 'https://s11.aconvert.com/convert/p3r68-cdx67/5g0dn-u5a0e.webp', 22000.00, 30.00, '2025-05-05 22:44:36', 0, NULL, NULL, NULL, NULL),
(51, 'Julieta Kladniew', 'Licenciada en Psicologia', 'MN 82496', 'MP - 191396 PBA', 'Trabajo con adolescentes y jóvenes adultos desde una mirada integral de la salud mental, considerando el impacto de las emociones en el cuerpo. Acompaño procesos migratorios, ansiedad y otros momentos vitales con escucha activa, empatía y herramientas acordes a cada necesidad. Me interesa comprender al paciente como un todo, integrando mente, cuerpo y contexto.', '+541153858518', '48 horas', 'julieta.kladniew@gmail.com', '$2b$10$WEKAjdMbtJsr/pdQDT52juZifzcwEJ9o2QwNT69DK3/qkkOWrigca', 'https://drive.google.com/uc?export=view&id=13ggOa79aFAFyY9yfVd-FPQYLKudQp8CM', 25000.00, 30.00, '2025-05-06 13:20:01', 0, NULL, NULL, NULL, NULL),
(52, 'x', 'x', 'x', 'x', 'x', 'x', '24 horas', 'administracion@terapialibre.com', '$2b$10$rN46b7Ph/3y38yRuBtFd1evlz9UmnLIWd9HH.eguEq/3qwACg7TzO', '', 0.00, 0.00, '2025-05-06 13:57:10', 0, NULL, NULL, NULL, NULL),
(54, 'Daiana Wernicke', 'Licenciada en Psicología', '55312', '55312', 'Lic. en Psicología con Orientación Psicoanalítica con 8 años de experiencia. Cuento con formación en la Clínica de los vínculos  y el Duelo.  Experiencia en la temática de violencia de genero y violencia familiar. Me especializo en el acompañamiento de los padecimientos de salud mental. Realizo tratamientos según el caso particular de cada paciente. Me desempeño en el área de Pericias Forenses en Juzgado de Familia y en la clínica con pacientes en Sector Privado.', '2223433162', '24 horas', 'daiwernicke1@gmail.com', '$2b$10$lc2B0aUh6n7Yo9Vl2zEkUe3qE81eDiHVeMrQmFHhc6Mogi6n6WpQy', 'https://drive.google.com/uc?export=view&id=1LCaAlmOInvAszpqlJUdPjkzUivQTuWQn', 25000.00, 30.00, '2025-05-07 11:09:52', 1, NULL, NULL, NULL, NULL),
(57, 'Analia Ribas', 'Lic. en Psicologia', NULL, '35733', 'Soy Psicóloga Cognitivo Conductual y acompaño a las personas en la gestión de sus emociones, el desarrollo de sus potencialidades y el fortalecimiento de sus recursos psicológicos. ¿Te gustaría comenzar este camino?', '2494312172', '24 horas', 'analiaribas@gmail.com', '$2b$10$ta1BsMNeb3wQlFrQgWDRA.9GZKJjvtIqlPg3z8wAYnqkg1FHSZ.vW', 'https://drive.google.com/uc?export=view&id=1mRHdnCiVFkeVtv9_BoneIiktA77B1mVY', 23000.00, 35.00, '2025-05-07 02:33:52', 1, NULL, NULL, NULL, NULL),
(61, 'Gloria Mangisch', 'Lic. en Psicología', '11388', NULL, 'Soy Psicóloga Psicoanalista, pero en mi tarea utilizo,de acuerdo a las necesidades de cada paciente, herramientas de distintas corrientes psicológicas en las que también me he formado. Tengo 40 años de experiencia acompañando y apoyando a personas en su recorrido hacia el bienestar emocional\nMe especializo en terapia de adultos y de parejas.', '+54 9 11 5978-9276', '24 horas', 'glorius.si@gmail.com', '$2b$10$GNfNl5330g7iH1fqjhUM7eFajwYY/AP8OpSzJrTXFfEYbVAGgwnyG', 'https://drive.google.com/uc?export=view&id=1fWk5ZRQJD3cD_TreY3rGhSDLWs0sODwQ', 35000.00, 100.00, '2025-05-07 03:35:28', 1, NULL, NULL, NULL, NULL),
(62, ' Natalia Szejner', 'Lic. en Psicología', '57264', '84169', 'Trabajo desde una escucha psicoanalítica. Desde un psicoanálisis que ha sabido ponerse en diálogo con otros saberes y que se encuentra en permanente revisión por los cambios socioculturales en los que estamos inmersos. Un espacio no sólo donde poder entenderse, sino donde generar aquel movimiento que permita salir de donde duele para poder construir un espacio propio donde habitar con más libertad. ', '+54 9 11 3608-4885', '24 horas', 'nataliaszejner83@gmail.com', '$2b$10$Qz36G1C.Hz.WQ2LrH9in8uhAAY.itEEtpT9n7iNAFtpDqbfZHJ8ZC', 'https://drive.google.com/uc?export=view&id=1QpZB3ph2zBzsYatikvcMPTSG54MayaaE', 22000.00, 35.00, '2025-05-08 03:48:34', 1, NULL, NULL, '0140087803502353672040', NULL),
(63, 'Martina Vidret', 'Lic. en Psicología', '80090', NULL, 'Psicóloga (UBA). Psicoanalista. Residencia en el Hospital Piñero. Atención de adolescentes y adultos.', '+54 9 11 6936-8021', '24 horas', 'martividret@gmail.com', '$2b$10$2QECLpZb9o48U/o6d7lSAegWeUaYG9MD9efta95E/up2PGhvpRRcS', 'https://drive.google.com/uc?export=view&id=1WetaqU3AGHijxyRApit9THLEAtJmr4Hd', 25000.00, 30.00, '2025-05-08 14:58:04', 0, NULL, NULL, NULL, NULL),
(65, 'Azul Crespo', 'Lic. en Psicología', '85522', NULL, 'Soy psicólogo/a especializado/a en Psicología Integral, con un enfoque hacia el desarrollo personal y el bienestar de mis pacientes. Mi objetivo es acompañar a las personas en su proceso de autoconocimiento, crecimiento emocional y mejora en su calidad de vida.\n', '+54 9 11 6604-0242', '24 horas', 'licazulcrespo@gmail.com', '$2b$10$1u7vZjhh1vAZeX21jOz9y.oW0VpcIRxgDDLA2Sh7SAIFkIrLmksnO', 'https://drive.google.com/uc?export=view&id=1Ioj3EiiJL8MkZnCTw6GsxYTv0cMMUyj2', 20000.00, 18.00, '2025-05-08 20:18:14', 0, NULL, NULL, NULL, NULL),
(68, 'Pablo Griego ', 'Licenciado en Psicología ', '47151191', NULL, 'Soy Licenciado en Psicología, egresado de la Udelar/Uruguay.\n\nMi objetivo es acompañarte en el camino de comprenderte mejor, trabajar en tu inteligencia emocional y construir una vida con mayor bienestar.\n\nCreo en la importancia de contar con un espacio seguro, donde logres expresarte sin juicios y con total libertad.\nMi compromiso es que, más allá de una consulta, vivas un proceso de autoconocimiento y crecimiento emocional.', '00598 98 303 520', '24 horas', 'pablomgriego@gmail.com', '$2b$10$S3N9u7qhS29w.0WTAYSn9.R13EU55pUqc.f9tBhElVJMqwy8XulxC', 'https://drive.google.com/file/d/1ZzIKKpuN16sd5R84gjpaAyZMnqzCSjBN/view?usp=sharing', 25000.00, 30.00, '2025-05-11 10:53:45', 0, NULL, NULL, NULL, NULL),
(72, 'Silvina Martínez', 'https://drive.google.com/file/d/1esfmPH7uW_gGObFZ8X6mIfHU7QGaJa7I/view?usp=drive_link', NULL, NULL, 'Lic. En Piscología, con orientación Psicoanalítica. Me especializo en el acompañamiento emocional, brindando herramientas y estrategias para afrontar el estrés, la ansiedad, la baja autoestima y otros desafíos emocionales. Mi objetivo es ayudar a las personas a mejorar su calidad de vida, promoviendo el bienestar y el desarrollo personal, a través de un enfoque integral y personalizado.', '1132617568', '24 horas', 'silvinamartinezyajid@gmail.com', '$2b$10$4duT.rw4i5p.tb.eW69TuOQCTCgduVhNxwzCGvLBbF3H/DqC0uO2O', 'https://drive.google.com/file/d/1em7g7W14G-_MwDNp8n7uuL8L20WinqBd/view?usp=sharing', 20000.00, 20.00, '2025-05-13 03:34:13', 1, NULL, NULL, NULL, NULL),
(74, 'Monica', 'test', '', '', 'test', '1139114579', '24 horas', 'monicejas70@gmail.com', '$2b$10$EVkpE3SQ03kx6o03ywDSc.vW47c/jOi9UjkNTMKgZT2GzuZyzCs66', 'test', 1.00, 1.00, '2025-05-15 13:55:56', 0, NULL, NULL, NULL, NULL),
(75, 'Sebastian Teysera', 'Lic Psicologia', NULL, '156489', 'terapeuta lirico ', '2494634548', '72 horas', 'fincaslignactandil@gmail.com', '$2b$10$/UeMjoDOTaY5Q3bpNZZbKOnnbnQ8/TTHuDJwBGn59G6hc./frq03e', 'https://drive.google.com/uc?export=view&id=1YQgOfGuSOUKCprEbesNMmcu4aLtQVPXK', 1.00, 1.00, '2025-05-16 15:06:05', 0, NULL, NULL, NULL, NULL),
(76, 'Renata Cammi', 'Licenciada en Psicología', '84472', NULL, 'Trabajo con un enfoque centrado en el presente, buscando el autorregistro y ampliar los recursos personales. Abrir nuevas perspectivas que permitan a cada persona acercarse a su bienestar y actuar en dirección a una vida más valiosa para sí misma.\nUso herramientas de Terapias con evidencia científica (TCC, ACT, Psicología Positiva, Mindfulness)\nEstrés, autoestima, ansiedad, desarrollo personal, creatividad, vínculos, toma de decisiones', '+5491125067390', '48 horas', 'renatacammi.psi@gmail.com', '$2b$10$Aa3zrakQQjU0aHJLjldMkOV2Fu.obBCiP7Sdg86M3LFRdJnksuDQO', 'https://drive.google.com/file/d/1ed7VGnUxwbOllK8e16XFdvaXSxvPCZZd/view?usp=sharing', 25000.00, 35.00, '2025-05-17 09:52:02', 1, NULL, NULL, NULL, NULL),
(77, 'Ana Carolina Rodriguez ', 'Lic en Psicología ', '52387', '30178', 'Psicologa con 14 años de trayectoria , con amplia experiencia en atención individual, terapia de pareja y orientación a padres.\nPsicologa perinatal acompañando a pacientes en la búsqueda del embarazo, tratamientos de fertilidad, parto , posparto y puerperio.', '011-1554685884', '24 horas', 'anacarolinarodriguez80@gmail.com', '$2b$10$y.RGYyV3vlEETLNXB/Yxh.5MeyPckb2Gwqs0F56A/bLwnR9Jxew3e', 'https://drive.google.com/uc?export=view&id=1pixB3UFhvtjgc5LKLK1jhXPTcd1F_Xbr', 25000.00, 28.00, '2025-05-19 15:10:22', 1, NULL, NULL, NULL, NULL),
(78, 'Mariano Juan', 'Licenciatura en Psicologia', '78400', 'Ciudad Autónoma de Buenos Aires', 'Soy Mariano Juan, licenciado en Psicología por la Universidad de Ciencias Empresariales y Sociales (UCES). Como profesional ofrezco un espacio de escucha, promover el desarrollo emocional y bienestar general desde el psicoanálisis. \nRealice un pos grado en psicología aplicada al deporte en (APDA).\n', '01155993284', '24 horas', 'marianojjuan@gmail.com', '$2b$10$RvhMHWc3Uoz8ClvHx2bcFOn0msz2qZHKrXXu9BrWxqIPkvVfhay/m', 'https://drive.google.com/file/d/1mCqvDMvph11qvKbjI7H2ByfSdSLzNuoZ/view?usp=sharing', 25000.00, 30000.00, '2025-05-20 01:17:40', 0, NULL, NULL, NULL, NULL),
(79, 'Georgina Braida', 'Licenciada en psicología', NULL, '2457', 'Psicóloga clínica con enfoque cognitivo conductual. Experiencia con jóvenes y adultos que atraviesan problemáticas de duelo, ansiedad, depresión, autoestima, estrés, procesos de desarrollo personal y autoconocimiento. Comprometida con una práctica ética, empática y basada en la evidencia científica.', '3425368330', '24 horas', 'Lic.georginabraida@gmail.com', '$2b$10$UvRgfF0wnTFYHpXQgWGgNeZqgLeKem4t2/k7b5BVEpe0g0KYem9Ge', 'https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.mundopsicologos.com.ar/centros/georgina-braida&ved=2ahUKEwiX4ez47LmNAxVjDbkGHZUyBz8Qqa4BegQIDRAA&sqi=2&usg=AOvVaw1ofehBGOiz_jdoS2EhCLjV', 28000.00, 30.00, '2025-05-23 23:48:32', 0, NULL, NULL, NULL, NULL),
(80, 'Ignacia Talamona', 'Lic. en Psicología', '81469', NULL, 'Mi objetivo es ayudarte a conocerte mejor y, sobre todo, a transformar ese conocimiento en acciones concretas: construir hábitos sostenibles, tomar decisiones coherentes y avanzar hacia una vida más auténtica.', '+34662328805', '24 horas', 'Nachatalamona@gmail.com', '$2b$10$pfEmatqyXtjkXmUi5M0FlOnR0c2CfofyEroUOlkrpoh.hBSY5YABi', 'https://drive.google.com/uc?export=view&id=1N0JdqxJQHSiFtMSJTOqcM739Ed7cxMDK', 28000.00, 25.00, '2025-05-28 18:33:51', 0, NULL, NULL, NULL, NULL),
(81, 'Daiana Rodriguez Trinta ', 'Lic. Psicología ', '59543', NULL, 'Soy Lic Daiana Rodríguez Trinta egresada de la Universidad del Salvador en 2013. \nTengo 12 años de experiencia en psicología clínica y 17 años en docencia. \nMe considero muy apasionada por mi trabajo y lo disfruto mucho. \nTrabajo desde un abordaje integral con formación Tcc. Atención adultos, orientación a padres y terapia de pareja ', '+5491165007411', '72 horas', 'daianartrinta@gmail.com', '$2b$10$p.4FnX.yIxEali.E0wiAeewonCBgOR2.is/HqzWjXgOG3qP/PTD/q', '', 340000.00, 40.00, '2025-06-01 18:33:22', 0, NULL, NULL, NULL, NULL),
(82, 'Sofía', 'Licenciada en Psicología', '84786', '191475', 'Me apasiona escuchar, comprender y acompañar a cada persona en su proceso, respetando sus tiempos, singularidad y necesidades. Creo en la importancia de construir un espacio terapéutico de confianza, donde cada uno pueda sentirse contenido y acompañado.', '1131859156', '24 horas', 'sofia.ines.jimenez@gmail.com', '$2b$10$W3Ff6M3wMqp6GKIPm5.hsOXlJrfOOe5.eEUklh6.Sc/7vIarhIPNS', '', 25.00, 22.00, '2025-06-01 18:40:14', 0, NULL, NULL, NULL, NULL),
(83, 'Rocio Costantini', 'Licenciada en psicología ', '57292', '96788', 'Soy psicóloga hace más de 15 años. Me formé en la UBA, y luegos realice varios cursos y posgrados.  También trabaje dos años de psicóloga en el hospital de San Isidro. Además de ser psicóloga clínica de adultos y jóvenes, me especialice en fertilidad y dificultades reproductivas. ', '1132947300', '72 horas', 'rociocostantini@hotmail.com', '$2b$10$vM4Z.A8dmJ7menuZhBKw/uW4Iwwl64Tvdg1CXv9kLYnNPNQxYky1y', '', 30000.00, 25.00, '2025-06-01 19:08:13', 0, NULL, NULL, NULL, NULL),
(84, 'Mara Mollo', 'Licenciada en Psicología ', '68087', NULL, 'Psicologa-  Neurodiversidad - Adolescentes. Con y sin CUD.\n\nEspecialista en violencia familiar y de género\n', '1164558333', '24 horas', 'lic.maramollo@gmail.com', '$2b$10$RzJxRk.lRe89g.T/b3X9S.xE2jHxpn8NFyVFlD/GPAeIuOcKpEOi.', '', 25000.00, 25.00, '2025-06-01 19:13:55', 0, NULL, NULL, NULL, NULL),
(85, 'Valentina Cavallo', 'Lic. Nutrición ', NULL, '1593', 'Nutricionista diplomada en PINE', '3575656843', '48 horas', 'valencavallo2@gmail.com', '$2b$10$jsS5K.unV2cZ3uCoE.2fH.jCdBIhNeYX80M5RblEwuUX30CnP0Ezm', '', 30000.00, 50.00, '2025-06-01 17:00:56', 0, NULL, NULL, NULL, NULL),
(86, 'Celeste Dos Santos', 'Licenciada en psicologia', NULL, '2044', 'Soy psicóloga con formación en Logoterapia y análisis existencial!\nTengo la especialidad de Psiconcologia.', '2914712169', '72 horas', 'lic.dossantosceleste@gmail.com', '$2b$10$qWB3xE/cMmLx4m04U1igUe.djdAhbL80MH0RBLG.OemQje6k3oX2q', '', 28000.00, 26.00, '2025-06-01 17:03:40', 0, NULL, NULL, NULL, NULL),
(87, 'Mariana Arcondo', 'Licenciada en psicología ', NULL, 'M.P 35571', 'Licenciada en psicología con 10 años de experiencia,  atiendo adultos y adolescentes ', '+54 2281 41-4929', '24 horas', 'mariana_arcondo@hotmail.com', '$2b$10$BQIvsO0jkj1CbIAD4got/O3seUQovymvXud8LlzXK5YihsbuZoQX.', '', 25000.00, 25.00, '2025-06-01 17:28:17', 0, NULL, NULL, NULL, NULL),
(88, 'SANDRA HOFFMAN', 'Licenciada en Psicología', '82937', NULL, 'Soy Licenciada en Psicología y actualmente me encuentro a la espera de la defensa\nde mi tesis doctoral (ya aprobada), desarrollada en el marco de una beca otorgada\npor el CONICET en la Universidad de Buenos Aires. También soy docente universitaria de psicología adolescencia. ', '+5493764639373', '48 horas', 'MARTINSSAND@HOTMAIL.COM', '$2b$10$3L3qqE.uAZ/5RiurEA1InOuZcvvIVkFvlX0fxgn6RZ2JYmpGIcALm', 'https://drive.google.com/file/d/19AmRHzs-gBoBE8T7l5mWihmZohPFSvT1/view?usp=sharing', 27000.00, 30.00, '2025-06-01 23:28:54', 0, NULL, NULL, NULL, NULL),
(89, 'Cintia Enriquez', 'Licenciada en Psicologia ', NULL, '1286', 'Psicóloga especialista en psicoterapia cognitiva Integrativa, con experiencia y formación diversas temáticas como ansiedad, género, violencias, organizaciones y desarrollo vocacional. ', '3795161414', '48 horas', 'cinttiaenriquez01@gmail.com', '$2b$10$y//XIkP4F/HdSOM2QFF5o.2v9W7ikjZoUFYVmVYfjUBc/Kjlu2PK.', 'https://www.canva.com/design/DAGpIXw4Kec/-T3Tlv_SNh8vgRuD68wmzQ/edit?utm_content=DAGpIXw4Kec&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton', 21000.00, 25.00, '2025-06-01 17:54:11', 0, NULL, NULL, NULL, NULL),
(90, 'Jacqueline', 'Lic en Psicologia', '71071', NULL, 'Psicologa de niños, adolescentes, adultos y adultos mayores. Trabajo con la persona como con su familia si nos menores. Apunto a que el paciente obtenga las herramientas y pueda entender lo que le pasa para estar bien.', '1135071809', '72 horas', 'jamidgley@yahoo.com.ar', '$2b$10$w1x71acIr5pkQ2f1z9mCh.bP225QgYLtmsV7QmK6ePl8F0BMOR49m', 'https://photos.app.goo.gl/EMuzFeNJYANzEmpM8', 25000.00, 100.00, '2025-06-01 18:18:15', 0, NULL, NULL, NULL, NULL),
(91, 'Daiana Troyano ', 'Licenciada en psicología ', '9112', 'Córdoba', 'Psicóloga con 12 años de experiencia. Trabajo con pacientes que quieren sentirse bien con ellos mismos y desarrollar habilidades de crecimiento personal', '3515452852', '48 horas', 'daitroyano@hotmail.com', '$2b$10$jPb3DCOnesR7e4bmWizvmONmzCQ8jL3Dxbohkq28EHoHfgCzq5lke', 'https://www.instagram.com/lic.daianatroyano?igsh=MXd1czQyb2E2aXJzdA==', 40000.00, 50.00, '2025-06-01 18:19:10', 0, NULL, NULL, NULL, NULL),
(92, 'Flavia Romero', 'Licenciada en psicologia', '83107', '86804', 'Psicóloga clínica ', '1169656795', '24 horas', 'psic.flaviaromero@hmail.com', '$2b$10$mSle7pDLDrccxL1Kb4jMd.1cpT5TWGvd4D6OSRKqAPViMEJtMSKe.', '', 25000.00, 25.00, '2025-06-01 18:28:37', 0, NULL, NULL, NULL, NULL),
(93, 'Noelia López ', 'Licenciatura en Psicología ', '3735', '3735', 'Psicologa , Arolescencia y pareja terapia vincular (sistémica)', '2613435306', '24 horas', 'psilopez.2229@gmail.com', '$2b$10$XDI32JYtvAPQhx3/fOvzjOHecg338kv5s7sFSC9nZnWlkGptlwPji', '', 35000.00, 50000.00, '2025-06-01 18:39:14', 0, NULL, NULL, NULL, NULL),
(94, 'Yasmine Teme Rodriguez ', 'Licenciada en psicología ', NULL, '254', 'Psicóloga hace 14 años, con experiencia en adultos. Enfocándome en trastornos de ansiedad y depresión, desde la terapia cognitiva conductual.', '3834554407', '24 horas', 'temeyasmin@gmail.com', '$2b$10$.LIL08p3IPiMkpFEdZ1SQ.3sj9GKwUqoIV.KWwpqDlXRA87GS0g6S', '', 35000.00, 30.00, '2025-06-01 19:11:55', 0, NULL, NULL, NULL, NULL),
(95, 'María Eugenia Aramune', 'Licenciada en Psicología ', '84594', '191390', 'Psicóloga clínica con orientación en Psicoanálisis.', '1162792868', '24 horas', 'maruaramune@hotmail.com', '$2b$10$vnzcteT.6CRydDsYoIYAU.I7gjOHqxQ9RDfNmhgRZc..goxPa5G8G', '', 25000.00, 30.00, '2025-06-01 19:57:29', 0, NULL, NULL, NULL, NULL),
(96, 'Amira María Greco ', 'Lic. En Psicopedagogía ', NULL, '907', 'Lic. en Psicopedagogía. Formación en Psicoanálisis. Clínica Psicoanalítica. Atención virtual de jóvenes y adultos. ', '3425285522', '48 horas', 'psp.amiragreco@gmail.com', '$2b$10$.7oVDuII7MhaEai3eojXc./Eu1vZxSNzGjB7OnaVmi72Y2WtYaUvG', '', 30.00, 30.00, '2025-06-01 20:51:33', 0, NULL, NULL, NULL, NULL),
(97, 'Oriana', 'Lic en Psicologia', '79895', NULL, 'Psicóloga clínica infanto-juvenil', '1141769656', '24 horas', 'oriana.cusumano@gmail.com', '$2b$10$h3D8/MFaz9IURF4p49fBveXqfIyBM/ES59kgoocSabYMivOEcN/i6', '', 26000.00, 25.00, '2025-06-01 21:23:37', 0, NULL, NULL, NULL, NULL),
(98, 'Mercedes', 'Licenciada en Psicologia', '26201', '85146', 'Psicologa recibida en la Universidad del Salvador, atendiendo actualmente de forma virtual y presencial. ', '2323366077', '24 horas', 'mercedes.dascanio@usal.edu.ar', '$2b$10$7xIgsPGUmaRNlYHU/6Go4Om4Fn422kjSHWcMPoEl1b.aTEkiisOZO', 'https://www.instagram.com/mechadascanio?igsh=MTZsYjNvam1lazg0cg==', 23.00, 27.00, '2025-06-01 21:42:30', 0, NULL, NULL, NULL, NULL),
(99, 'Chiara Ferraro', 'Lic. En psicología ', NULL, '087121', 'Soy terapeuta cognitivo conductual, y busco brindar herramientas concretas para ayudar a los consultantes a alcanzar sus objetivos de forma eficaz en un breve tiempo, utilizando para ello intervenciones específicas, acompañando a cada persona en su proceso, desde un enfoque colaborativo.', '1166070999', '24 horas', 'lic.chiaraferraro@gmail.com', '$2b$10$tzFFds8EoBK0aEEgWzLuw.P/dqwij9rzoo81bPXMymm3elLP2eRO6', 'https://drive.google.com/file/d/1wq7TWVyt3ZlUXIf2yplZOXDUaQ1TQTnX/view?usp=drive_link', 22.00, 30.00, '2025-06-02 03:53:04', 0, NULL, NULL, NULL, NULL),
(100, 'María Agustina Sauchuk', 'Licenciada en Psicología ', NULL, '1210', 'Psicóloga con 6 años de experiencia en psicología clínica ', '3795305071', '24 horas', 'psiagustinasauchuk@gmail.com', '$2b$10$xVLHfqep7/mm3.1E0sr1bekqYRp1LN4DT3W5AqP10YM5epAPF832C', 'María Agustina Sauchuk', 30000.00, 30000.00, '2025-06-01 21:59:13', 0, NULL, NULL, NULL, NULL),
(101, 'Belén Heidenreich ', 'Psicóloga ', '8800', NULL, 'Psicóloga con pacientes virtuales individuales tanto de Argentina como otro países (Alemania, Canadá, Miami, Ecuador entre otros) y pacientes presenciales de diferentes edades y con diversas problemas, ansiedad, trastornos vinculares, problemáticas laborales, entre otros. Ayudo a padres y realizo terapia de pareja. ', '3412673027', '24 horas', 'belen.heidenreich15@gmail.com', '$2b$10$oVADvdqdI32OzbaupD9Ff.qR0l.XpdqB/cxl/gWtCM8YrXD1T4Tp.', 'https://www.instagram.com/belheidenreich?igsh=MXRoaHZld3hjdmw2MQ==', 30.00, 30.00, '2025-06-02 01:24:03', 0, NULL, NULL, NULL, NULL),
(102, 'Nayla Toledo ', 'Lic. En Psicologia ', NULL, '48722', 'Psicóloga clínica con consultorio privado y atención online. Formación en perito forense, también en Ong con víctimas de violencia/abuso/trata. Acompañante Terapéutico y tallerista para chicos con autismo. ', '2235119936', '24 horas', 'lic.naylatoledo@gmail.com', '$2b$10$Qm8O5ORnX7Y.a7bBiwZeee4XHAjT8fWIu0RkdOlHrszWvdpUAeO0i', '', 20500.00, 200.00, '2025-06-01 22:28:26', 0, NULL, NULL, NULL, NULL),
(103, 'Cecilia Colombo ', 'Lic en psicología ', '10145', NULL, 'Lic en psicología con 19 años de experiencia, actualmente trabajo en psicología de la emergencia, trabaje en adicciones, ASI,hice cámaras gesell, psicodiagnosticos con puntos de pericia,  violencia de género y familiar, ahora solo trabajo con adultos y adolescentes. Coordino el area de emergencias de caba', '1164556575', '24 horas', 'cecicolombo23@hotmail.com', '$2b$10$LaKGZ92um66qybpa2LlKoeiNPKxeUnBiLW2AK2G520aYCQSsGKvjq', '', 30.00, 25.00, '2025-06-01 22:59:34', 0, NULL, NULL, NULL, NULL),
(104, 'Fabiana Catalano', 'Licenciada en Psicologia ', NULL, 'MP 83036', 'Psicóloga Clínica. Terapias breves. ', '1162868252', '24 horas', 'fabianacatalano@hotmail.com', '$2b$10$4TgPpKohdhfHlyu/bVOVUOABQtP33KdqNUq8LqZjNrtyJz0.8Ij8O', 'https://share.icloud.com/photos/010M4abdmU2HRkjU6ULigk3qA', 15000.00, 20.00, '2025-06-01 23:00:44', 0, NULL, NULL, NULL, NULL),
(105, 'Agustina', 'Lic en psicología ', '75798', '63312', 'Lic en psicología con orientación psicoanalitica', '1133932030', '24 horas', 'agustinaberini@hotmail.com', '$2b$10$M3/F.Z9IpTE4Sx./.o3Ub.U4A6nn8Aj2hEsZE3O0Oym1lh2fiYgbq', 'Bbbbbbb', 28000.00, 35.00, '2025-06-01 23:48:46', 0, NULL, NULL, NULL, NULL),
(106, 'Mylena Thais González ', 'Lic en psicología ', NULL, '1511', 'Licenciada en Psicología, con formación en la clínica psicoanalítica con una fuerte vocación socio-comunitaria, profundizando en psicooncologia, adicciones y autolesiones, entre otros. Experiencia clínica tanto individual como de pareja, acompañamiento escolar, docencia, talleres grupales y proyectos comunitarios.', '3757671651', '48 horas', 'gonzalezmylena.psi@gmail.com', '$2b$10$z8OmveyAe7X/7i5Y3g.wWeVkyU1jXcKvZRHu01nGv5WXA7ZasqBXK', 'https://drive.google.com/uc?export=view&id=1vgbJJffSd9F2o7UvGLU-xSlkZZPw5WHW', 25000.00, 25.00, '2025-06-01 23:56:31', 0, NULL, NULL, NULL, NULL),
(107, 'Xoana Tisera', 'Lic psicología ', NULL, '62417', 'Psicóloga con 12 años de experiencia en atención grupal e individual de niños, adolescentes y adultos.\nModalidad de atención online con orientación TCC.', '01130214404', '24 horas', 'xoanatisera@gmail.com', '$2b$10$ISxLx/ZV/pf7Et2ivygfPef406YKyh4lDRgHHhYtKHENXx42yG0ea', '', 20000.00, 25.00, '2025-06-01 23:57:15', 0, NULL, NULL, NULL, NULL),
(108, 'Vanesa Cristina perez', 'Lic psicología ', '51211', NULL, 'Lic en psicología recibida 2010 posgrado en clínica de niños y familia. ', '+5491150193328', '24 horas', 'vanesacperez@gmail.com', '$2b$10$jJ0fwXYCN.GIqXKPnvTwZec766yaGWI7XsijZHy84P9Qy.PSuwra6', 'https://imgur.com/a/mPfVr12', 25000.00, 30.00, '2025-06-02 01:19:37', 0, NULL, NULL, NULL, NULL),
(109, 'Lorena Carballo ', 'Licenciada en Psicología ', NULL, '695', 'Psicóloga,  Especialista en Psicología Cognitiva Integrativa, con casi 11 años de experiencia en el área clínica. Docente universitaria ', '3754474713', '96 horas', 'lic.lorenacarballo@gmail.com', '$2b$10$UMkdty520iXhDuBMdeL4gO2sXA2svEpT3gur60NqKsnqVMx/42bCG', 'https://drive.google.com/file/d/1nbScNlkUh1VBnp6oAa0bYebbCYwAN_yi/view?usp=sharing', 25000.00, 20.00, '2025-06-02 04:20:25', 0, NULL, NULL, NULL, NULL),
(110, 'Camila koziel', 'Licenciada en psicología ', NULL, '47.972', 'Psicóloga con 8 años de recibida. Realice durante los primeros 3 años una concurrencia en centros de salud públicos de Mar del Plata, y los últimos 5 años trabaje en consultorio particular, especializada en adolescentes y adultos.', '2236902179', '24 horas', 'camikoziel@gmail.com', '$2b$10$I./TA3dYHZLfWEEKbOcJ1O2saNFzy9M.Q8maJeUyHj6lk.cfRCcm.', '', 45.00, 50.00, '2025-06-02 01:24:35', 0, NULL, NULL, NULL, NULL),
(111, 'Macarena Hee', 'Licenciada en Psicología ', '70623', 'No tengo', 'Psicóloga especialista en Psicosomática y Evaluación y Disgnostico Psicológico. Atención a jóvenes y adultos de manera on line con 7 años de experiencia en la clinica, sumado a otros ámbitos como el laboral y dentro de instituciones educativas. ', '1127990243', '24 horas', 'maccahee@gmail.com', '$2b$10$q0STjq3um1knuGkmWcPdtuK36qwM8UEkpZl1ZbVec2Pel3U6GMZpy', 'https://myoffice.accenture.com/:i:/r/personal/macarena_hee_accenture_com/Documents/WhatsApp%20Image%202025-03-31%20at%2011.26.35.jpeg?csf=1&web=1&e=MUDxwV', 35000.00, 50.00, '2025-06-02 04:28:38', 0, NULL, NULL, NULL, NULL),
(112, 'Soledad Monsell', 'Licenciada en Psicología ', NULL, '67544', 'Psicóloga clinica, atención a adultos. Especialista en pnie.\nAcompaño procesos de ciclos vitales y trastornos de ansiedad. \nPsicóloga integral especialista en medicina del estrés. ', '1136716889', '24 horas', 'soledadmonsell@gmail.com', '$2b$10$v.0DeHNAEm8r4kDPQ5DzVurjXA/A9Xj7PvdFog1qbAu7nbUQm2DB2', '', 35000.00, 35.00, '2025-06-02 01:33:21', 0, NULL, NULL, NULL, NULL),
(113, 'olivia canavero', 'lic. en psicología ', '86030', '86030', 'lic. en psicología, diploma de honor UBA', '1130942495', '96 horas', 'olivia.canavero@gmail.com', '$2b$10$SHWS0Yai5Ws8HZ.VZV0kz.ylxs8gsoicyfEW4522.x2yKi3QZJqKa', 'https://www.linkedin.com/in/olivia-canavero-716a3915a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', 17000.00, 20.00, '2025-06-02 01:50:24', 0, NULL, NULL, NULL, NULL),
(114, 'Cecilia Miteff ', 'Licenciada y Profesora en Psicologia', '53522', '53217', 'Psicologa con más de 16 años de experiencia Clínica. Psicodiganosticos y docencia universitaria', '1144033234', '24 horas', 'ceciliamiteff@hotmail.com', '$2b$10$JEE7N.saS.gIy6VUdkhH1.7VuX2JabV68NUImQPBoKmgN//ioz6um', 'https://www.instagram.com/lic.ceciliamiteff?igsh=OHBqMGh4enM5eDgwhttps://www.instagram.com/lic.ceciliamiteff?igsh=OHBqMGh4enM5eDgw', 28000.00, 35.00, '2025-06-02 02:32:21', 0, NULL, NULL, NULL, NULL),
(115, 'Monica Kohl', 'Lic en psicología ', '31012', NULL, 'Psicóloga con 25 años de experiencia en emergencias y gerontología ', '1162882281', '24 horas', 'monicakohl@hotmail.com', '$2b$10$Zv9G9XFYREN3RvJx43ykqeO6g.pteLGmZHuzC.IDBZ.29BzGQGj7S', '', 40000.00, 50.00, '2025-06-02 02:35:06', 0, NULL, NULL, NULL, NULL),
(116, 'Marlene Lara Lahitte ', 'Licenciada en psicología ', NULL, '1870 Buenos Aires', 'Psicóloga con 8 años de experiencia en consultorio privado. 4 años en ámbito público abordando casos de violencia de género. Y distintos trabajos con adultos mayores, especialista en Psicogerontologia ', '02915055946', '72 horas', 'mlahitte12@gmail.com', '$2b$10$eb8Mlefvnxo0jcn/NMuSpOh1re3FvNg5uXs5Y.UTJutWOk5pkG7W2', '', 25000.00, 22.00, '2025-06-02 06:11:02', 0, NULL, NULL, NULL, NULL),
(117, 'Laura Yasmin Kisielewsky ', 'Lic. En Psicología', '61091', '1921', 'Soy Lic. En Psicología de la UBA. Hice un magister en psicoanálisis de Familia y paraja (IUSAM/ApdeBa) Tengo más de 7 años de experiencia en salud pública y salud mental, en casos graves, de consumos problemáticas. Trabajo con Perspectiva de género desde el psicoanálisis Lacaniano, Freudiano y muchos otros autores', '3493 411099 ', '48 horas', 'lickisielewskylaura@hotmail.coml', '$2b$10$DylhAENXvBoG4CimHZx91e1uC2qF/vIFghJDuUhEuccuIv0/J8w9a', '', 25000.00, 25.00, '2025-06-02 04:27:27', 0, NULL, NULL, NULL, NULL),
(118, 'Federico Morresi', 'Licenciado en Psicología ', NULL, '2023', 'Psicólogo independiente con más de 5 años de experiencia, trabajando en consultorio Privado como también en clubes con equipos de patín y basquet desempeñandome con Psicologo Deportivo', '2914614907', '96 horas', 'fmorresi7@gmail.com', '$2b$10$ioaWL.jATtqh0zOYnjjZzOtFN7WvUsmsWFVRuGNjjRBos2aH2bqOe', 'https://drive.google.com/uc?export=view&id=1cZAY1tvAcy10lecbAEJ9k7fWffGm1K6R', 22000.00, 20.00, '2025-06-02 14:29:16', 0, NULL, NULL, NULL, NULL),
(119, 'Marianela Belen Castro', 'Licenciada en psicología ', NULL, 'Mendoza 2651', 'Realizo psicoterapia breve, integrativa. Con perspectiva de genero y diversidad. Especializada en adolesencia. Orientacion a padres. ', '2617066422', '24 horas', 'Licmarianelabelenc@gmail.com', '$2b$10$ixw9GMhDv41Yx603B4ovY.jpzUp64jHD3FsvKwMUueMytRahC9Qm.', 'https://drive.google.com/uc?export=view&id=1TomMbOI0MVKqp1rel_AhhM0PnqdEZz4x', 30000.00, 20.00, '2025-06-02 22:39:37', 0, NULL, NULL, NULL, NULL),
(120, 'agustina schmidel', 'Lic en Psicología ', NULL, '1044', 'Psicóloga con 7 años de experiencia, Cognitiva Conductual', '3743504570', '48 horas', 'agustinaschmidel.as@gmail.com', '$2b$10$0s2LOVsrhMka/6rF4ZEK9upU5ZEPGepn/Y8MJ/XoKjdWs6kWc3wmq', 'agustina schmidel', 20000.00, 20.00, '2025-06-02 13:50:46', 0, NULL, NULL, NULL, NULL),
(121, 'Victoria Laguinge ', 'Licenciatura en Psicología ', '-', '9422', 'Acompaño a personas en el manejo de la ansiedad, la regulación emocional, el desarrollo de habilidades sociales y la construcción de metas con sentido.\nTrabajo desde un enfoque colaborativo, sin juzgamientos y respetando tus valores personales.', '+5493512475321', '24 horas', 'viclaguinge@gmail.com', '$2b$10$stFgMnrVHc1/CQlT7kloS.NP1CEs431lTxQM6HBJfDc5ds4Vl8WzO', 'https://drive.google.com/uc?export=view&id=1p7FbJ6LsroAqEhmdOGVNBh8GrSjKH7Sk', 30000.00, 30.00, '2025-06-02 17:43:43', 0, NULL, NULL, NULL, NULL),
(122, 'Magali ', 'Lic en Psicología ', NULL, '1335', 'Psicóloga con 13 años de experiencia. Especialidad violencia intrafamiliar ', '+542914269175', '24 horas', 'magali_felice@hotmail.com', '$2b$10$43ZdcGmSF6rBlRcncIPUKu..fUKj/5Sizj01FIieDJbEdHVZZf/Zm', 'https://www.linkedin.com/in/magali-liliana-felice-a3b34325a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 30000.00, 50.00, '2025-06-02 15:08:05', 0, NULL, NULL, NULL, NULL),
(123, 'Adolfo Gambetta', 'Licenciado en Psicología. Especialista en Psi. aplicada al Deporte', NULL, '75231', 'Formacion clínica para atencion de pacientes con orientacion en psicoterapia cognitivo conductual ( en Ansiedad, principal trastorno). Especialización en psicología aplicada al deporte. Trabajo como psicólogo en el Servicio de Atención a la Comunidad (SAC) del Colegio de Psicólogos de Bs. As. y consulorio privado.', '1164783770', '24 horas', 'adolfo_gambetta@hotmail.com', '$2b$10$VhF24/N59HZnT0wVqSugR.4HFgxM8.AWk6IVapkKBZjelBe42E5iS', 'https://psicopsimple.com.ar/wp-content/uploads/2024/03/Foto-CV-1-962x962.jpeg', 25000.00, 30.00, '2025-06-02 20:51:02', 0, NULL, NULL, NULL, NULL),
(124, 'Gabriela Luciana Córdoba', 'Lic. en Psicología', '80383', 'no', 'Psicóloga clínica (UBA) con dos años de experiencia en consultorio de Salud Mental de la mutual de Gendarmería Nacional Argentina: Ayuda Mutua del Personal de Gendarmería Nacional (AMUGENAL) ', '1154197990', '24 horas', 'gabrielalucordoba@gmail.com.ar', '$2b$10$R66ORM31wVNbGYp5bNoduesrz5PSYYM7FzzfNS7/317jf7g249Q3W', 'https://photos.fife.usercontent.google.com/pw/AP1GczPeWxcvVL1ssUWlT-Nbejpv2eU2nHrViJgmFqu-joDkvlXM2fNVY2HZxA=w720-h849-s-no-gm?authuser=3', 25000.00, 2155.00, '2025-06-03 17:52:55', 0, NULL, NULL, NULL, NULL),
(125, 'Candela Levy', 'Licenciada en Psicología', NULL, '14438', 'Soy psicóloga egresada de la Universidad Nacional de Córdoba. Trabajo con jóvenes y adultos desde un enfoque conductual contextual. Mi propósito es acompañarte a construir una vida con sentido, desde la flexibilidad y en función de lo que es valioso para vos, en un espacio cálido y de construcción mutua. ', '+549 3512826700', '24 horas', 'candelamlevy@gmail.com', '$2b$10$OaMXI4ZArMth1jHL3mQg7e0OktbmEqcK6rGwq8iWqRRPRoP2k.2O6', 'https://drive.google.com/uc?export=view&id=1AR4lUpbjJSb_3KBBOM1BPPHJkavA5eBq', 23000.00, 25.00, '2025-06-04 15:02:59', 0, NULL, NULL, NULL, NULL),
(126, 'Agostina Liberatore ', 'Licenciada en psicología ', NULL, '3234', 'Licenciada en psicología, especialista en niños y adolescentes. Con lineamiento cognitivo conductual. \nCon más de 10 años de experiencia. ', '3815800081', '24 horas', 'ma_ag_1824@hotmail.com', '$2b$10$a73n5G8smVrtTF.kJPWF8e4nImgeaPnA.ZHwnnTbCGoVpIEAkM7Aq', '', 25000.00, 22.00, '2025-06-04 17:41:31', 0, NULL, NULL, NULL, NULL),
(127, 'Gabriela Botella', 'Licenciada en Psicología', '56768', NULL, 'Licenciada en Psicología, con 13 años de experiencia en la atención clínica de pacientes adolescentes y adultos.', '01159615507', '72 horas', 'lic.gabrielabotella@gmail.com', '$2b$10$CA0bWlcwJuiQCOoUMhSLa.4N9hpr1l1j93SMgWpd9dfWa88Tveny.', '', 30000.00, 30.00, '2025-06-04 19:09:34', 0, NULL, NULL, NULL, NULL),
(128, 'Flor', 'hgf', '5156', '2555', 'nckhg', '2494495766', '24 horas', 'winklylab@gmail.com', '$2b$10$99tfSH539hZeaD7uHG1MS.kS2aFSz4WZQSZxqiou8m/EBJurWrWFm', '', 20.00, 20.00, '2025-06-07 16:09:23', 0, NULL, NULL, '416511322', '2065165'),
(129, 'María Luz jimenez ', 'Médica psiquiatra ', NULL, '24153/ registro de especialidad 44/0748', 'Mi nombre es María Luz jimenez. Soy médica psiquiatra recibida en la universidad nacional de rosario.\nAtendió pacientes adultos y adultos mayores con diversas patologías.', '3413059078', '24 horas', 'jluz67900@gmail.com', '$2b$10$GEEXZRXrLV0U39myKCsjw.i.IRJKSNPR.3qrU/XzTJR4bRf1BxLmO', 'https://drive.google.com/file/d/1BoEMmNky0HmyuaZ6sIvZrkKXJ0SyY9Wt/view?usp=sharing', 30000.00, 30.00, '2025-06-11 01:00:19', 0, NULL, NULL, '0000003100033757168154', '27341309927'),
(130, 'Pamela', 'Licenciada en Psicología ', '70900', NULL, 'Soy licenciada en psicología con orientación en terapia cognitiva conductual contextual. ', '1132155835', '24 horas', 'pameladeleva@gmail.com', '$2b$10$/6SW7P9sdHqquc8MUX5ODe2WQOm9RAKCCuGRSqfuu.KBb3PDeeoKe', 'https://www.linkedin.com/in/pamela-deleva-7b161822?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', 40000.00, 40.00, '2025-06-11 10:56:52', 0, NULL, NULL, '0000003100083390367124', '27337387433'),
(131, 'Rebeca Macciocco ', 'Licenciada en Psicología', 'M.N. 86362', NULL, 'Soy Lienciada en Psicología y Docente de la Universidad de Buenos Aires. Mi orientación clínica es integradora del Psicoanálisis y herramientas específicas de la terapia Cognitivo Coductual (TCC). Cuento con experiencia en el ámbito de la psicología clínica y laboral. Atiendo adultos y adolescentes. ', '+54 1133616862', '24 horas', 'rebecamacciocco97@gmail.com', '$2b$10$tfPO5kyJcqcIjQvRsefdf.EtGZ5Lo61Syx.n4gaaACfkzghC2UfAW', 'https://www.canva.com/design/DAGjrqdmyG4/Z20W7MRlLM42oUcneAdclA/view?utm_content=DAGjrqdmyG4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h598fa09532', 21000.00, 20.00, '2025-06-11 12:56:03', 0, NULL, NULL, '0170116240000008802934', '27405448799'),
(132, 'Joel Grebin Silvestri', 'Lic en Psicoligía', '77256', NULL, 'Soy Psicólogo especializado en terapias contextuales ACT/Mindfulness que son\nenfoques con sólida evidencia para tratar ansiedad, depresión y estrés.\nTe acompaño de corazón con una mirada empática. \nAtención Online', '+5491127446164', '24 horas', 'joelssilvestri@gmail.com', '$2b$10$5XQkizmgyc3NPQiRdsu9aebEUhbWJyeybwegaJfiHdLULF4MqPtUW', 'https://drive.google.com/file/d/1JV6de5KVKarjyVpt0OgXctLKiNxnz7jv/view?usp=sharing', 30000.00, 30.00, '2025-06-12 01:10:52', 1, NULL, NULL, '0000003100086779960415', '23366969209'),
(133, 'Maria Florencia Echezarreta', 'Lic Psicologia', '85017', 'Buenos Aires', 'Hola, soy lic en psicología egresada en la UBA. Cuento con formación en psicología comunitaria y experiencia en voluntariados, junto con +5 años de experiencia en psicología del trabajo, realizando tareas de rrhh y brindando talleres y coaching para mejorar la empleabilidad de las personas. \n', '1122100797', '24 horas', 'florencia.echezarreta1@gmail.com', '$2b$10$alKuDue1d9ASpx4PE44rVOKqr0LLnEhnBLzIXgxYzuF0OXICILcTm', 'https://drive.google.com/uc?export=view&id=1ftHQuToObxa3mfAvVwxIO6TKFDVJp-Zd', 15000.00, 1500.00, '2025-06-11 13:59:39', 0, NULL, NULL, '0720769588000003180372', '27348740909'),
(134, 'Francisco Azqueta', 'Licenciado en psicologia', '63003', '-', 'Psicoterapia psicoanalitica, con especialización en cultura y salud mental. Acompaño procesos de cambio, duelos, terapia vincular, desarrollo personal y temáticas migratorias, entre otras. ', '+34622107541', '24 horas', 'franazqueta@gmail.com', '$2b$10$ZjUgllTBKYl/GymvXUnCY.o7caSLOshG.6qc7soX7Esosa.ru3vNm', 'https://drive.google.com/file/d/1wASsR9PW4Q_0iobYq1ZEa5vhnP5v00X8/view?usp=sharing', 28000.00, 25.00, '2025-06-12 10:12:08', 1, NULL, NULL, '0070241830004011625468', '20332736583'),
(135, 'Anabella Sgubin', 'Licenciada en psicologia', '69274', 'Buenos Aires', 'Soy Licenciada en psicología, egresada de la uba. Cuento con experiencia y formación en violencia de genero y diversidades. Asimismo tengo un diplomado en psico traumatologia entre otros cursos. Actualmente me dedico a la atención clinica online', '01162115965', '24 horas', 'anisgubin@gmail.com', '$2b$10$mIt1sUeNzqfUQ4G1LfHqxufYYpSbSz1wIjXpzA/IN4leaVFJzY2Ly', 'https://www.linkedin.com/in/anabella-sgubin-a92678b4/', 25000.00, 35.00, '2025-06-11 19:01:19', 0, NULL, NULL, '00000000000000000000', '27365010531'),
(136, 'wswd', 'fgfd', 'fgdsg', 'fdgs', 'gfdgdfs', 'wdwd', '24 horas', 'felicitas.musa.tamburelli@santodomingo.edu.ar', '$2b$10$Gz7zImCt1Q7hI/fVYdhkrOSF3VtC2h6tj4HIF0YCRITMgHkqN4y1W', 'https://drive.google.com/uc?export=view&id=14-dPGsUkJi6u3ld_OraTIGET6k3cCELf', 1.00, 1.00, '2025-06-12 13:18:26', 0, NULL, NULL, '4351345413', '5435135');
INSERT INTO `profesionales` (`id_profesional`, `nombre`, `titulo_universitario`, `matricula_nacional`, `matricula_provincial`, `descripcion`, `telefono`, `disponibilidad`, `correo_electronico`, `contrasena_hash`, `foto_perfil_url`, `valor`, `valor_internacional`, `creado_en`, `estado`, `reset_token`, `reset_token_expira`, `cbu`, `cuit`) VALUES
(137, 'Fernando Zunino ', 'Licenciado en Psicología', '59288', '48737', 'Licenciado en Psicología, dedicado a la atención de Adultos y Adultos Mayores. \nCuento con experiencia de docencia y actividades de formación y promoción de la salud mental. \nPropongo un encuadre de trabajo integrador, combinando herramientas de Psicoanálisis y Terapia Cognitiva Conductual.', '1155695430', '24 horas', 'fernandozunino75@gmail.com', '$2b$10$UWBFu3RKJWt15dD8ya.0vuibf.veENRs2k4LXus0gJ.9yZyWoNcI6', 'https://drive.google.com/file/d/16iOwB4AMNa_wJgTjDj52GpFn_pi15RXF/view?usp=sharing', 26000.00, 25.00, '2025-06-21 14:49:06', 1, NULL, NULL, '0150541201000126949716', '20248217295'),
(138, 'Romina Martin', 'Lic. en Psicología ', '5404', 'Buenos Aires', 'Atención clínica con pacientes en consultorio privado y de manera online.\nPosgrado en Clínica Psicoanálitica con ADOLECS Y ADULTOS.\nFormación en la EFBA (Escuela Freudiana de Bs. AS) INST ULLOA. ', '221-6056846 ', '24 horas', 'rominamartinp@gmail.com', '$2b$10$SGwY8Lc3aynfHsi4BKsN3.FPZV2tmAmqGGtPglbeEfCmx29LUa0.i', 'https://drive.google.com/file/d/1u0-SJd_vtCWEcBUvWH8rZexphk4SHTg_/view?usp=sharing', 35000.00, 30.15, '2025-06-20 08:28:41', 1, NULL, NULL, '2850569520095979041954', '27-34382591-4 '),
(139, 'Mauro Mitria ', 'Lic en psicología ', '72598', NULL, 'Psicólogo con orientación TCC egresado de la Universidad de Buenos Aires y con gran experiencia laboral en violencia familiar y de genero. ', '1132465578', '24 horas', 'mauromitria@hotmail.com', '$2b$10$DBzYrSESkmZ8coa1k6/i6eov0F46Wm/d/yv9/WMMB4/FISbYvzb6C', 'https://drive.google.com/file/d/1LwM89yHFruQoXiqdvmN5eP4X8DXpJC31/view?usp=sharing', 22000.00, 20.00, '2025-06-20 04:55:52', 1, NULL, NULL, '0000003100026977910342', '23390612419'),
(140, 'Sara Martinez', 'Licenciada en Psicologia', '-', '5517', 'Licenciada en Psicología.    \nRecibida en la Universidad Nacional de La Plata.                                                                                          \nOrientación Psicoanalítica. \nAtención a Adolescentes y Adultos. \n', '2392560048', '24 horas', 'martinezsara@abc.gob.ar', '$2b$10$EjrJYszixJAt5e/yar7P5./QTmJ46AG4vnPS1.o1qtOVWYZHkmvFG', 'https://drive.google.com/file/d/14oi87dqVDzKxs1DNUJFltlWXgilLxJt4/view?usp=sharing', 20000.00, 20.00, '2025-06-20 20:56:03', 0, NULL, NULL, '0000076500000019533650', '27395971773'),
(141, 'Cecilia Schab', 'Lic. En Psicologia', '38430', NULL, 'Psicóloga (UBA) con más de 20 años de experiencia. Atención a adolescentes y adultos. Perspectiva de género y diversidad. Escucha empática y mirada integradora.\nInstagram: @terapia_actodeamorpropio', '2392 605351', '24 horas', 'schabcecilia@gmail.com', '$2b$10$5jLqsmsXh7D81hMsina4T.OK8SS1a2BykG6W/XTORqWTowDsMc51m', 'https://drive.google.com/uc?export=view&id=1iC6R5p2dLsT5vbrCS01VUN31kS7KgnBZ', 35000.00, 35.00, '2025-06-21 18:32:15', 0, NULL, NULL, '0140451103678450564200', '27265513765'),
(142, 'Joan Martin Garau', 'Lic. Psicología', '53645', 'capital federal', 'Soy psicólogo con más de 10 años de experiencia clínica y en peritajes. Me especializo en psicología del deporte y accidentología. Brindo atención integral, con diagnóstico preciso y un enfoque humano, estratégico y adaptado a cada persona.\n', '5491165711087', '24 horas', 'joanmgarau@gmail.com', '$2b$10$cUOvmG7IvVlMZabOMqgo8egDVIYY3H2Ka9jjKwiZq9pG0cGbaLN1y', 'campus.iceba.edu.ar/course/index.php?categoryid=2', 40000.00, 40.00, '2025-06-23 00:00:53', 0, NULL, NULL, '0170101840000007712564', '20316750150'),
(143, 'Fernanda Montessano ', 'Lic en Psicologia ', '38085', NULL, 'Acompaño especialmente a adolescentes en momentos de cambio, crisis o búsqueda personal, brindando herramientas para el fortalecimiento emocional, el desarrollo de la autoestima y el manejo del estrés.', '01140886553', '24 horas', 'fernandamontessano066@gmail.com', '$2b$10$EzN6b09KaB704IvC8oF45Od0s6cpe6W.tEsCjPWm4neikMdUj/HjK', '', 50000.00, 45.00, '2025-07-01 06:42:07', 0, NULL, NULL, '0720035988000010077340', '27240219080'),
(144, 'Melisa Cummaudo ', 'Lic en Psicología ', NULL, '2210', 'Psicóloga clínica. Diplomatura  en Psicología Integrativa. 15 años de experiencia. ', '+542634591808', '24 horas', 'meli_cummaudo@hotmail.com', '$2b$10$LQ.AacTZaloqxI/JIpyh2OntOOfpk5uY7d5FHA4Cp92wxF4eSbEGG', '', 25000.00, 20.00, '2025-07-07 03:00:47', 0, NULL, NULL, '0000003100012761344417', '27312870148'),
(145, 'Ingrid Aguero', 'Licenciada en psicología ', '60.775', '-', 'Licenciada en Psicología con una trayectoria de mas de 10 años en psicología clínica. Posgrado en psicoterapias cognitivas contemporáneas.  ', '1166094527', '24 horas', 'licingridaguero@gmail.com', '$2b$10$t7y4ehLHpWhm.67xFBMbK.cbzd8zAd1ayVFxmiRhJUXtpXBhxDjYu', 'https://drive.google.com/uc?export=view&id=1KgxwoxjRoFHwmLtuqY81oNEKjDGzlB58', 27000.00, 35.00, '2025-07-07 10:47:31', 0, NULL, NULL, '0290012410000002003875', '27304016855'),
(146, 'Romina Jovanovich', 'Licenciada en Psicología ', NULL, '1942', 'Te espero en un espacio súper ameno para trabajar tanto en psico-nutrición, así como superar situaciones difíciles y traumas, o para acompañarte en tu proceso de autoconocimiento y superación. Técnicas novedosas certificadas en Estados Unidos (EMDR)', '+542615706511', '24 horas', 'romina.jovanovich@gmail.com', '$2b$10$d0oTjGPtfRGljDgmZaNqaO2J4nuab4c4bTXhq2djJTsjFJ2If.yk6', 'https://www.facebook.com/share/15tJc5juV4/', 40000.00, 65000.00, '2025-07-07 06:22:15', 0, NULL, NULL, '4530000800015798381125', '27299390891');

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
(22, 2),
(22, 43),
(25, 50),
(27, 2),
(28, 43),
(31, 2),
(32, 2),
(37, 47),
(38, 43),
(40, 43),
(40, 60),
(41, 2),
(41, 43),
(41, 48),
(41, 58),
(43, 2),
(44, 2),
(46, 2),
(46, 43),
(46, 44),
(46, 46),
(46, 47),
(46, 48),
(47, 2),
(47, 43),
(47, 58),
(48, 2),
(48, 43),
(48, 47),
(48, 52),
(48, 57),
(49, 2),
(49, 43),
(50, 2),
(50, 3),
(50, 43),
(50, 48),
(50, 54),
(50, 57),
(50, 59),
(51, 2),
(52, 2),
(54, 2),
(54, 43),
(54, 58),
(57, 2),
(57, 43),
(61, 2),
(61, 43),
(62, 2),
(62, 43),
(62, 53),
(63, 2),
(65, 2),
(65, 49),
(65, 53),
(65, 56),
(68, 2),
(72, 2),
(74, 2),
(75, 57),
(76, 2),
(76, 43),
(76, 57),
(77, 2),
(78, 2),
(78, 43),
(78, 49),
(78, 56),
(79, 43),
(80, 2),
(81, 2),
(81, 43),
(81, 46),
(81, 57),
(82, 2),
(82, 43),
(82, 44),
(82, 47),
(83, 2),
(83, 43),
(83, 48),
(84, 2),
(84, 43),
(84, 44),
(84, 46),
(86, 2),
(87, 43),
(88, 2),
(88, 43),
(88, 54),
(89, 2),
(89, 43),
(89, 45),
(89, 53),
(89, 57),
(90, 2),
(90, 43),
(90, 44),
(90, 45),
(91, 2),
(91, 43),
(91, 48),
(91, 49),
(91, 57),
(92, 2),
(92, 43),
(93, 2),
(93, 43),
(94, 2),
(95, 2),
(95, 43),
(95, 44),
(96, 62),
(97, 2),
(97, 43),
(97, 44),
(98, 2),
(98, 43),
(99, 2),
(99, 43),
(100, 2),
(100, 43),
(101, 2),
(102, 2),
(102, 43),
(103, 2),
(104, 2),
(104, 43),
(105, 2),
(106, 2),
(106, 43),
(106, 45),
(106, 48),
(106, 54),
(106, 60),
(107, 2),
(107, 47),
(108, 2),
(108, 43),
(108, 44),
(109, 2),
(110, 43),
(111, 2),
(112, 2),
(112, 43),
(112, 48),
(112, 54),
(113, 2),
(114, 2),
(114, 43),
(114, 44),
(115, 43),
(116, 2),
(116, 60),
(117, 2),
(118, 2),
(118, 49),
(119, 2),
(120, 2),
(121, 2),
(121, 43),
(122, 2),
(123, 2),
(123, 43),
(123, 49),
(123, 56),
(124, 2),
(124, 43),
(124, 48),
(124, 57),
(124, 60),
(125, 2),
(125, 43),
(126, 2),
(126, 43),
(126, 44),
(126, 58),
(127, 2),
(127, 43),
(128, 2),
(129, 61),
(130, 2),
(130, 43),
(130, 44),
(130, 46),
(131, 2),
(131, 43),
(131, 45),
(131, 53),
(132, 2),
(132, 43),
(132, 47),
(132, 51),
(133, 2),
(133, 53),
(133, 54),
(134, 2),
(134, 43),
(134, 45),
(134, 53),
(134, 54),
(134, 59),
(134, 60),
(135, 2),
(135, 43),
(136, 2),
(136, 52),
(137, 2),
(137, 43),
(138, 2),
(138, 43),
(139, 2),
(139, 43),
(140, 2),
(140, 43),
(141, 2),
(141, 43),
(142, 2),
(142, 43),
(142, 49),
(142, 56),
(142, 58),
(143, 2),
(143, 43),
(143, 48),
(143, 52),
(143, 57),
(144, 2),
(144, 43),
(145, 2),
(145, 43),
(145, 44),
(146, 2),
(146, 43),
(146, 48),
(146, 59);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_temporales`
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
-- Volcado de datos para la tabla `tokens_temporales`
--

INSERT INTO `tokens_temporales` (`booking_token`, `id_profesional`, `id_usuario`, `fecha_turno`, `hora_turno`, `precio_original`, `precio_final`, `cupon`, `registrar_cupon`, `creado_en`) VALUES
('0029c24a-daa2-4478-8a1a-4f7e36a0675b', 46, 232, '2025-07-12', '15:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 02:28:34'),
('01614649-abf5-4372-8d80-a07f67a7ecd0', 57, 124, '2025-06-03', '10:00:00', 35.00, 35.00, NULL, 0, '2025-06-02 04:15:51'),
('05ee0a0e-fca3-4264-9a13-a96d1819ba1a', 76, 43, '2025-06-03', '09:00:00', 35.00, 35.00, NULL, 0, '2025-05-31 02:08:08'),
('0c8937c5-ff90-415e-a036-59b2ef843e2d', 72, 43, '2025-06-10', '11:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-03 15:14:56'),
('0c9db672-2c86-440c-929c-7b6333a3352d', 72, 209, '2025-07-14', '14:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-06 23:53:24'),
('1191b36f-c44d-44e8-b0c0-56c6f0850013', 63, 162, '2025-07-02', '22:00:00', 25000.00, 25000.00, NULL, 0, '2025-06-20 14:16:57'),
('133a366e-3f53-4ecf-b627-3de1c2e8637c', 68, 105, '2025-06-05', '18:30:00', 25000.00, 25000.00, NULL, 0, '2025-06-04 18:40:08'),
('1906509c-0928-4f21-b8e0-9ebe558a22b5', 76, 112, '2025-06-03', '17:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-02 00:16:02'),
('2df37456-273d-49de-a3e2-4f0ccdde3eb3', 76, 43, '2025-06-03', '09:00:00', 23000.00, 23000.00, NULL, 0, '2025-05-31 02:07:49'),
('2e020231-a63d-4160-b76b-eec33b3eda7a', 72, 53, '2025-06-02', '12:00:00', 20000.00, 8000.00, 'PRIMERASESION', 1, '2025-06-02 11:13:15'),
('31966e56-f412-407d-bcd1-b5d66dad8cdb', 72, 43, '2025-07-28', '08:00:00', 20000.00, 8000.00, 'PRIMERASESION', 1, '2025-05-28 12:36:01'),
('36aca8c6-64be-4219-a069-3810a0cbcb22', 72, 183, '2025-07-08', '14:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-06 21:58:21'),
('38c23a14-b126-4a6d-b171-757dcb036855', 68, 43, '2025-06-14', '10:00:00', 25000.00, 25000.00, NULL, 0, '2025-06-07 15:47:22'),
('3a95dbde-9fe6-4859-ba16-3b496bc1ee55', 57, 138, '2025-06-17', '11:00:00', 35.00, 35.00, NULL, 0, '2025-06-07 05:38:23'),
('413ac154-d5bc-4f4a-a95f-bdf65b78e6d3', 72, 43, '2025-06-10', '11:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-03 15:15:44'),
('47e39a30-6a24-4e9e-9100-5b4d8373a129', 76, 53, '2025-06-03', '10:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-02 13:15:48'),
('48215619-47a5-4499-a182-3c245d85fe31', 46, 213, '2025-07-08', '12:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 00:21:50'),
('48f3a11b-5e46-473b-8886-5495832e45fd', 121, 53, '2025-06-04', '12:00:00', 30000.00, 30000.00, NULL, 0, '2025-06-04 13:35:32'),
('54247d82-7765-47a9-9023-547d6592be36', 121, 53, '2025-06-09', '09:45:00', 30000.00, 30000.00, NULL, 0, '2025-06-07 15:15:42'),
('57d12de7-21dc-4582-a515-7e2efd8acbd2', 72, 95, '2025-06-02', '19:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-01 18:24:59'),
('614e0b0d-43ad-42db-b193-459184a7272e', 72, 43, '2025-06-03', '08:00:00', 20000.00, 20000.00, NULL, 0, '2025-05-31 01:42:09'),
('61c6fbcc-5c86-45df-9c9d-2d78734b6d3a', 76, 43, '2025-06-05', '09:00:00', 23000.00, 23000.00, NULL, 0, '2025-05-30 21:53:21'),
('682c5dba-580b-46ee-a068-a56a4cfe226f', 72, 43, '2025-06-02', '08:00:00', 20000.00, 20000.00, NULL, 0, '2025-05-28 21:05:44'),
('6aa2ee39-daca-46cb-96e4-a2bdf904d287', 72, 43, '2025-06-03', '08:00:00', 20.00, 20.00, NULL, 0, '2025-05-31 01:42:32'),
('6d2edc62-c576-4e0f-82c8-2e9fb7bb26bc', 72, 43, '2025-06-03', '08:00:00', 20000.00, 20000.00, NULL, 0, '2025-05-31 01:44:11'),
('6fa2c296-9c70-4fda-b2c1-f412b592fff2', 121, 53, '2025-06-12', '12:00:00', 30000.00, 30000.00, NULL, 0, '2025-06-05 13:35:45'),
('711da709-3352-40a2-b5c0-89f051d8db8d', 72, 171, '2025-07-14', '16:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-06 21:31:09'),
('73a88738-e8c5-4159-83cc-58212adac681', 76, 53, '2025-06-02', '11:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-02 12:14:41'),
('7655a773-c56b-4206-b8bf-e5bc5f8d0e08', 72, 222, '2025-07-08', '16:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 01:03:17'),
('7aacbe9e-59fb-4a7a-b081-75e4066d1f22', 72, 251, '2025-07-21', '14:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 06:35:43'),
('7c918ba6-6c8d-40e5-8bc9-3010e2a7802a', 121, 53, '2025-06-04', '11:00:00', 30.00, 30.00, NULL, 0, '2025-06-04 13:32:48'),
('7e039a1f-e40a-45ae-bd85-3d45408a8747', 125, 147, '2025-06-13', '15:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-11 19:44:40'),
('8749b4ce-0a0e-4b96-b61f-6c8251fb7e77', 76, 43, '2025-05-28', '19:00:00', 35.00, 35.00, NULL, 0, '2025-05-28 20:59:22'),
('8a92c09d-4cf7-4542-81bc-ff7983cdae00', 57, 57, '2025-06-05', '12:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-01 22:42:24'),
('8b2af34f-f158-4199-bd1f-e1a6cfe2ba7f', 77, 242, '2025-07-11', '13:00:00', 25000.00, 25000.00, NULL, 0, '2025-07-07 03:21:57'),
('8c326ab9-b575-4361-8058-d3ac653a79ee', 46, 138, '2025-06-14', '09:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-07 05:40:07'),
('900ba6a5-7dea-43f8-8e39-73e96ce2de2c', 68, 131, '2025-06-04', '19:00:00', 25000.00, 25000.00, NULL, 0, '2025-06-02 16:29:33'),
('90cc0a05-1fce-408d-a5c6-17c10a1b9120', 76, 230, '2025-07-08', '17:00:00', 25000.00, 25000.00, NULL, 0, '2025-07-07 02:10:57'),
('95c52404-a1b6-48bb-aafd-46f0f292bf74', 76, 208, '2025-07-07', '17:00:00', 25000.00, 25000.00, NULL, 0, '2025-07-06 23:49:20'),
('9ab61b84-fc47-412b-9b55-2094e8550b43', 125, 53, '2025-06-11', '09:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-07 16:16:44'),
('9ad4697a-7ae2-472f-8674-6d85e751af0a', 46, 205, '2025-07-11', '16:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-06 23:32:19'),
('9e983ba6-9210-4d18-8af8-669e6a85f04f', 72, 215, '2025-07-08', '15:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 00:31:52'),
('9fbcc3e8-7c82-48f0-b717-9d5270936b48', 68, 131, '2025-06-04', '19:00:00', 25000.00, 25000.00, NULL, 0, '2025-06-02 16:30:24'),
('a077a45f-f2ff-4dc9-ab5a-9eb27acfb799', 41, 221, '2025-07-10', '11:15:00', 25000.00, 25000.00, NULL, 0, '2025-07-07 01:03:24'),
('a41a1801-f02f-44d0-bd24-98f6612416b1', 125, 53, '2025-06-10', '11:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-07 16:15:56'),
('a56784f3-89a0-463d-a1de-070b85d27343', 76, 217, '2025-07-08', '10:00:00', 25000.00, 25000.00, NULL, 0, '2025-07-07 00:47:25'),
('a8bcc9da-8cbb-4507-b6e6-543616f816ed', 76, 109, '2025-06-03', '13:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-01 23:24:35'),
('ac000d74-8d2b-48e1-b217-7fd15cabfc4a', 119, 53, '2025-06-06', '14:25:00', 30000.00, 30000.00, NULL, 0, '2025-06-05 13:35:10'),
('b51a9bfa-8ae3-4b17-bb05-fdd1a4ff73f9', 72, 245, '2025-07-11', '19:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-07 04:01:42'),
('be98ba8f-cf3d-42ca-9d12-1dfab3b6ab42', 46, 138, '2025-06-07', '12:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-07 14:58:05'),
('c05086e4-0d78-403a-9fdc-8b196e71be79', 46, 138, '2025-06-07', '09:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-07 05:45:19'),
('c318595c-d29e-4599-bd9d-39c048c3c4f8', 72, 175, '2025-07-07', '16:00:00', 20000.00, 20000.00, NULL, 0, '2025-07-06 21:39:39'),
('c6381614-7c6c-4ef5-b28d-e7ca020390b8', 76, 92, '2025-06-11', '18:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-02 17:41:04'),
('c7b14abe-1491-45ef-ac80-0ace43126d97', 57, 132, '2025-06-19', '18:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-12 22:35:35'),
('cf4f4150-b31a-46ed-a8c6-2627a0b484a1', 46, 110, '2025-06-05', '10:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-01 23:27:39'),
('d6a0f64d-2b6b-4129-8c73-6472ad264db5', 57, 196, '2025-07-10', '18:00:00', 23000.00, 23000.00, NULL, 0, '2025-07-06 23:03:19'),
('da8b0ef5-2244-4a5e-a409-fb7f88999817', 46, 138, '2025-06-19', '09:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-17 23:43:10'),
('df4b7daf-f095-49a5-99c2-e004e5f876ff', 76, 43, '2025-06-03', '09:00:00', 35.00, 35.00, NULL, 0, '2025-05-31 02:13:14'),
('df712b43-ff50-4961-b11d-8487b8856d16', 76, 43, '2025-05-31', '09:00:00', 35.00, 35.00, NULL, 0, '2025-05-31 02:43:18'),
('e3dd9927-6109-4749-bb99-e214b3a1c155', 72, 43, '2025-06-10', '11:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-03 15:15:12'),
('e492124f-9025-4db9-acbd-823b17acefbf', 68, 98, '2025-06-04', '19:00:00', 25000.00, 25000.00, NULL, 0, '2025-06-01 19:10:38'),
('e84ba712-f41c-4585-94bc-3b035b611336', 76, 53, '2025-06-03', '10:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-02 13:30:21'),
('edd1e5e0-38db-4b14-a018-82f1dc50f5ac', 76, 43, '2025-05-31', '09:00:00', 23000.00, 23000.00, NULL, 0, '2025-05-31 02:43:10'),
('efc123a5-18d0-444b-88f3-27e1687c3fd9', 72, 139, '2025-06-24', '13:00:00', 20000.00, 20000.00, NULL, 0, '2025-06-10 21:28:58'),
('f06f6b2c-f888-45cb-a792-3b97fea69f0c', 57, 249, '2025-07-10', '15:00:00', 23000.00, 23000.00, NULL, 0, '2025-07-07 06:18:42'),
('f7404811-8ecc-47dd-ac45-6a48e6dab3f6', 125, 53, '2025-06-09', '11:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-07 16:30:01'),
('fa2b4c74-d6c7-4c0a-9985-31c4accb6f98', 125, 53, '2025-06-12', '14:00:00', 23000.00, 23000.00, NULL, 0, '2025-06-12 13:16:05'),
('fea0eded-e723-49f4-be5f-7bf592743486', 77, 53, '2025-07-11', '10:00:00', 25000.00, 25000.00, NULL, 0, '2025-07-05 15:37:50');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
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
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_profesional`, `id_usuario`, `fecha_turno`, `hora_turno`, `estado`, `motivo_cancelacion`, `creado_en`, `meet_url`, `meet_creado_en`, `google_event_id_paciente`, `google_event_id_profesional`) VALUES
(62, 25, 43, '2025-04-28', '08:00:00', 'Completado', NULL, '2025-04-25 14:15:22', 'https://meet.google.com/oew-kwsx-mmo', NULL, NULL, 'buhimfiet8im3lf9tt1ldbdas0'),
(72, 25, 43, '2025-04-28', '09:00:00', 'Pendiente', NULL, '2025-04-25 15:54:19', 'https://meet.google.com/gxn-zdjb-fru', NULL, NULL, 'mb7f1ibk9ncsjr3tq0ltn97ons'),
(73, 27, 51, '2025-04-25', '13:00:00', 'Pendiente', NULL, '2025-04-25 15:55:04', 'https://meet.google.com/hrr-wspt-qbd', NULL, NULL, 'v3hr228bn4m8k26n59qgdeqt9s'),
(74, 25, 51, '2025-04-28', '10:00:00', 'Completado', NULL, '2025-04-25 15:59:31', 'https://meet.google.com/imp-upxp-evw', NULL, NULL, 'c5up0aelkfppcl1cbv3e4cniek'),
(75, 27, 43, '2025-04-25', '14:00:00', 'Pendiente', NULL, '2025-04-25 16:02:53', 'https://meet.google.com/cbg-irwj-vxn', NULL, NULL, 'v600rq0k572ni39snkr36jrfa4'),
(79, 25, 43, '2025-04-28', '11:00:00', 'Pendiente', NULL, '2025-04-25 16:21:23', 'https://meet.google.com/iwt-idng-hhh', NULL, NULL, '8a4bsqofs5eebp5afaonce9d9s'),
(80, 25, 43, '2025-04-28', '12:00:00', 'Pendiente', NULL, '2025-04-25 16:29:50', 'https://meet.google.com/tdr-uxwr-zof', NULL, NULL, '304tf9hike411es3lt847ss1mg'),
(84, 25, 43, '2025-04-28', '13:00:00', 'Pendiente', NULL, '2025-04-25 17:00:08', 'https://meet.google.com/rff-oqns-oit', NULL, NULL, 't79eu3jls9bm4sif4qt6jhsp64'),
(85, 74, 43, '2025-04-28', '14:00:00', 'Pendiente', NULL, '2025-04-25 17:00:59', 'https://meet.google.com/hmh-zjwj-hss', NULL, NULL, 'v5am06evseurnik81i03qruir0'),
(86, 22, 52, '2025-04-25', '16:00:00', 'Completado', NULL, '2025-04-25 17:22:45', 'https://meet.google.com/oex-ogty-goa', NULL, NULL, '4rnmeft0ia2glmsrde56avhjjg'),
(87, 25, 43, '2025-05-21', '15:00:00', 'Pendiente', NULL, '2025-04-25 18:38:07', 'https://meet.google.com/uze-boza-bzj', NULL, NULL, 'l1erg0dgji7djj7f8svnfcviqg'),
(89, 25, 43, '2025-04-28', '16:00:00', 'Pendiente', NULL, '2025-04-25 19:06:08', 'https://meet.google.com/bgz-yoki-yta', NULL, NULL, 'brpk3750pl91ase2dshuju02bo'),
(100, 25, 51, '2025-05-05', '08:00:00', 'Pendiente', NULL, '2025-04-25 20:18:19', 'https://meet.google.com/tgv-rhyo-ijd', NULL, NULL, 'fqiur9i0qj44tbhqu7fl616smg'),
(109, 27, 53, '2025-04-30', '17:00:00', 'Pendiente', NULL, '2025-04-26 11:31:44', 'https://meet.google.com/zwr-adia-mig', NULL, NULL, 'vqgckr3tt4oh0a1tl2i3ipiebo'),
(129, 49, 52, '2025-05-06', '15:00:00', 'Completado', NULL, '2025-05-06 16:34:22', 'https://meet.google.com/jwx-jfty-qjq', NULL, NULL, 'ksqe63bgsvikutlk47lp6fqu2g'),
(132, 25, 43, '2025-05-05', '08:00:00', 'Completado', NULL, '2025-05-11 13:54:25', 'https://meet.google.com/qct-jijt-ero', NULL, NULL, '7kgsgpdc3mh9bpcqu7ivcgphfo'),
(141, 27, 57, '2025-05-12', '12:00:00', 'Pendiente', NULL, '2025-05-12 14:40:59', 'https://meet.google.com/oqr-pzfm-npy', NULL, NULL, 'gdpmkgrpd7gr5r8p1hm8qltor4'),
(144, 27, 52, '2025-05-19', '08:00:00', 'Pendiente', NULL, '2025-05-13 11:52:36', 'https://meet.google.com/isz-znww-wpq', NULL, NULL, 'ebcpnvd0cgh7smn1uhh5r312tg'),
(146, 27, 52, '2025-05-19', '09:00:00', 'Pendiente', NULL, '2025-05-13 14:33:44', 'https://meet.google.com/uro-ncrr-ucb', NULL, NULL, '3mbgf4q202f86s7o59ii12m62k'),
(150, 27, 52, '2025-05-19', '11:00:00', 'Pendiente', NULL, '2025-05-13 18:07:29', 'https://meet.google.com/vvg-fbbi-kwc', NULL, NULL, '87gog3vkkc2pcksj1m74ilrv6s'),
(153, 27, 52, '2025-05-15', '12:00:00', 'Pendiente', NULL, '2025-05-15 14:40:20', 'https://meet.google.com/yym-czxe-nze', NULL, NULL, 'mma0m278somr1odj3c1t60u460'),
(154, 75, 57, '2025-05-22', '13:00:00', 'Pendiente', NULL, '2025-05-16 15:16:54', 'https://meet.google.com/efm-ymgi-kmx', NULL, NULL, '2kq0rc6ar0a2qfr95nm24t3b9s'),
(155, 25, 43, '2025-06-02', '08:00:00', 'Pendiente', NULL, '2025-05-28 12:46:32', NULL, NULL, NULL, NULL),
(156, 25, 43, '2025-06-02', '09:00:00', 'Pendiente', NULL, '2025-05-28 13:27:42', NULL, NULL, NULL, NULL),
(157, 25, 43, '2025-06-02', '10:00:00', 'Pendiente', NULL, '2025-05-28 13:34:45', NULL, NULL, NULL, NULL),
(158, 22, 85, '2025-06-02', '15:00:00', 'Pendiente', NULL, '2025-06-01 16:33:14', 'https://meet.google.com/roh-otrg-oan', NULL, NULL, '43etp36fhu629q4pjng9nvimik'),
(159, 76, 92, '2025-06-02', '10:00:00', 'Pendiente', NULL, '2025-06-01 17:54:37', 'https://meet.google.com/ktd-mxjb-vak', NULL, NULL, '3d6fd8vvmrkfp0vrnbn60gflgc'),
(160, 57, 102, '2025-06-03', '12:00:00', 'Pendiente', NULL, '2025-06-01 21:16:36', 'https://meet.google.com/rbd-reqk-fgb', NULL, NULL, 'gr7vnqhou214nat4oqfpiavs78'),
(161, 76, 104, '2025-06-03', '19:00:00', 'Pendiente', NULL, '2025-06-01 21:50:40', 'https://meet.google.com/muz-fxed-yvf', NULL, NULL, 'sltr27k11qri5lknbf94o8h5ak'),
(162, 72, 110, '2025-06-02', '08:00:00', 'Pendiente', NULL, '2025-06-01 23:32:08', NULL, NULL, NULL, NULL),
(163, 46, 117, '2025-06-06', '12:00:00', 'Completado', NULL, '2025-06-02 01:00:19', 'https://meet.google.com/ioo-udeb-tzo', NULL, NULL, 'jbtbjcnni8aa8426ko10lvghbs'),
(164, 76, 121, '2025-06-09', '16:00:00', 'Pendiente', NULL, '2025-06-02 03:05:28', 'https://meet.google.com/oed-jirw-wca', NULL, NULL, '93jqifi8k4s19iq5eoh824fcvk'),
(165, 76, 92, '2025-06-11', '18:00:00', 'Pendiente', NULL, '2025-06-02 17:42:56', 'https://meet.google.com/meg-uexp-zfx', NULL, NULL, 'mfck997t7ccb3ffrtklq7h6eds'),
(166, 22, 85, '2025-06-09', '15:00:00', 'Completado', NULL, '2025-06-02 18:40:21', 'https://meet.google.com/zko-zcdg-crq', NULL, NULL, 'ucg3pnefk9j8nfkmvgrorg6q5g'),
(167, 22, 85, '2025-06-23', '15:00:00', 'Completado', NULL, '2025-06-02 18:41:24', 'https://meet.google.com/inb-kzqa-yia', NULL, NULL, 'ie25a7avss5v1la03htnvg16ro'),
(168, 22, 85, '2025-06-30', '15:00:00', 'Completado', NULL, '2025-06-02 18:42:21', 'https://meet.google.com/seu-ogsf-ggg', NULL, NULL, 'r6gjd81cevujlv7n784kbk1gec'),
(169, 57, 132, '2025-06-05', '18:00:00', 'Pendiente', NULL, '2025-06-02 20:51:52', 'https://meet.google.com/uwd-mmat-xrn', NULL, NULL, 'qimd6tngit392m9nas1p5jc5cg'),
(170, 48, 135, '2025-06-05', '19:00:00', 'Completado', NULL, '2025-06-03 12:19:07', 'https://meet.google.com/iwi-excj-stn', NULL, NULL, 'mmce02hicalhalt7akqh24aehc'),
(171, 57, 102, '2025-06-10', '12:00:00', 'Pendiente', NULL, '2025-06-03 15:51:39', 'https://meet.google.com/uue-okdw-mbx', NULL, NULL, 'uc29figrstpdg5906alj1e1410'),
(172, 76, 104, '2025-06-12', '19:00:00', 'Pendiente', NULL, '2025-06-06 09:48:55', 'https://meet.google.com/ymr-pkiy-vjh', NULL, NULL, 'f8v46qpm2smshmlkhoi3k26vcc'),
(173, 46, 138, '2025-06-07', '12:00:00', 'Completado', NULL, '2025-06-07 14:59:36', 'https://meet.google.com/tbo-evyd-ugq', NULL, NULL, '2boeg7pqeadrcsaf6cpp17237s'),
(174, 72, 145, '2025-06-24', '14:00:00', 'Pendiente', NULL, '2025-06-11 13:46:52', NULL, NULL, NULL, NULL),
(175, 57, 132, '2025-06-19', '18:00:00', 'Completado', NULL, '2025-06-12 22:40:39', 'https://meet.google.com/nkk-oukm-jph', NULL, NULL, 'am00adccun3be1tc9fd8keve4k'),
(176, 48, 135, '2025-06-19', '19:00:00', 'Pendiente', NULL, '2025-06-12 22:59:30', 'https://meet.google.com/ogd-geis-nbn', NULL, NULL, 'rhlhtlhaali80as2ni4hqrdn04'),
(177, 76, 92, '2025-06-18', '19:00:00', 'Pendiente', NULL, '2025-06-14 18:48:40', 'https://meet.google.com/spf-yxjc-ngm', NULL, NULL, 's54lll6el0el3pqgvh2kkat8mc'),
(178, 76, 104, '2025-06-20', '14:00:00', 'Completado', NULL, '2025-06-16 12:44:24', 'https://meet.google.com/qtn-zgbz-hhr', NULL, NULL, '2g0m306t76ibrqf7rba3hepfk0'),
(179, 57, 102, '2025-06-18', '15:00:00', 'Pendiente', NULL, '2025-06-17 14:02:26', 'https://meet.google.com/isp-vfom-cpa', NULL, NULL, 'cfpvc5f4dkts08rg47kaj1lcr4'),
(180, 57, 102, '2025-06-24', '11:00:00', 'Pendiente', NULL, '2025-06-17 22:11:52', 'https://meet.google.com/nmv-dvzt-qxk', NULL, NULL, 'p55bi13llmkgeae88cqbps3npc'),
(181, 46, 138, '2025-06-19', '09:00:00', 'Completado', NULL, '2025-06-17 23:45:56', 'https://meet.google.com/ydj-fjwv-inw', NULL, NULL, 'h2h0l2og0lgmij13meq1r5vdfs'),
(182, 46, 156, '2025-06-21', '14:00:00', 'Completado', NULL, '2025-06-19 02:44:40', 'https://meet.google.com/uyg-pxji-drd', NULL, NULL, 'v0ajh03ar04oeua17qi1ushelc'),
(183, 57, 160, '2025-06-26', '16:00:00', 'Pendiente', NULL, '2025-06-19 19:36:23', 'https://meet.google.com/yzy-exaq-grk', NULL, NULL, '92s9juhkn4idolktq84mffc5f4'),
(184, 76, 157, '2025-06-23', '15:00:00', 'Pendiente', NULL, '2025-06-19 20:41:32', 'https://meet.google.com/ijn-dsnt-aom', NULL, NULL, 'ago5p3eaiag3b2hlhiovhke60c'),
(185, 72, 155, '2025-06-24', '13:00:00', 'Pendiente', NULL, '2025-06-22 05:09:29', NULL, NULL, NULL, NULL),
(186, 46, 156, '2025-06-27', '15:00:00', 'Completado', NULL, '2025-06-23 18:31:59', 'https://meet.google.com/dad-hyoi-tei', NULL, NULL, 'ndlgu0jba0htuaoqbs3js3078s'),
(189, 76, 92, '2025-06-25', '19:00:00', 'Pendiente', NULL, '2025-06-24 14:53:18', 'https://meet.google.com/bkh-ymbv-vse', NULL, NULL, 'v09lpnicgij2qchh1nclr35rbs'),
(190, 76, 157, '2025-07-03', '16:00:00', 'Pendiente', NULL, '2025-06-24 15:21:47', 'https://meet.google.com/hot-rtrn-aun', NULL, NULL, '8uc2clq755t27n5fa9g408c36g'),
(191, 57, 132, '2025-06-27', '08:00:00', 'Pendiente', NULL, '2025-06-26 20:51:18', 'https://meet.google.com/skq-mkia-nmn', NULL, NULL, 'f4kmbetmc1n8so74jfvml1n9ro'),
(192, 46, 138, '2025-06-28', '09:00:00', 'Completado', NULL, '2025-06-27 11:18:03', 'https://meet.google.com/gii-cpma-ynz', NULL, NULL, 'mkipdm3kv3r0qqdviu0krn10go'),
(193, 125, 143, '2025-06-30', '15:00:00', 'Pendiente', NULL, '2025-06-27 15:48:41', 'https://meet.google.com/pfr-hrsm-dgm', NULL, NULL, 'jjclq0mp686mq2nbdo32qb5bng'),
(194, 57, 102, '2025-07-01', '11:00:00', 'Pendiente', NULL, '2025-06-30 17:30:46', 'https://meet.google.com/aph-sqix-gcf', NULL, NULL, '5qdgd0e5v1qclmj18v3qh62q4k'),
(195, 22, 85, '2025-07-07', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:51:42', 'https://meet.google.com/nsr-kuzz-thh', NULL, NULL, 'llm8mnt0al74395t27e75r30jg'),
(196, 22, 85, '2025-07-14', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:52:16', 'https://meet.google.com/tqi-ixny-zbu', NULL, NULL, 'd6r4nvf4h0nth6tgrs0qj6mc10'),
(197, 22, 85, '2025-07-21', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:52:49', 'https://meet.google.com/swf-qyfz-fhq', NULL, NULL, 'vco5evdos3lk0fae5c32b8138c'),
(198, 22, 85, '2025-08-04', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:53:39', 'https://meet.google.com/jxx-trfm-fgx', NULL, NULL, 'dg0c9vkm4cfuu5c3bu1ntdkon8'),
(199, 22, 85, '2025-08-11', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:54:14', 'https://meet.google.com/tnn-esrr-wtk', NULL, NULL, '3b2aqn7fl4bnmej8eb33ch8978'),
(200, 22, 85, '2025-08-25', '15:00:00', 'Pendiente', NULL, '2025-06-30 18:54:49', 'https://meet.google.com/uzc-xmck-pji', NULL, NULL, '69sappsra6898bru388e486l8s'),
(201, 57, 132, '2025-07-03', '18:00:00', 'Completado', NULL, '2025-07-01 09:58:28', 'https://meet.google.com/cjc-nojt-dbz', NULL, NULL, 'vq2l01i2e45rav9lf8afpepjd8'),
(202, 76, 92, '2025-07-02', '19:00:00', 'Pendiente', NULL, '2025-07-01 12:07:45', 'https://meet.google.com/dqh-chwq-hte', NULL, NULL, '5ersodeifu6ao5gdr2i62ntnus'),
(203, 46, 156, '2025-07-05', '10:00:00', 'Completado', NULL, '2025-07-01 13:11:42', 'https://meet.google.com/ttn-fbpb-zes', NULL, NULL, 'k14pv3ejm73m4dhobdkg4cir4k'),
(204, 76, 157, '2025-07-14', '17:00:00', 'Pendiente', NULL, '2025-07-03 19:57:44', NULL, NULL, NULL, NULL),
(205, 46, 156, '2025-07-11', '15:00:00', 'Pendiente', NULL, '2025-07-06 18:56:46', NULL, NULL, NULL, NULL),
(206, 139, 180, '2025-07-10', '10:00:00', 'Pendiente', NULL, '2025-07-06 21:54:02', NULL, NULL, NULL, NULL),
(207, 62, 188, '2025-07-08', '10:00:00', 'Pendiente', NULL, '2025-07-06 22:23:38', NULL, NULL, NULL, NULL),
(208, 57, 189, '2025-07-11', '10:00:00', 'Pendiente', NULL, '2025-07-06 22:25:28', NULL, NULL, NULL, NULL),
(209, 72, 174, '2025-07-08', '13:00:00', 'Pendiente', NULL, '2025-07-06 23:02:30', NULL, NULL, NULL, NULL),
(210, 72, 186, '2025-07-07', '16:00:00', 'Pendiente', NULL, '2025-07-06 23:20:50', NULL, NULL, NULL, NULL),
(211, 72, 200, '2025-07-11', '18:00:00', 'Pendiente', NULL, '2025-07-06 23:22:53', NULL, NULL, NULL, NULL),
(212, 72, 212, '2025-07-09', '14:00:00', 'Pendiente', NULL, '2025-07-07 00:17:13', NULL, NULL, NULL, NULL),
(213, 72, 215, '2025-07-08', '15:00:00', 'Pendiente', NULL, '2025-07-07 00:41:23', NULL, NULL, NULL, NULL),
(214, 72, 217, '2025-07-08', '14:00:00', 'Pendiente', NULL, '2025-07-07 00:53:15', NULL, NULL, NULL, NULL),
(215, 46, 223, '2025-07-08', '17:00:00', 'Pendiente', NULL, '2025-07-07 01:26:47', NULL, NULL, NULL, NULL),
(216, 77, 226, '2025-07-12', '15:00:00', 'Pendiente', NULL, '2025-07-07 01:34:22', 'https://meet.google.com/djy-swod-aqt', NULL, NULL, 't6o4c26cql39ms4i26g3mqig9o'),
(217, 41, 240, '2025-07-10', '11:15:00', 'Pendiente', NULL, '2025-07-07 02:58:40', NULL, NULL, NULL, NULL),
(218, 77, 242, '2025-07-11', '13:00:00', 'Pendiente', NULL, '2025-07-07 03:26:37', 'https://meet.google.com/neq-niti-eqz', NULL, NULL, '02ht1cijucpoedmo8vm3fnsiig'),
(219, 41, 253, '2025-07-08', '13:00:00', 'Pendiente', NULL, '2025-07-07 10:21:15', NULL, NULL, NULL, NULL),
(220, 72, 178, '2025-07-18', '18:00:00', 'Pendiente', NULL, '2025-07-07 10:27:37', NULL, NULL, NULL, NULL),
(221, 76, 254, '2025-07-24', '19:00:00', 'Pendiente', NULL, '2025-07-07 10:27:51', NULL, NULL, NULL, NULL),
(222, 76, 92, '2025-07-10', '18:00:00', 'Pendiente', NULL, '2025-07-07 11:13:30', NULL, NULL, NULL, NULL);

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
  `id_google` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expira` bigint(20) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo_electronico`, `contrasena_hash`, `created_at`, `nombre`, `id_google`, `reset_token`, `reset_token_expira`, `telefono`) VALUES
(43, 'ivanrosendo1102@gmail.com', NULL, '2025-04-20 00:19:05', 'Ivan Rosendo', '109221331586509303464', NULL, NULL, '1139114579'),
(51, 'solstupis@gmail.com', NULL, '2025-04-25 15:46:25', 'Sol Stupis', '111415432562062473401', NULL, NULL, NULL),
(52, 'emanuel.mtroncoso@gmail.com', '$2b$10$vNulS1efeSp1dHgr0b3Pi.d4aKt7kjMxq9bu.CFpTlVzlNGy0r9ge', '2025-04-25 17:18:16', 'Emanuel Troncoso', NULL, NULL, NULL, NULL),
(53, 'flortamburelliux@gmail.com', NULL, '2025-04-26 11:30:32', 'Florencia Tamburelli', '115994656102760403233', NULL, NULL, NULL),
(54, 'rociocpoppe@gmail.com', NULL, '2025-04-28 03:38:18', 'Rocio Poppe', '102128018965137122924', NULL, NULL, NULL),
(55, 'franciscovarela1992@gmail.com', NULL, '2025-04-28 21:23:16', 'Francisco Javier Varela', '108455358288273229382', NULL, NULL, NULL),
(57, 'yagostupis@gmail.com', NULL, '2025-05-08 01:41:47', 'Yago Stupis', '101651181948915534856', NULL, NULL, NULL),
(59, 'emanuel.troncoso@terapialibre.com', NULL, '2025-05-08 12:41:56', 'Emanuel Troncoso', '113136986523420291016', NULL, NULL, NULL),
(60, 'agusamilan@gmail.com', '$2b$10$0/RJ3lZDtZ/ZLC.tWpbjO.tWa8BNVcqYcgqumMNCOkdzxdmJWHNHe', '2025-05-09 22:54:38', 'Agustina Milan', NULL, NULL, NULL, NULL),
(61, 'psi.pablogriego@gmail.com', '$2b$10$B2KgHEAbHvNSrQk67gowU..ab.Q1pNFhbCFSsXzh.fxWpT7yWr7km', '2025-05-11 04:35:48', 'Pablo Griego', NULL, NULL, NULL, NULL),
(62, 'herediadeividomar@gmail.com', NULL, '2025-05-12 15:34:49', 'David Heredia', '106308015814006514019', NULL, NULL, NULL),
(63, 'david.heredia@99minutos.com', NULL, '2025-05-12 19:06:39', 'David Heredia', '117714525655912107435', NULL, NULL, NULL),
(65, 'paginaswebs2002@gmail.com', NULL, '2025-05-15 03:16:04', 'paginas webs', '115174563388842750337', NULL, NULL, NULL),
(66, 'vbrosendo08@gmail.com', NULL, '2025-05-15 16:14:48', 'Rosendo Valentin', '104647378198954965475', NULL, NULL, NULL),
(67, 'facumozo98@gmail.com', NULL, '2025-05-15 22:26:33', 'Facundo Mozo', '103997298184433257016', NULL, NULL, NULL),
(68, 'zoerosendocejas@gmail.com', NULL, '2025-05-16 11:32:16', 'zoe rosendo cejas', '108769036256318604305', NULL, NULL, NULL),
(69, 'arq.federicodaghero@gmail.com', NULL, '2025-05-23 14:12:29', 'Arq. Federico Daghero', '106188256577380699856', NULL, NULL, NULL),
(70, 'amarillodenise@gmail.com', NULL, '2025-06-01 15:17:37', 'Denise Amarillo', '106176727488644873941', NULL, NULL, NULL),
(71, 'rociodeharbe2@gmail.com', '$2b$10$Dodk.JyzETO18kZEXI8iBeFkWgxDrOukNC34wJInRVxqjc9RSw.J6', '2025-06-01 15:18:03', 'Rocio Deharbe', NULL, NULL, NULL, NULL),
(72, 'brendalujancic@gmail.com', NULL, '2025-06-01 15:21:14', 'Brenda', '105391939984799009304', NULL, NULL, NULL),
(73, 'gabrielamoacosta@gmail.com', '$2b$10$xeExpnGvmERWoq90cxgfUOL1c3mRw7TTERFOVkgxQ8tPSB9OLYOMC', '2025-06-01 15:25:22', 'Gabriela Acosta ', NULL, NULL, NULL, NULL),
(74, 'malenarodriguez667@gmail.com', '$2b$10$SOFMMevLD4pRI8qt07GmmOGZy/i6bsHYuXRHApACN1qNqTmiYJWXC', '2025-06-01 15:35:49', 'Malena Rodríguez ', NULL, NULL, NULL, NULL),
(75, 'jessica.s.rial@gmail.com', NULL, '2025-06-01 15:36:48', 'Jessica Rial', '115632613120994712977', NULL, NULL, NULL),
(76, 'clemenconmilagros94@gmail.com', '$2b$10$CUiongUU8DViuSBf8smCkuHkA9JWFf0gauObPkJL0gLx25oS6wPBi', '2025-06-01 15:49:37', 'Milagros clemencon', NULL, NULL, NULL, NULL),
(77, 'holacynok@gmail.com', NULL, '2025-06-01 15:53:45', 'Cyn Leguizamón-Fono & Coach', '104526434757390218640', NULL, NULL, NULL),
(78, 'Franchu1868@gmail.com', '$2b$10$5KrIUQIbQD.A7.hLFxqAkO7VZ/wBb7djJcFEHJKyOAKQIcScMWegu', '2025-06-01 16:00:45', 'Yesica valitre', NULL, NULL, NULL, NULL),
(79, 'agostina.fabris@gmail.com', '$2b$10$rIYKNBKwkg8WROHsJoP34.hF4.xvNfRUT1hNFsYDH0zW.uoZTF/J.', '2025-06-01 16:06:10', 'Agostina Fabris', NULL, NULL, NULL, NULL),
(80, 'noeliarojasmb@gmail.com', '$2b$10$.R1hokyod6K4CgSV2VeKdeEchWxSwujPWdJXrEx/Ylb/UJNSDOeuu', '2025-06-01 16:09:17', 'Noelia Rojas', NULL, NULL, NULL, NULL),
(81, 'bazalarkarina92@gmail.com', NULL, '2025-06-01 16:16:04', 'karina bazalar', '113014743731528754826', NULL, NULL, NULL),
(82, 'florencia.valoppi@gmail.com', NULL, '2025-06-01 16:20:44', 'Florencia Valoppi', '107201783639041172218', NULL, NULL, NULL),
(83, 'soledadfagoaga@gmail.com', '$2b$10$Xl3s1BZKxJqA/2tdKLRLL.tQE95rltRVQsVOKreXCCT7FtdiUkTp2', '2025-06-01 16:21:12', 'Maria Soledad Fagoaga ', NULL, NULL, NULL, NULL),
(84, 'amadeopaula@hotmail.com', '$2b$10$WdN1q0yFBpAnhXJa6NEvxuoI5BcvXJ9OzrJCXd6.uR.7EhI523eFW', '2025-06-01 16:22:16', 'Paula', NULL, NULL, NULL, NULL),
(85, 'marianaiba80@gmail.com', '$2b$10$/68X/CUzrXB4OKB6hysxvuyA/H5UQ5ralq3jsI9K7fhRkUDgYLazu', '2025-06-01 16:22:29', 'Mariana Ibañez ', NULL, NULL, NULL, NULL),
(86, 'macasalomon86@gmail.com', '$2b$10$As.eUl/O6Ojn72Qtw3Uw8OuDzUgWchBA6j60Nu.PWutoGgVC/pvfy', '2025-06-01 16:23:05', 'Macarena Salomón ', NULL, NULL, NULL, NULL),
(87, 'cornehldaiana@gmail.com', '$2b$10$eYrbHIGl7Uh7q6LclZNYEuB/zu5VU3VydXctiQPoXLLuvvkO4xIHm', '2025-06-01 16:31:45', 'Daiana cornehl ', NULL, NULL, NULL, NULL),
(88, 'marianoelmoriconib@gmail.com', '$2b$10$sg/SpjbgnGn22qa0iFkJfOm5NMWv8vuh6EhYyPiXK9kq2VH6BV6sG', '2025-06-01 16:40:05', 'MARIA NOEL MORICONI ', NULL, NULL, NULL, NULL),
(89, 'lazartede@gmail.com', '$2b$10$l33G9lW7Dv7mgFMk.ge60.Yq4LA4yI0HkUVPZzxuMmlGIBqJGaNQG', '2025-06-01 16:41:28', 'Dalma lazarte', NULL, NULL, NULL, NULL),
(90, 'estefiguimil@gmail.com', NULL, '2025-06-01 16:49:10', 'Estefania Guimil', '107141325564816549395', NULL, NULL, NULL),
(91, 'karinamunaretto@hotmail.com', '$2b$10$Ot9J6BlikB5n5K1Y737mE.Ppqy7ZnP8qJ/at8h5z1EpeSYMVubXkK', '2025-06-01 17:04:00', 'Karina Vanessa Munaretto ', NULL, NULL, NULL, NULL),
(92, 'flor.navarro.noeli@gmail.com', NULL, '2025-06-01 17:51:32', 'Florencia Navarro', '114425339642911243125', NULL, NULL, NULL),
(93, 'florsavini1983@gmail.com', '$2b$10$I6rvuTLahPW/YAzY56OcAOKnvFB39yvncfA3khw.JDYvulwv2nYhe', '2025-06-01 17:52:18', 'Maria florencia savini', NULL, NULL, NULL, NULL),
(94, 'romina.v.donatelli@gmail.com', '$2b$10$hR.Q7HrIFKJ9d1n7Qwmimu5IXAiQX5Ib/wAC66qV7y2BMIjSLm3nK', '2025-06-01 17:55:59', 'Romina ', NULL, NULL, NULL, NULL),
(95, 'donadio.emi@gmail.com', '$2b$10$winz8YBelwrFza4tM.d2l.DdvR26oaJyhg0zr6IRCxV611LFCbsRq', '2025-06-01 18:23:21', 'Emilia donadio', NULL, NULL, NULL, NULL),
(96, 'psic.flaviaromero@gmail.com', '$2b$10$epocsD6SS1c9EDzOEcM0c.04Bvwkb4o7W1dTeej4qSqQjs8EpPxHC', '2025-06-01 18:31:11', 'Flavia Romero ', NULL, NULL, NULL, NULL),
(97, 'mica.cascales97@gmail.com', NULL, '2025-06-01 18:55:38', 'Micaela Cascales', '117454611554107461578', NULL, NULL, NULL),
(98, 'maariaaemiliaa94@gmail.com', NULL, '2025-06-01 19:08:30', 'Emilia Pezzi', '112525733562690921175', NULL, NULL, NULL),
(99, 'jorgelinapp22@gmail.com', '$2b$10$STfC/Tp7BWjK9.r3ilxVpO4VKQNcI5RYwtVdCYj4a3RPVPK0JKK3S', '2025-06-01 19:22:43', 'Jorgelina peralta ', NULL, NULL, NULL, NULL),
(100, 'selenaaraceli00@gmail.com', '$2b$10$TnoqPjyrXx0E/HhSNYSMxeypI0/Eos4z.rc/dzTGGgcMBGjc3z0uK', '2025-06-01 19:42:07', 'Selena Ferra ', NULL, NULL, NULL, NULL),
(101, 'lucilama.96@hotmail.com', '$2b$10$m/Hbly30eCRdE94dGG50duZsRuQsdfyotsa0iDXowE9eWkOuorrLe', '2025-06-01 21:06:27', 'Lucila Merli Agazzi ', NULL, NULL, NULL, NULL),
(102, 'iarampeon@gmail.com', '$2b$10$6AGBgsl8LGou.F3u42FznOA0p.mAO7b6JdqNdfkQChfaPrQL2e80G', '2025-06-01 21:13:45', 'Iara Peón', NULL, NULL, NULL, NULL),
(103, 'haciendofoco.3108@gmail.com', '$2b$10$foj6Du3Gm4H1dQP0JaAj5egkFxTqCFUSsnH8MnOVkeGX9VoZJE1Y.', '2025-06-01 21:34:34', 'Paula Díaz ', NULL, NULL, NULL, NULL),
(104, 'morenaranieri18@gmail.com', '$2b$10$1iApJ4aEmaBa/e3EGwE7n.IPx1AutT.XKrMzPaRZag5.F3Oxb05EO', '2025-06-01 21:46:46', 'Morena Ranieri ', NULL, NULL, NULL, NULL),
(105, 'agustinajoanen@gmail.com', '$2b$10$MCJinO1x88VrJxVKnHik/.u.Cf7zJhyErT5kAXEOgJUN1JrfX6JCS', '2025-06-01 22:02:43', 'Agustina Joanen', NULL, NULL, NULL, NULL),
(106, 'julietaescudero22@gmail.com', '$2b$10$p/1kXFfTqJSOYEn8WV4v5Os5Ckg3Tl1njI2CjkZqNfacxcQWgA7oy', '2025-06-01 22:08:43', 'Julieta Escudero Perez ', NULL, NULL, NULL, NULL),
(107, 'kbiscayart05@gmail.com', '$2b$10$Zjfvkc/jQWdD6SAg0WfFI.xGpas7rVFLMQkT/x6j.wkz5s8NnkOt.', '2025-06-01 22:22:35', 'Carla biscayart ', NULL, NULL, NULL, NULL),
(108, 'yamilacn12@gmail.com', '$2b$10$hGjZyhvgF9hMcURnS5w8juTJUzksXSBS33n9LE/ULiyjLCIBe9xBW', '2025-06-01 22:30:46', 'Yamila corbalán', NULL, NULL, NULL, NULL),
(109, 'emiliadonlon2021@gmail.com', '$2b$10$MAMuDWipFRolcknuJr7IZOBCvlPCSdvtev9dhYTYrNVAi06FOznVS', '2025-06-01 22:46:08', 'laura manion', NULL, NULL, NULL, NULL),
(110, 'norlandella@gmail.com', '$2b$10$OBkvtPakIjWePFkVOEF.3.n21l04V0GZLRmKpbAK0jNwUsCEB0y2S', '2025-06-01 22:55:09', 'Nora orlandella ', NULL, NULL, NULL, NULL),
(111, 'carlyswaggy18@gmail.com', NULL, '2025-06-01 23:22:05', 'Carly Swaggy', '105646631839651232181', NULL, NULL, NULL),
(112, 'lourdesgiordanoo31@gmail.com', NULL, '2025-06-02 00:15:29', 'Lourdes Giordano Orquera', '115429067084093749363', NULL, NULL, NULL),
(113, 'cynbracamonte@gmail.com', '$2b$10$VTsJkRjrhjH6IvCvtL9GjuZE2.LLMmMDhHw0vXk5dzp4K8VJgHqUS', '2025-06-02 00:17:53', 'Bracamonte Cynthia ', NULL, NULL, NULL, NULL),
(114, 'mariabelen_g@yahoo.com.ar', '$2b$10$r8v0r32/ljj6O8PpsDWFUuOdFqeLlxKX4aywcG/JLoeR5GdRhlv9S', '2025-06-02 00:24:12', 'María Belén González ', NULL, NULL, NULL, NULL),
(115, 'rominacano57@gmail.com', NULL, '2025-06-02 00:24:31', 'Romina Cano', '107795030290508606073', NULL, NULL, NULL),
(116, 'lauracastillo66@gmail.com', '$2b$10$cKfMioYy/A9DJ9LIHJPhQuOBO4myW.XQ1E/NWEFwiWQaQgJ4jOTOO', '2025-06-02 00:37:25', 'Laura', NULL, NULL, NULL, NULL),
(117, 'miranda.musumano@gmail.com', NULL, '2025-06-02 00:54:03', 'María Luz Miranda', '105166229497608916248', NULL, NULL, NULL),
(118, 'burns2ashes@gmail.com', '$2b$10$yLXwjtZjsASTK7U/bdlX7.oerPzrsTB1sxdeiejnkFLmUITNuKqAG', '2025-06-02 01:26:01', 'Ayelen rey', NULL, NULL, NULL, NULL),
(119, 'ritafasolino@gmail.com', NULL, '2025-06-02 02:37:12', 'Rita Fasolino', '115199974934774310629', NULL, NULL, NULL),
(120, 'rollin.alberti@gmail.com', NULL, '2025-06-02 02:42:49', 'Rollin at 420', '110499657514485760198', NULL, NULL, NULL),
(121, 'villegasbrenda114@gmail.com', '$2b$10$zvikdtgqqv6XRscVVRRKJ.e960wu5lAI2/ZU4ltK6D.TQldz2R8m.', '2025-06-02 03:03:10', 'Brenda Villegas ', NULL, NULL, NULL, NULL),
(122, 'succo90silvina@gmail.com', '$2b$10$ASHI7ttYa5cCUvMPdI8MPuWnjllF0KvUcC/fIaRUZVdP3bQWadkLe', '2025-06-02 03:09:45', 'Silvina succo ', NULL, NULL, NULL, NULL),
(123, 'natiicirino@gmail.com', '$2b$10$ugxO2KCFqoBhrmCu1Gg2Q.Xibba51iazDnIVrFFRkaUf/m90EKVL2', '2025-06-02 03:16:49', 'Natalia cirino ', NULL, NULL, NULL, NULL),
(124, 'mcgallegoba@gmail.com', NULL, '2025-06-02 04:15:31', 'Maria Clara Gallego', '105534193322467492089', NULL, NULL, NULL),
(125, 'fernandezbrenda059@gmail.com', '$2b$10$y2OYxbUNJ57d7NJq/aI1/uH/fSyejrmiRbBtlteDqxywbt0Mewpv2', '2025-06-02 04:43:13', 'Brenda Lisset Fernández ', NULL, NULL, NULL, NULL),
(126, 'joha4952diaz@gmail.com', NULL, '2025-06-02 04:49:40', 'Johanna Díaz', '111259971695720323183', NULL, NULL, NULL),
(127, 'sofi93g@gmail.com', '$2b$10$QqnVfMGUd12LMMgAVsnJxOi/Dcu.ya1bpRkrR8.TWC.4LZgke78nO', '2025-06-02 09:30:43', 'Sofia Gimenez ', NULL, NULL, NULL, NULL),
(128, 'baulegui9@gmail.com', NULL, '2025-06-02 13:19:03', 'Luciano Leguizamón', '102341867941252145363', NULL, NULL, NULL),
(129, 'ferchumesposito@gmail.com', NULL, '2025-06-02 13:29:35', 'Ferchu', '107725667305548917641', NULL, NULL, NULL),
(130, 'noelia.moreyra@bue.edu.ar', '$2b$10$bLP4habIJEVTG03jxiJeOOlOYk4jjVqMouG2vWLvDNoFNKq8fPQl2', '2025-06-02 13:34:37', 'Noelia Moreyra', NULL, NULL, NULL, NULL),
(131, 'lunajulietabrito@gmail.com', '$2b$10$3w.E4DygpM6k9f0.BnBbeuMj.VrWssBW8QEip6fxh7avod4.TyNL.', '2025-06-02 16:28:19', 'Diana ramirez ', NULL, NULL, NULL, NULL),
(132, 'abelen.n90@gmail.com', '$2b$10$QXFcewLkq87u4aIzah2vgeCMViikak6wvoTLgQg3xllLp1OUUAYje', '2025-06-02 20:49:28', 'Ana Belén Nuñez', NULL, NULL, NULL, NULL),
(133, 'espinozailianavirginia@gmail.com', NULL, '2025-06-03 00:04:12', 'Iliana Virginia Espinoza', '104928598511618944474', NULL, NULL, NULL),
(134, 'maruland87@gmail.com', '$2b$10$YxIUpa.6VUg8A0HgHsmEeeQOe8iemWkn5i5ksv8Vo.mBT/kvxBDr6', '2025-06-03 11:15:35', 'Mariel Lamberto ', NULL, NULL, NULL, '+5491168489496'),
(135, 'villarroeljessi@icloud.com', '$2b$10$j/mweGEd0LmJOvgvRPRPH.fxwAS2JmY3lpew9tI5flhjXHfw78iSq', '2025-06-03 12:16:55', 'Jessica villarroel', NULL, NULL, NULL, '11 3386-7948'),
(136, 'tresestrellas_70@hotmail.com.ar', '$2b$10$uzv/DSa0vpY.IzcChWZam.oSjognKH59XlQZxcNeRJohqM6BqIE2i', '2025-06-03 23:35:34', 'Patricia ferrero', NULL, NULL, NULL, '1133403638'),
(137, 'cmoralesmotte@gmail.com', '$2b$10$zlhf5XsdyM4nKSIdMI28i.kLqa6FYnRHJvV.k3AEyO0xW0CUPxpgC', '2025-06-04 18:44:32', 'Camila morales', NULL, NULL, NULL, '1137570878'),
(138, 'natalianazarenaceag@gmail.com', NULL, '2025-06-07 05:37:15', 'Natu Cea', '117978061078247332062', NULL, NULL, NULL),
(139, 'm.caputto@live.com.ar', '$2b$10$.kQuKOsFBNhRGzabDAoSqO5aULKCDT8oKFMRv68tmN0LmnB7PUKcm', '2025-06-10 21:28:08', 'Martina caputto ', NULL, NULL, NULL, '1161793678'),
(140, 'brisaferreyrautn@gmail.com', '$2b$10$uOzcWS9EW.GaVvvf6tNA1O1/VPftQfXM9mxPXi54s8GRxiNMyu7Q2', '2025-06-11 03:30:54', 'brisa ferreyra ', NULL, NULL, NULL, '3472641929'),
(141, 'juli.p93@gmail.com', '$2b$10$k8pB7nEl2lfAlU3uZgxbUupDyfxanMLaVf6.HmoSGAzw1LV0W7M7K', '2025-06-11 08:18:43', 'Julieta Ines Ponce', NULL, NULL, NULL, '+543804232538'),
(142, 'irinappetersen@gmail.com', NULL, '2025-06-11 10:41:55', 'Irina Petersen', '108408959119860118599', NULL, NULL, NULL),
(143, 'leitesnatalia@hotmail.com', '$2b$10$DmYvfVeHydEW0e0DICOV7uVq71h0iBbgJ5L./1toaYrD1BSApEUx.', '2025-06-11 11:24:59', 'Leites natalia', NULL, NULL, NULL, '+542216074041'),
(144, 'luciano_laborde@hotmail.com', '$2b$10$7nNE4VJQy3WHIVtJ.MniTe3tP7NpTR83ArpzZ.j92HxIcelwZDU52', '2025-06-11 12:35:06', 'Luciano Agustín Laborde', NULL, NULL, NULL, '1163064988'),
(145, 'yvleiva@gmail.com', '$2b$10$x.jU8BLkxv2/BYSZjMvRyepLBd0IfE6DbkOfsF1x.ktQZC//YxjxG', '2025-06-11 13:44:38', 'Yolanda Leiva ', NULL, NULL, NULL, '2923438505'),
(146, 'melisa.velazquez1993@gmail.com', NULL, '2025-06-11 15:58:56', 'Melisa Velázquez', '106182005558520281214', NULL, NULL, NULL),
(147, 'colquedaiana9@gmail.com', NULL, '2025-06-11 19:44:21', 'Daiana Colque', '109362493994962938150', NULL, NULL, NULL),
(148, 'paulaluque97@gmail.com', '$2b$10$WGRTH.JWvoTeDLF4s6j1JeVoY4prwp23VabQWTMQiXMF56veLHOGO', '2025-06-12 17:36:05', 'Paula Luque', NULL, NULL, NULL, '1134514034'),
(150, 'rominabruno587@gmail.com', NULL, '2025-06-16 18:08:55', 'Romina Bruno', '115689289356480953973', NULL, NULL, NULL),
(151, 'memilcesilva@gmail.com', '$2b$10$mVuhc0HZ/ylqE1QGHP1mN.InP9mAm8cQyAYJVMcfVzWQvtIgfjYaK', '2025-06-16 22:19:34', 'EMILCE Silva ', NULL, NULL, NULL, '2616626285'),
(152, 'ochovaleonardo@gmail.com', NULL, '2025-06-17 14:20:38', 'Leonardo Ochova', '113788581914097569422', NULL, NULL, NULL),
(153, 'betrendystyle@gmail.com', '$2b$10$56sILM1jzu.2/RuAhsheseS8Lih8iytpZaS5dkp4YnlLHI7HpTKH6', '2025-06-18 01:03:43', 'Romina Paez', NULL, NULL, NULL, '2236007765'),
(154, 'betrendystyle01@gmail.com', '$2b$10$0ozv6pQ9SGRwT2/NvmmeV.3qMySUiOxnnivZn.f5WZE4Xth.RyYXG', '2025-06-18 01:07:11', 'Romina Paez', NULL, NULL, NULL, '2236007765'),
(155, 'camilaalbiaque@gmail.com', NULL, '2025-06-18 02:45:03', 'Camila Albiaque', '112164820687396415143', NULL, NULL, NULL),
(156, 'dry2602@hotmail.com', '$2b$10$edwsJjoS2lGSK8Mw19uN9OUBA85tdklDGQArCzKAKUwY6Qy0UuUhi', '2025-06-19 02:40:29', 'Adriana Gomez ', NULL, NULL, NULL, '2241692202'),
(157, 'yaya.casella@gmail.com', '$2b$10$UpT8n2rsHERV6t01mCJHP.VxBdyQQOqpxNzFYyLkvqM5uCKLcsCK.', '2025-06-19 15:55:38', 'Yanina Casella ', NULL, NULL, NULL, '1126572060'),
(158, 'lic.prof.agustinapena@gmail.com', '$2b$10$pX3sCa9L14HzaUgJgaO7puxApROdZkTaU8qTSSttOlwoI6UELrgqq', '2025-06-19 16:46:34', 'Agustina Peña', NULL, NULL, NULL, '+34615497559'),
(159, 'er367793@gmail.com', '$2b$10$SujoI.BT/fd.4fIuXL3Eze3diB4iCGhodhFh0gtxsPdK08Hk2qLJC', '2025-06-19 19:04:22', 'erika rodriguez', NULL, NULL, NULL, '1158423024'),
(160, 'belenmorinigo@outlook.com', '$2b$10$PQY7ucyN3IX/buhDpSd/nOnJHQCshkZRbIUCGYV6kk/UoEz0JSCIO', '2025-06-19 19:34:42', 'Belen Morinigo ', NULL, NULL, NULL, '1130179033'),
(161, 'noelia-granado@hotmail.com', '$2b$10$Boj0OrPI50Bu13Dbx03CkOUlOnln.O5EGo9uNqyvavI6zR6odqnsi', '2025-06-20 14:05:14', 'Noelia Granado ', NULL, NULL, NULL, '2494636782'),
(162, 'noelarcusin@gmail.com', '$2b$10$bVeySJSDNYp.px8GeUcnce8mUdCBMb5ihl6ou6fA4G/ZLPjCLvtUG', '2025-06-20 14:15:35', 'Noel Arcusin', NULL, NULL, NULL, '3516714757'),
(163, 'sarumartinez19@gmail.com', NULL, '2025-06-20 14:18:12', 'Sara Martinez', '108936315252747996765', NULL, NULL, NULL),
(164, 'graciaanacarolina@gmail.com', NULL, '2025-06-23 17:29:10', 'Ana Carolina Gracia', '113403866234388390368', NULL, NULL, NULL),
(165, 'estefaniayamel@gmail.com', '$2b$10$YKv4DMNUbc/trvz0v7SPseE6tZ9bP5DVB71Z40hl0Hdx53ytsDNVq', '2025-06-25 19:26:58', 'Estefanía reboredo', NULL, NULL, NULL, '1169189895'),
(166, 'fernandamontessano@hotmail.com', '$2b$10$JdmXtuUaKl7ReRIgurpt4.zm5570coQ.VD24FmHAXm5W2xH9jtvhm', '2025-07-01 03:32:43', 'Fernanda Montessano ', NULL, NULL, NULL, '01140886553'),
(167, 'catalinadupuy689@gmail.com', '$2b$10$p35UXnggMdeBK3EW6L8OS.ld57HfhpK8juB5SwB19YOa200nR7xty', '2025-07-06 21:25:33', 'catalina dupuy', NULL, NULL, NULL, '2346 59-7532'),
(168, 'ivitzlucia@gmail.com', '$2b$10$Otd0OTw2V4oM1kmHTXaXUOp4DnA.42irvQ8LI9tJTs0aLNfTMPhae', '2025-07-06 21:25:39', 'Lucia Ivitz ', NULL, NULL, NULL, '1170069425'),
(169, 'mllantada.07@gmail.com', '$2b$10$8R3W01wn7JZppMoxOR//QO0iz5wsZByTQxOdYqURqE/MnRMXZNggS', '2025-07-06 21:27:47', 'Milagros Llantada ', NULL, NULL, NULL, '2494511508'),
(171, 'romycata84@gmail.com', NULL, '2025-07-06 21:28:38', 'Romina Vazquez', '102970299357614923520', NULL, NULL, NULL),
(172, 'donosoaracelli@gmail.com', '$2b$10$4r66WCcwz2JAxnGyaQTKUuOCzU4wA1F/bj.R2KMJasfp86JSLbHLK', '2025-07-06 21:29:24', 'Aracelli', NULL, NULL, NULL, '2974948602'),
(173, 'verolore_2003@hotmail.com', '$2b$10$/r1EFaAsknxCFjFK0bb5yeNa9..6anRqMWzXvaP0/f/Y4Lu99JX.2', '2025-07-06 21:33:30', 'Veronica Avila', NULL, NULL, NULL, '3874068972'),
(174, 'rochustrazzoni@gmail.com', NULL, '2025-07-06 21:35:32', 'Rocio Strazzoni', '101107895558317052952', NULL, NULL, NULL),
(175, 'maruchaa123@gmail.com', '$2b$10$2U9QA7TrBAKWSbNwnoZ4x.4R04w8bg8OBkIyZ9Iovm8WovPOs79q2', '2025-07-06 21:38:32', 'Mariana Perucca', NULL, NULL, NULL, '2392637007'),
(176, 'luucilaaguilar@hotmail.com', '$2b$10$ZEs60ujWCoyj07hup9MpOeN3WshJajuwXsMYwlHVD/dLjfMpXv6Vi', '2025-07-06 21:38:59', 'Lucila aguilar', NULL, NULL, NULL, '1151052922'),
(177, 'yamilesm13@gmail.com', '$2b$10$MhZk1jYFyIE8fXlvoTKgf.gfC/KVXTBq3yCzTzzlyOJTOR6fz9J3S', '2025-07-06 21:40:02', 'Yamile Sanchez ', NULL, NULL, NULL, '3835435609'),
(178, 'sofiverhaz@gmail.com', '$2b$10$t3Q6oSkBM2q8hBlGY31pi.Dri2VFYSZt5eHDvM30E7JZ3PppTPUB2', '2025-07-06 21:42:56', 'Sofia Verhaz ', NULL, NULL, NULL, '1136263421'),
(179, 'afvillage@gmail.com', '$2b$10$a.Obdw2z8SBvet7haLyr.eGIT6Y9rsQ02.XnAC3JEyd3V.wav7.va', '2025-07-06 21:43:07', 'Agustin Villafañe', NULL, NULL, NULL, '1157409605'),
(180, 'micalemachado94@gmail.com', NULL, '2025-07-06 21:51:21', 'Micaela Machado', '117659442928213004059', NULL, NULL, NULL),
(181, 'alfagemeeugenia@gmail.com', '$2b$10$UOFo3HE6J73q.EXvRK4Dj.T22fxiS2EhMlRDtj5nnK0tUxic9/DRi', '2025-07-06 21:53:05', 'Eugenia Alfageme', NULL, NULL, NULL, '3388439963'),
(182, 'alfagemeeugenia@gmail.con', '$2b$10$iFY.Q6Yn2b2oydnqz5nKn.v.d3tIqx7IQMRDWAWbc8LIHhv.Zd1UG', '2025-07-06 21:55:30', 'Eugenia Alfageme ', NULL, NULL, NULL, '3388439963'),
(183, 'flavia.giordano93@hotmail.com', '$2b$10$l753pzbz89lmTPv3BaeSNeFSZu5y.1iO/17g1ihNKV19AoMLTgCC6', '2025-07-06 21:56:50', 'Flavia giordano', NULL, NULL, NULL, '1161886841'),
(184, 'bloisemelinas@gmail.com', NULL, '2025-07-06 21:57:28', 'Melina Soledad Bloise', '110597967506434166555', NULL, NULL, NULL),
(185, 'jcapart@live.com.ar', '$2b$10$ON3Crhew/bHfhUYh3akefOMyDEolJ8xUIaKDATaZ9w7kwOC9P4Zxa', '2025-07-06 21:58:47', 'Julieta Capart ', NULL, NULL, NULL, '1136253563'),
(186, 'aylenabelera@outlook.com.ar', '$2b$10$JEi8yOfid3UJhHekQYciU.gbW09ZoKp.pFMiz4xpadqqLvJWDutdC', '2025-07-06 21:59:19', 'Aylen Flores', NULL, NULL, NULL, '3884553000'),
(187, 'duarteestefania99@gmail.com', NULL, '2025-07-06 22:01:43', 'Estefania Duarte', '103058716986705258734', NULL, NULL, NULL),
(188, 'ananichlison@gmail.com', '$2b$10$kkaOr7Ijuh1KImSaFUiUveXuO/89BJC3kNKCEREaVrk1wZdskF5uq', '2025-07-06 22:21:03', 'Ana Laura Nichlison ', NULL, NULL, NULL, '1166711002'),
(189, 'claudiafunes1@hotmail.com', '$2b$10$iAD.n9urSIncZ9jysM.bOu/1kYiGBEBCDquvFXMSLGu11IbE38JFm', '2025-07-06 22:21:17', 'Claudia Funes', NULL, NULL, NULL, '+541165419695'),
(190, 'lucina.lavayen@gmail.com', NULL, '2025-07-06 22:25:47', 'Lucina lavayen', '110226794759637913120', NULL, NULL, NULL),
(191, 'damariscorrea33@gmail.com', '$2b$10$IggzftPN7gbILomoD4MxuOiXM.gsKyISDcFOt3qRzBFme.L3yMq6O', '2025-07-06 22:35:36', 'Damaris ailen correa ', NULL, NULL, NULL, '01123299355'),
(192, 'delfidopazo@hotmail.com', '$2b$10$chOf4Jfzhj/OeM3mX43lKu8Mgpul82FfuAvWutzXEO73lBvXNUWtq', '2025-07-06 22:40:19', 'Delfina Dopazo', NULL, NULL, NULL, '1163732331'),
(193, 'tamiecheevarria@gmail.com', '$2b$10$vf4GwULkjLhW39xHKWtxv.mfKotWIDXuMtbL6EQYNU/BXMaoqC.5.', '2025-07-06 22:44:24', 'Tamara Echevarria ', NULL, NULL, NULL, '3498435605'),
(194, 'rosanalemos987@gmail.com', '$2b$10$BE1Cyf0umK0MIUsw1vIzkOEvIrjbEppLJDI/OptDibr/5H0au/Ilm', '2025-07-06 22:46:50', 'Rosana Lemos ', NULL, NULL, NULL, '+541128313130'),
(195, 'yamila.canete2017@gmail.com', '$2b$10$UiU9O10e.vZp1N.9Z3cAjeRcF0/x7JF0Lnuwh3Q270agVCpXvV7oC', '2025-07-06 22:50:15', 'Yamila Cañete', NULL, NULL, NULL, '605787739'),
(196, 'guadalupelujancenteno@gmail.com', '$2b$10$MVgtsNGQl.RO/O2NBULOrexPqOCxe7RZw8LLKkdmUskTlMd35M3PC', '2025-07-06 22:57:23', 'Guadalupe Centeno', NULL, NULL, NULL, '01131690339'),
(197, 'tobioayelen@hotmail.com', '$2b$10$7i0WLdkXC3dk8VL8PlcFLOI1khJV/FG8hEFf0C9WDlQI2Z1uOwRCK', '2025-07-06 22:58:29', 'Ayelen tobio', NULL, NULL, NULL, '1134620635'),
(198, 'astridmaldonado28@gmail.com', '$2b$10$Ur2YSNJsmwGoSdaATboeXup3WRFDiBZ2wUyyY6jAXZFK2aIPpi2Sq', '2025-07-06 22:58:30', 'Astrid maldonado', NULL, NULL, NULL, '11 5902-9183'),
(199, 'valeypedro22@hotmail.com', '$2b$10$eJCBBApnvRtZajKkdxXSRe8ihd92AQPFPscrMRinX7J6BRjMX5fzm', '2025-07-06 23:08:02', 'Valeria Frers', NULL, NULL, NULL, '1141700502'),
(200, 'gisela.sparacino@gmail.com', NULL, '2025-07-06 23:15:35', 'Gisela Sparacino', '103786775693772876746', NULL, NULL, NULL),
(201, 'amestoymayra718@gmail.com', '$2b$10$n.MSP74MWz26IZwcvDRzgezOLDvv8Hk/cHHgcvsEjdXpZzzaptSVm', '2025-07-06 23:21:27', 'Mayra amestoy', NULL, NULL, NULL, '(+549) 2920271009'),
(203, 'valgutierrez27@gmail.com', NULL, '2025-07-06 23:21:51', 'Valentina Gutierrez', '104511675751019645951', NULL, NULL, NULL),
(204, 'noelia.incarbone@gmail.com', NULL, '2025-07-06 23:22:52', 'Noelia Incarbone', '112101881744235373041', NULL, NULL, NULL),
(205, 'mestefi@gmail.com', NULL, '2025-07-06 23:31:52', 'TEFF O', '110767510782439090474', NULL, NULL, NULL),
(206, 'dora_orellana80@hotmail.com', '$2b$10$HhFWgtp.aAsppi0FJqAts.yIC78ZTjR2cP0S16BELoj68/LMGJ9Ra', '2025-07-06 23:37:05', 'Dora orellana', NULL, NULL, NULL, '1141671748'),
(207, 'araujo.flor.810@gmail.com', '$2b$10$LR10B1E5CIWfLGBqfbXED.pJfjDqaAJbQEkOV32W1oY.ILVrnZfRS', '2025-07-06 23:39:56', 'María Florencia Araujo ', NULL, NULL, NULL, '+393447971778'),
(208, 'valeriaveron95@gmail.com', NULL, '2025-07-06 23:48:57', 'Valeria Alejandra Veron', '100544969180728610565', NULL, NULL, NULL),
(209, 't.majo94@gmail.com', NULL, '2025-07-06 23:52:52', 'María José Tourn', '109355997819320940798', NULL, NULL, NULL),
(210, 'sabrinasastre20@gmail.com', '$2b$10$9r5fhsP2RFgbTSzLNt2EfOtPPw98LfJsY9vwoDoBj0ZlxMepHQkk.', '2025-07-06 23:53:55', 'Sabrina sastre ', NULL, NULL, NULL, '541133252243'),
(211, 'yess_pety@hotmail.com', '$2b$10$gjeGQmlKgKLyfbiMg4R4yuZ2DhVyWuucmsD09BtV27jIwb0lgX5H.', '2025-07-07 00:06:04', 'Jessica sanguina ', NULL, NULL, NULL, '1135703012'),
(212, 'maleebritos@gmail.com', '$2b$10$vtHUmnrQfO2Yida/.vRxROVy23JhI2C5XlQAQuHjQMOq7d4BzL3Hi', '2025-07-07 00:14:35', 'Malen Britos ', NULL, NULL, NULL, '2995340195'),
(213, 'barbygranados15@gmail.com', NULL, '2025-07-07 00:20:54', 'Barby Granados', '104629663172295371423', NULL, NULL, NULL),
(214, 'lsoledadmir@gmail.com', NULL, '2025-07-07 00:26:29', 'Soledad Mir', '108740113207703316858', NULL, NULL, NULL),
(215, 'melani_leylen@outlook.com', '$2b$10$p0LQ.9xlaCwMio3Xb9BWMuBi0imS5gij3MqcA3gc48SC..NGw9r/y', '2025-07-07 00:29:31', 'Melani Leylen Moreno', NULL, NULL, NULL, '3804364633'),
(216, 'romeromaranazarena@gmail.com', NULL, '2025-07-07 00:33:12', 'Mara Romero', '100761586027731325750', NULL, NULL, NULL),
(217, 'ajairedin@gmail.com', '$2b$10$yOnZO.cZ1lVkN.wHF516ru73a/xuYy5/r9iqsC61o7LjLRYRdmZza', '2025-07-07 00:44:04', 'Abril jairedin', NULL, NULL, NULL, '3515638284'),
(218, 'ngattas@gmail.com', '$2b$10$mTkT4k.QzURDep2q7W5wRO1I4pMc1RSFn2SWk3c.Q0RKMBnXbIDfa', '2025-07-07 00:51:20', 'Noelia ', NULL, NULL, NULL, '+541162159810'),
(219, 'luciamuller1212@gmail.com', '$2b$10$3VQZf8oeEVzCwBHGqV7/X.I/2DIh31ibePAg5vmUiAFkwFA3BR5Cu', '2025-07-07 00:55:25', 'Lucia muller', NULL, NULL, NULL, '+5491121750908'),
(220, 'bellomerocio@gmail.com', '$2b$10$Um32wpLjDIvMaH15CWuKheWMcS2Vdo0vwstA8HyyhjW3BwJJePGhK', '2025-07-07 00:59:17', 'Rocio Bellome', NULL, NULL, NULL, '1138897915'),
(221, 'edi_nd@hotmail.com', '$2b$10$5.eiBPpXjpDI5/aMIqgJ.uU4.dOF3G6BIGVSWFJT6H0h6l6QlY8sG', '2025-07-07 01:02:08', 'Natalia dealascio', NULL, NULL, NULL, '+543489303061'),
(222, 'belsantarelli@gmail.com', '$2b$10$7dcFuFReyx9VfKAIF.IOAutsjNVMeM1I7JME5TIvofqTBkXsKGHMe', '2025-07-07 01:02:23', 'Belen Luciana Santarelli', NULL, NULL, NULL, '1141618756'),
(223, 'carolinaoltraba@gmail.com', '$2b$10$dbiOJiBpONkLqzY3VZcwYeHdGv0Yj.MuzkUVN/IRKBekI.LSJv.Di', '2025-07-07 01:25:37', 'Carolina oltra', NULL, NULL, NULL, '+5491159774112'),
(224, 'jacqui.taty@gmail.com', '$2b$10$k8QkK2LMJPpIDn9BUdpfP.oX3ucX7kcljuOIHQCg7cgWInZP4Omba', '2025-07-07 01:27:43', 'Jacqueline perez', NULL, NULL, NULL, '1133539434'),
(225, 'santosgabrielanoemi@gmail.com', '$2b$10$1LMywRoYcgjd8jGY04319eko53CkHS7djWJykqsyCkz1dP248FukG', '2025-07-07 01:28:35', 'Gabriela Santos ', NULL, NULL, NULL, '1140634489'),
(226, 'angirubio.v@gmail.com', '$2b$10$fusRp22UMlSmf2uGitZXnex2.rWl11RJXLwzNtQrDLrB21iWXNl8u', '2025-07-07 01:32:28', 'Angela Rubio', NULL, NULL, NULL, '3516328052'),
(227, 'carlaarojo@gmail.com', '$2b$10$Xa8Fro434uV0t/YUvn3d5O/gyV5Wl9Nz8yWSLPAhlfN2aJn5XAI76', '2025-07-07 01:43:16', 'Carla Rojo', NULL, NULL, NULL, '2604607461'),
(228, 'romifernandez86@gmail.com', '$2b$10$HAWgHG7EKAWCQhPu2BeOWu40d79kGz..O/HFSoG7Ie6/ySC/AWobS', '2025-07-07 01:53:37', 'Romina Fernandez', NULL, NULL, NULL, '1165827191'),
(229, 'antonella.dalfi@gmail.com', '$2b$10$E8st5pe/7W05QAeuU2EM4edGa87QlKgWs3wbpg8LmmjUjgdJW0s5W', '2025-07-07 01:59:12', 'Antonella Dalfi Tanzi', NULL, NULL, NULL, '2216051250'),
(230, 'luaranda2015@gmail.com', '$2b$10$.ifD3zAbDICe470IUzheOuEUb7vDIwJzj62RxAtyxtqEUQPF7.o8m', '2025-07-07 02:09:52', 'Malena Garay', NULL, NULL, NULL, '+54 (11) 2291-2742'),
(231, 'florenciafirpoalday@hotmail.com', '$2b$10$tt82IrD4fgMhE8nXqjEFD.BvVJgo1eLMwUd72H4QlEi2e.ZH.Nb4i', '2025-07-07 02:20:33', 'Florencia ', NULL, NULL, NULL, '3436413103'),
(232, 'silvanalorenafa@gmail.com', '$2b$10$jBpfn4VAuu53NLzzwZ/j3.CNkuKZ3Gm.o0YuzyMpOJ5UgZZ1WWai6', '2025-07-07 02:23:18', 'Silvana Lorena Fariña', NULL, NULL, NULL, '1160328290'),
(233, 'lanaromicaela2@gmail.com', '$2b$10$tfAaetQPR4U.RT3fuiKGkuduENc6KcwPzxtLU5XfT4tyhyFzPvbdC', '2025-07-07 02:23:18', 'Micaela lanaro', NULL, NULL, NULL, '+5492914264137'),
(236, 'flor.ruizph@gmail.com', '$2b$10$E6g2sgrPPZSg0I25253GxeO.LGTA4MLY.2XTcz9FLH73X.s8lWEMm', '2025-07-07 02:39:26', 'Florencia Ruiz', NULL, NULL, NULL, '11 3512-9961'),
(237, 'solanamariacuomo@gmail.com', NULL, '2025-07-07 02:45:28', 'Sol Cuomo', '116773443936962059086', NULL, NULL, NULL),
(238, 'roy_lif@hotmail.com', '$2b$10$BMeZlCOWLdavnDvqe3dOwu1TNC800nx89pOX5LXSQYkcgMbGoMkGO', '2025-07-07 02:45:53', 'Romina Lifrieri ', NULL, '3af62a78e1ebed6a8120cd616cde814f791a6eca1c7b5d886466815eb35cffa5', 1751860035560, '2323333301'),
(239, 'antonelladaneri@hotmail.com', '$2b$10$1iDBd4enkIR1E8FAGlhlE.ok/MRoQdNkqjrncY5HxCwvpeLswgk9y', '2025-07-07 02:48:36', 'Antonella Daneri ', NULL, NULL, NULL, '1121753637'),
(240, 'julietabochatey@hotmail.com', '$2b$10$KgsetiLH4nwCILTnO1imc.J8tVcpxFHNBRstsKwnNMHNawgBAmLGq', '2025-07-07 02:56:40', 'Julieta ', NULL, NULL, NULL, '2976215502'),
(241, 'anapadini27@gmail.com', '$2b$10$XeqF6LKX9gpfb.Otu/0HAetSxluLtcu/RJDn297OJX0P8I8ZQ/Uo6', '2025-07-07 03:10:12', 'Nadia Anabella Padini', NULL, NULL, NULL, '+5493734480915'),
(242, 'daiana_schvartz@yahoo.com.ar', '$2b$10$dt/vWKxX3QTh40IG30fWVuyQniW0OQRe8ENJ2sQ8cPxL6OZOhP0DG', '2025-07-07 03:18:28', 'Daiana Schvartz', NULL, NULL, NULL, '1136875163'),
(243, 'rociopianca@gmail.com', '$2b$10$jrQcWkno8D/1SpPcWU..vun1CCAO8fBzhI3oKA0lDlCuoH8l43s76', '2025-07-07 03:22:03', 'Rocío ', NULL, NULL, NULL, '+5491167339188'),
(244, 'martinezene07@gmail.com', '$2b$10$jICT2FXP9RxZIky8rk/tqeDUlpx38WvDHLNqEn2m1OUP4xXVxnHSO', '2025-07-07 03:29:54', 'Adriana Eugenia Martínez ', NULL, NULL, NULL, '1522468648'),
(245, 'assennato12@gmail.com', '$2b$10$ZwPbjdr/WHISurkPRlLZHe.P/KoH7lM5lI.APCCft747Da2ezwc6e', '2025-07-07 03:58:42', 'Dalila assennato ', NULL, NULL, NULL, '1168033899'),
(246, 'yohaaguer@gmail.com', NULL, '2025-07-07 04:44:14', 'Yohana Aguero', '109126954755751720027', NULL, NULL, NULL),
(247, 'danieladamico24@gmail.com', '$2b$10$6oSTIwAMXgcFVx93t0PHfeCkGAQJqA3/GCBYXq1XmkX5tQVpg8oSy', '2025-07-07 05:29:41', 'Daniela D amico', NULL, NULL, NULL, '1156992037'),
(248, 'priscifaleschini@gmail.com', '$2b$10$oX/20HKSbmHEsxhtlVlxseE26XUgb/Gi3IZ3HMm1EhYhA7PUjpBgq', '2025-07-07 05:50:24', 'Faleschini Priscila', NULL, NULL, NULL, '3543624180'),
(249, 'tamiirodriguez16@gmail.com', '$2b$10$/MopfaWyeW6J047jc9cgZ.YyQi1eGqW3zEy5DlLoejwPQGii4yNvi', '2025-07-07 06:16:56', 'Tamara Rodríguez ', NULL, NULL, NULL, '2364663602'),
(250, 'dmartinezbulfaro@gmail.com', NULL, '2025-07-07 06:25:27', 'Dolores Martínez Búlfaro', '102045071510902615305', NULL, NULL, NULL),
(251, 'delmasayelen@gmail.com', '$2b$10$cd3qJAAv0X4UWU/jZE2jjOBANFv1R47ylIpCEw0.Zfmx7oi0pozqa', '2025-07-07 06:34:06', 'Ayelen Delmas ', NULL, NULL, NULL, '+543546417294'),
(252, 'maradx97@gmail.com', NULL, '2025-07-07 07:19:29', 'Mar DDM', '102582087927990797755', NULL, NULL, NULL),
(253, 'valinotitiziana1@gmail.com', '$2b$10$F4X/V7ccP2bcno5UHR07Zuw4uUxUZi9C7aO7nS2.BrwBqhZ6X8l1S', '2025-07-07 10:18:36', 'Tiziana Valinoti', NULL, NULL, NULL, '2317403262'),
(254, 'giselachor@hotmail.com', '$2b$10$iEtL24C4xkGcHMX4Z.DRPuLksVao19lYa76FUCuVdW0dHGQUi89dW', '2025-07-07 10:19:54', 'Gisela Choren ', NULL, NULL, NULL, '11 5491-7625'),
(255, 'daiprana@gmail.com', NULL, '2025-07-07 11:48:38', 'Daiana Kazanski', '100338306065656512527', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD PRIMARY KEY (`id_ausencia`),
  ADD KEY `fk_ausencias_profesional` (`id_profesional`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `cupones`
--
ALTER TABLE `cupones`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `cupones_usados`
--
ALTER TABLE `cupones_usados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unico_usuario_cupon` (`id_usuario`,`codigo_cupon`);

--
-- Indices de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD PRIMARY KEY (`id_disponibilidad`),
  ADD KEY `id_profesional` (`id_profesional`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id_mensaje`),
  ADD KEY `id_chat` (`id_chat`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_mensaje` (`id_mensaje`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `id_transaccion` (`id_transaccion`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD UNIQUE KEY `correo_electronico` (`correo_electronico`),
  ADD UNIQUE KEY `cbu` (`cbu`);

--
-- Indices de la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD PRIMARY KEY (`id_profesional`,`id_especialidad`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `tokens_temporales`
--
ALTER TABLE `tokens_temporales`
  ADD PRIMARY KEY (`booking_token`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

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
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ausencias`
--
ALTER TABLE `ausencias`
  MODIFY `id_ausencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `cupones_usados`
--
ALTER TABLE `cupones_usados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=397;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ausencias`
--
ALTER TABLE `ausencias`
  ADD CONSTRAINT `fk_ausencias_profesional` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`);

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `cupones_usados`
--
ALTER TABLE `cupones_usados`
  ADD CONSTRAINT `cupones_usados_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  ADD CONSTRAINT `disponibilidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chats` (`id_chat`);

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `notificaciones_ibfk_3` FOREIGN KEY (`id_mensaje`) REFERENCES `mensajes` (`id_mensaje`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
