-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: ujian
-- ------------------------------------------------------
-- Server version	8.0.44-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank_soal_pilihans`
--

DROP TABLE IF EXISTS `bank_soal_pilihans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_soal_pilihans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bank_soal_id` bigint unsigned NOT NULL,
  `pilihan` varchar(180) NOT NULL,
  `is_benar` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bank_soal_pilihans_unique` (`bank_soal_id`,`pilihan`),
  CONSTRAINT `bank_soal_pilihans_bank_soals_FK` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bank_soals`
--

DROP TABLE IF EXISTS `bank_soals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_soals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jenis_soal_id` bigint unsigned NOT NULL,
  `domain_soal_id` bigint unsigned NOT NULL,
  `tahun` int NOT NULL,
  `pembuat_user_id` bigint unsigned NOT NULL,
  `pertanyaan` text NOT NULL,
  `bobot` int NOT NULL DEFAULT '1',
  `is_aktif` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bank_soals_domain_soals_FK` (`domain_soal_id`),
  KEY `bank_soals_jenis_soals_FK` (`jenis_soal_id`),
  KEY `bank_soals_users_FK` (`pembuat_user_id`),
  CONSTRAINT `bank_soals_domain_soals_FK` FOREIGN KEY (`domain_soal_id`) REFERENCES `domain_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `bank_soals_jenis_soals_FK` FOREIGN KEY (`jenis_soal_id`) REFERENCES `jenis_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `bank_soals_users_FK` FOREIGN KEY (`pembuat_user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `domain_soals`
--

DROP TABLE IF EXISTS `domain_soals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_soals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(5) NOT NULL,
  `domain` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jadwal_seleksis`
--

DROP TABLE IF EXISTS `jadwal_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jadwal_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `seleksi_id` bigint unsigned NOT NULL,
  `sesi` int NOT NULL,
  `tanggal` date NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `lokasi_ujian` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('normal','susulan') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'normal',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_seleksi_sesi` (`seleksi_id`,`sesi`),
  CONSTRAINT `jadwal_seleksis_ibfk_1` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jawaban_pesertas`
--

DROP TABLE IF EXISTS `jawaban_pesertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jawaban_pesertas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `peserta_seleksi_id` bigint unsigned NOT NULL,
  `bank_soal_id` bigint unsigned NOT NULL,
  `bank_soal_pilihan_id` bigint unsigned DEFAULT NULL,
  `jawaban_text` text,
  `nilai` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jawaban` (`peserta_seleksi_id`,`bank_soal_id`),
  KEY `bank_soal_id` (`bank_soal_id`),
  KEY `bank_soal_pilihan_id` (`bank_soal_pilihan_id`),
  CONSTRAINT `jawaban_pesertas_ibfk_1` FOREIGN KEY (`peserta_seleksi_id`) REFERENCES `peserta_seleksis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jawaban_pesertas_ibfk_2` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `jawaban_pesertas_ibfk_3` FOREIGN KEY (`bank_soal_pilihan_id`) REFERENCES `bank_soal_pilihans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jenis_soals`
--

DROP TABLE IF EXISTS `jenis_soals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jenis_soals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(5) NOT NULL,
  `jenis` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jumlah_soals`
--

DROP TABLE IF EXISTS `jumlah_soals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jumlah_soals` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `domain_soal_id` bigint unsigned DEFAULT NULL,
  `seleksi_id` bigint unsigned DEFAULT NULL,
  `jumlah` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jumlah_soals_unique` (`domain_soal_id`,`seleksi_id`),
  KEY `jumlah_soals_seleksis_FK` (`seleksi_id`),
  CONSTRAINT `jumlah_soals_domain_soals_FK` FOREIGN KEY (`domain_soal_id`) REFERENCES `domain_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `jumlah_soals_seleksis_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maping_pilihan_pesertas`
--

DROP TABLE IF EXISTS `maping_pilihan_pesertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maping_pilihan_pesertas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `peserta_seleksi_id` bigint unsigned NOT NULL,
  `bank_soal_id` bigint unsigned NOT NULL,
  `bank_soal_pilihan_id` bigint unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_maping` (`peserta_seleksi_id`,`bank_soal_id`,`bank_soal_pilihan_id`),
  KEY `bank_soal_id` (`bank_soal_id`),
  KEY `bank_soal_pilihan_id` (`bank_soal_pilihan_id`),
  CONSTRAINT `maping_pilihan_pesertas_ibfk_1` FOREIGN KEY (`peserta_seleksi_id`) REFERENCES `peserta_seleksis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maping_pilihan_pesertas_ibfk_2` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE CASCADE,
  CONSTRAINT `maping_pilihan_pesertas_ibfk_3` FOREIGN KEY (`bank_soal_pilihan_id`) REFERENCES `bank_soal_pilihans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maping_soal_pesertas`
--

DROP TABLE IF EXISTS `maping_soal_pesertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maping_soal_pesertas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bank_soal_id` bigint unsigned DEFAULT NULL,
  `peserta_seleksi_id` bigint unsigned DEFAULT NULL,
  `pilihan_order` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soal_pesertas_unique` (`bank_soal_id`,`peserta_seleksi_id`),
  KEY `soal_pesertas_peserta_seleksis_FK` (`peserta_seleksi_id`),
  CONSTRAINT `soal_pesertas_bank_soals_FK` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `soal_pesertas_peserta_seleksis_FK` FOREIGN KEY (`peserta_seleksi_id`) REFERENCES `peserta_seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `media_paths`
--

DROP TABLE IF EXISTS `media_paths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_paths` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `judul` varchar(100) NOT NULL,
  `path` varchar(180) NOT NULL,
  `jenis` enum('gambar','audio','video') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pengawas_seleksis`
--

DROP TABLE IF EXISTS `pengawas_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengawas_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jadwal_seleksi_id` bigint unsigned NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_jadwal_username` (`jadwal_seleksi_id`,`user_name`),
  UNIQUE KEY `pengawas_seleksis_unique` (`user_name`),
  CONSTRAINT `pengawas_seleksis_ibfk_1` FOREIGN KEY (`jadwal_seleksi_id`) REFERENCES `jadwal_seleksis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pengelola_seleksis`
--

DROP TABLE IF EXISTS `pengelola_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengelola_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `seleksi_id` bigint unsigned NOT NULL,
  `jabatan` enum('panitia','pembuat-soal') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengelola_seleksis_unique_1` (`user_id`,`seleksi_id`,`jabatan`),
  KEY `pengelola_seleksis_seleksi_FK` (`seleksi_id`),
  CONSTRAINT `pengelola_seleksis_seleksi_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pengelola_seleksis_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `peserta_seleksis`
--

DROP TABLE IF EXISTS `peserta_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peserta_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `peserta_id` bigint unsigned NOT NULL,
  `jadwal_seleksi_id` bigint unsigned NOT NULL,
  `is_enter` tinyint(1) DEFAULT '0',
  `enter_foto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `enter_at` datetime DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT '0',
  `is_allow` tinyint(1) DEFAULT '0',
  `allow_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `peserta_seleksi_unique` (`peserta_id`,`jadwal_seleksi_id`),
  KEY `jadwal_seleksi_id` (`jadwal_seleksi_id`),
  CONSTRAINT `peserta_seleksis_ibfk_1` FOREIGN KEY (`peserta_id`) REFERENCES `pesertas` (`id`),
  CONSTRAINT `peserta_seleksis_ibfk_2` FOREIGN KEY (`jadwal_seleksi_id`) REFERENCES `jadwal_seleksis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pesertas`
--

DROP TABLE IF EXISTS `pesertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pesertas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nomor_peserta` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `seleksi_id` bigint unsigned NOT NULL,
  `nama` varchar(180) NOT NULL,
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `jenis_kelamin` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `tanggal_lahir` date NOT NULL,
  `hp` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `foto` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_login` tinyint DEFAULT '0',
  `login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pesertas_unique` (`seleksi_id`,`nomor_peserta`),
  UNIQUE KEY `pesertas_unique_1` (`user_name`),
  CONSTRAINT `pesertas_seleksis_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pilihan_soal_pesertas`
--

DROP TABLE IF EXISTS `pilihan_soal_pesertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pilihan_soal_pesertas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reschedulles`
--

DROP TABLE IF EXISTS `reschedulles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reschedulles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `peserta_seleksi_id` bigint unsigned NOT NULL,
  `alasan` text NOT NULL,
  `dokumen_pendukung` varchar(180) DEFAULT NULL,
  `status` enum('pending','diterima','ditolak') DEFAULT 'pending',
  `verified_user_id` bigint unsigned DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `catatan_verifikasi` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_peserta_seleksi` (`peserta_seleksi_id`),
  KEY `user_id` (`verified_user_id`),
  CONSTRAINT `reschedulles_ibfk_1` FOREIGN KEY (`peserta_seleksi_id`) REFERENCES `peserta_seleksis` (`id`),
  CONSTRAINT `reschedulles_ibfk_2` FOREIGN KEY (`verified_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seleksis`
--

DROP TABLE IF EXISTS `seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tahun` year NOT NULL,
  `urutan` int NOT NULL,
  `nama` varchar(150) NOT NULL,
  `waktu_mulai` datetime DEFAULT NULL,
  `waktu_selesai` datetime DEFAULT NULL,
  `prefix_app` int NOT NULL,
  `keterangan` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seleksi_unique_1` (`prefix_app`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soal_media_paths`
--

DROP TABLE IF EXISTS `soal_media_paths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soal_media_paths` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bank_soal_id` bigint unsigned NOT NULL,
  `media_path_id` bigint unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soal_media_paths_unique` (`bank_soal_id`,`media_path_id`),
  KEY `soal_media_paths_media_paths_FK` (`media_path_id`),
  CONSTRAINT `soal_media_paths_bank_soals_FK` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `soal_media_paths_media_paths_FK` FOREIGN KEY (`media_path_id`) REFERENCES `media_paths` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `soal_seleksis`
--

DROP TABLE IF EXISTS `soal_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soal_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bank_soal_id` bigint unsigned NOT NULL,
  `seleksi_id` bigint unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `soal_seleksis_unique` (`bank_soal_id`,`seleksi_id`),
  KEY `soal_seleksis_seleksis_FK` (`seleksi_id`),
  CONSTRAINT `soal_seleksis_bank_soals_FK` FOREIGN KEY (`bank_soal_id`) REFERENCES `bank_soals` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `soal_seleksis_seleksis_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_unique` (`user_id`,`role_id`),
  KEY `user_roles_roles_FK` (`role_id`),
  CONSTRAINT `user_roles_roles_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `user_roles_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(180) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'ujian'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-30 19:28:09
