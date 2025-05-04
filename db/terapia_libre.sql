-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-05-2025 a las 18:54:22
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
(40, 73, 1.00, 'MercadoPago', 'Pagado', '109036097773', '2025-04-25 15:55:08'),
(41, 74, 1.00, 'MercadoPago', 'Pagado', '109036591865', '2025-04-25 15:59:33'),
(47, 86, 1.00, 'MercadoPago', 'Pagado', '109044766309', '2025-04-25 17:22:47'),
(50, 100, 1.00, 'MercadoPago', 'Pagado', '109501705646', '2025-04-25 20:18:21'),
(51, 109, 1.00, 'MercadoPago', 'Pagado', '109552966798', '2025-04-26 11:31:48');

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
  `reset_token_expira` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `nombre`, `titulo_universitario`, `matricula_nacional`, `matricula_provincial`, `descripcion`, `telefono`, `disponibilidad`, `correo_electronico`, `contrasena_hash`, `foto_perfil_url`, `valor`, `valor_internacional`, `creado_en`, `estado`, `reset_token`, `reset_token_expira`) VALUES
(25, 'Walter Rosendo', 'MEDICO PSIQUIATRICO', '35', ' 0', 'Especialiesta ', '11615', '48 horas', 'monicejas70@gmail.com', '$2b$10$by2ozukmEbNKxD7/X6LMbeYUY5rpiPRyBrtLrTbhzDBP129wN3WIu', 'a', 1.00, 1.00, '2025-04-22 15:19:52', 0, NULL, NULL),
(27, 'Fernanda', 'Psicologa', '2', '1', ':)', 'TL', '48 horas', 'florencia.tamburelli@santodomingo.edu.ar', '$2b$10$S5eiBffRYcSpCkUt/FUyN.cJhTQjeP6eEGC6ySddwR35AuSvrOHBq', 'https://drive.google.com/uc?export=view&id=14-dPGsUkJi6u3ld_OraTIGET6k3cCELf', 1.00, 1.00, '2025-04-23 19:46:30', 0, NULL, NULL),
(28, 'Sebastian Racki', 'Lic. en Psicología', '83656', '0', 'Soy psicuanalista con más de 7 años de experiencia trabajando con adolescentes, adultos y con la inmigración latino-americana en Australia y europa. ', '1169756308', '24 horas', 'sebiracki95@gmail.com', '$2b$10$W2B7VZAY0CIiRsefq7zpEukpLPUGZH8P13YFTcz5hu/bTbtyAqTOG', 'https://drive.google.com/uc?export=view&id=1ZxK5sx5e_XdAaqseOZ7mIncQgvgzyqtV', 25000.00, 25.00, '2025-04-28 18:32:15', 1, NULL, NULL),
(31, 'MICAELA NICOLAU', 'Lic. en Psicología', NULL, '11096', 'Psicóloga con orientación psiconalítica. Trabajo con jóvenes y adultos, de manera online y presencial (en Cba Capital).', '+5493491442263', '24 horas', 'micaelaanicolau@gmail.com', '$2b$10$OM4EJ0d2VGRJgLP.FWq0Ju0t12uqqE0hXZHXePavHwB8ZhIYxhZSK', 'https://drive.google.com/uc?export=view&id=1SczZReawvM6O0GjyniIfUMtty_rskFAg', 25000.00, 25.00, '2025-04-28 18:00:25', 0, NULL, NULL),
(32, 'Lucia Salomon', 'Lic. en Terapia Ocupacional', NULL, 'MPO 122', 'Lucía Salomón es Licenciada en Terapia Ocupacional por la Universidad Nacional de Mar del Plata, Argentina. En su formación de posgrado ha recorrido áreas diversas (modelos vinculados a la clínica pediátrica, modelo social de discapacidad , planificación centrada en la persona, experiencias de trabajo corporal integral, trabajo integral con adolescentes jóvenes y familias, entre otros) y actualmente se encuentra realizando una Maestría en Terapia Ocupacional en la Universidad Nacional de Quilmes.\nSe desempeña como TO en un equipo interdisciplinario que trabaja con jóvenes en contextos educativos, acompañándolos en la reflexión y acción sobre sus proyectos de vida.\nTambién se desempeña como docente de la asignatura “Dinámica de Grupos” del tercer año de la Licenciatura en Terapia Ocupacional de la Facultad de Ciencias de la Salud y Trabajo Social de la Universidad Nacional de Mar del Plata. En esta facultad también forma parte de un Programa de Acceso, Ingreso y Permanencia y Vida Universitaria, realizando un trabajo articulado con docentes y estudiantes ingresantes y como parte de un proyecto de investigación. ', '2235405493', '24 horas', 'toluciasalomon@gmail.com', '$2b$10$I6veOB/hMQoFDtH7GiDSbO3bjPOGZ.qArps8PlSsW7k9Jr4FJuvVm', 'https://drive.google.com/uc?export=view&id=11PttJmqkm4Ihki2WHCYGkv8OfFIJ06VS', 20.00, 20.00, '2025-04-28 22:08:14', 0, NULL, NULL),
(37, 'Prueba', 'Psicologa', '0000000000000000000', '00000000000000000000000000', 'X', '2494495766', '24 horas', 'florencia.tamburelli@terapialibre.com', '$2b$10$VU/ukg3M3jRtSuf9WQOeDOjOCunniNLjpk317iK0BTYOxe.dzVUZW', '', 1.00, 1.00, '2025-04-29 14:25:23', 0, NULL, NULL),
(38, 'Milagros Santa Coloma', 'Lic. en Psicologia', '64727', NULL, 'Mi nombre es Milagros soy artista y licenciada en psicología, realicé mi especialización en psicología clínica en el servicio de Salud Mental del Hospital Ramos Mejía. Cuento con amplia experiencia en asistencia a pacientes en distintos ámbitos. Trabajé en instituciones públicas, privadas, fundaciones y de manera particular atendiendo, niños, adolescentes y adultos.\nEl espacio que ofrezco apunta a que el paciente logre de a poco escucharse a sí mismo en lo que está diciendo, ya que muchas veces hay una parte inconsciente del propio mal estar que es desconocida para el sujeto. A medida que se va tomando conocimiento de esto mediante la palabra, es que se logra aliviar algo de lo que uno sufre.\nNo es fácil hacer terapia, uno se encuentra con angustias, partes de si mismo que no quisiera, frustraciones y enojos en el camino, a la vez, es muy interesante lo que uno puede descubrir respecto de sí mismo y de todo lo que tiene para dar, lo he atravesado en mi propia experiencia analítica. Abierta a consutlas. Atiendo online y presencial.', '1156050718', '24 horas', 'milisantacoloma@gmail.com', '$2b$10$x3o1VypMP2iW93fPY9Qx2OWeilVNJLbUf7FNog8yyLC2u9irK.2Hm', 'https://drive.google.com/uc?export=view&id=1xOAste69Io7Ms5yhzFpGOl0o3oLChVun', 25000.00, 30.00, '2025-04-29 14:37:24', 1, NULL, NULL),
(40, 'Maria Elena Tallarico', 'Lic. en Psicologia', '56095', '000', 'Psicóloga con más de 10 años de experiencia. Enfoco mi práctica, en la atención a trastornos como ansiedad, depresión, estrés, fobias, baja autoestima y manejo de emociones. También brindo apoyo en situaciones de duelo, conflictos familiares o de pareja, y en procesos de autoconocimiento y desarrollo personal. Trabajo con adolescentes, adultos y adultos mayores, proporcionando herramientas para mejorar el bienestar emocional, la gestión de conflictos y el crecimiento personal. Mi objetivo es ofrecer un espacio seguro y confidencial donde puedan explorar sus dificultades, encontrar soluciones efectivas y fortalecer su salud mental para lograr una mejor calidad de vida.', '1165311743', '24 horas', 'lictallarico@gmail.com', '$2b$10$TqvyXswmyN7UaffT01FDT.N48.YWAnDnXYXhz9tQjub3a5xsJt1GO', 'https://drive.google.com/uc?export=view&id=10ds_Zvf8JJJZLk_XTlshwqOab1Vlj_2v', 24000.00, 30.00, '2025-04-29 15:04:46', 1, NULL, NULL),
(41, 'Josefina Arrastua', 'Lic. en Psicología.', '000', '35647', 'Soy Lic. En psicología (UNLP) con 8 años de experiencia acompañando adolescentes y adultos en hospital público y sector privado, trabajo desde un enfoque integral de la salud mental con tratamientos personalizados según las necesidades de cada consultante. Realizo psicología clínica, principalmente con orientación psicoanalítica, me desempeño como psicóloga forense y en procesos de evaluación laboral/orientación vocacional.', '2281409382', '24 horas', 'Josefina.arrastua@outlook.com', '$2b$10$eQ8pqN.BynRALu4auhaJYeVuXXmWWi0mF4RaHq6MLapet1ieseiDu', 'https://drive.google.com/uc?export=view&id=10FQKuTUdy1CJF6YC3xU9lPq5hPIJBVtB', 25000.00, 30.00, '2025-04-29 20:17:01', 1, NULL, NULL),
(43, 'Fatima Gago', 'Lic. en Psicologia', '83289', '0000', 'Hola! mi nombre es Fatima y soy\nPsicóloga recibida en la Universidad del Salvador. Actualmente trabajo desde un enfoque Gestaltico, de manera virtual y presencial, en la zona de Belgrano.\nEn lo personal y profesional, considero que la terapia es una herramienta poderosa que nos invita a despertar nuestros sentidos y conectar con nuestras experiencias. Me apasiona acompañar personas en este proceso dentro de un espacio seguro, confidencial y libre de juicios.', '1139293373', '24 horas', 'fatima.gago2000@gmail.com', '$2b$10$GvqnvotSHQsm27QV.y7EuuPiklYZJ2JYP.5rhXnK9yB9yTlllNKsG', 'https://drive.google.com/uc?export=view&id=1oEmtx2mrbuYO20KQytmw_UiiB02bGfbK', 18000.00, 30.00, '2025-04-29 17:35:54', 0, NULL, NULL),
(50, 'a', 'a', '', '', 'a', 'a', '24 horas', '123@123.com', '$2b$10$PqJvlZ4Dizq8Sw4UnZ1Avu/TjG4wLCIvYAcTbOJxRci81VkUdmJWG', 'a', 1.00, 2.00, '2025-04-30 15:23:57', 1, NULL, NULL);

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
(73, 25, 56, '2025-04-25', '13:00:00', 'Pendiente', NULL, '2025-04-25 15:55:04', 'https://meet.google.com/hrr-wspt-qbd', NULL, NULL, 'v3hr228bn4m8k26n59qgdeqt9s'),
(74, 25, 56, '2025-04-28', '10:00:00', 'Completado', NULL, '2025-04-25 15:59:31', 'https://meet.google.com/imp-upxp-evw', NULL, NULL, 'c5up0aelkfppcl1cbv3e4cniek'),
(86, 25, 56, '2025-04-25', '16:00:00', 'Completado', NULL, '2025-04-25 17:22:45', 'https://meet.google.com/oex-ogty-goa', NULL, NULL, '4rnmeft0ia2glmsrde56avhjjg'),
(100, 25, 56, '2025-05-02', '08:00:00', 'Pendiente', NULL, '2025-04-25 20:18:19', NULL, NULL, NULL, NULL),
(109, 25, 56, '2025-04-30', '17:00:00', 'Pendiente', NULL, '2025-04-26 11:31:44', 'https://meet.google.com/zwr-adia-mig', NULL, NULL, 'vqgckr3tt4oh0a1tl2i3ipiebo');

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
  `reset_token_expira` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `correo_electronico`, `contrasena_hash`, `created_at`, `nombre`, `id_google`, `reset_token`, `reset_token_expira`) VALUES
(51, 'solstupis@gmail.com', NULL, '2025-04-25 15:46:25', 'Sol Stupis', '111415432562062473401', NULL, NULL),
(52, 'emanuel.mtroncoso@gmail.com', '$2b$10$vNulS1efeSp1dHgr0b3Pi.d4aKt7kjMxq9bu.CFpTlVzlNGy0r9ge', '2025-04-25 17:18:16', 'Emanuel Troncoso', NULL, NULL, NULL),
(53, 'flortamburelliux@gmail.com', NULL, '2025-04-26 11:30:32', 'Florencia Tamburelli', '115994656102760403233', NULL, NULL),
(54, 'rociocpoppe@gmail.com', NULL, '2025-04-28 03:38:18', 'Rocio Poppe', '102128018965137122924', NULL, NULL),
(55, 'franciscovarela1992@gmail.com', NULL, '2025-04-28 21:23:16', 'Francisco Javier Varela', '108455358288273229382', NULL, NULL),
(56, 'ivanrosendo1102@gmail.com', '$2b$10$Xul7oc4ixYGFMHpQy6WGg.UGsjbvUGsn8bKdMQqrmckJVGB5Tg/9S', '2025-04-30 18:45:05', 'Ivan Rosendo', NULL, NULL, NULL),
(57, 'test@test.com', '$2b$10$9IZqkbNTPx/L/mE84ujCuOcem3gZdZi5mIKyhWoZfx9P70EHOo5J2', '2025-05-02 18:16:32', 'test', NULL, NULL, NULL);

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
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

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
  ADD UNIQUE KEY `matricula_nacional` (`matricula_nacional`),
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
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `id_chat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `disponibilidad`
--
ALTER TABLE `disponibilidad`
  MODIFY `id_disponibilidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

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
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chats`
--
ALTER TABLE `chats`
  ADD CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

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
