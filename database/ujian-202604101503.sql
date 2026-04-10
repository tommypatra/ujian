-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: ujian
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

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
-- Dumping data for table `bank_soal_pilihans`
--

LOCK TABLES `bank_soal_pilihans` WRITE;
/*!40000 ALTER TABLE `bank_soal_pilihans` DISABLE KEYS */;
INSERT INTO `bank_soal_pilihans` VALUES (1,12,'ini dari ubah ya',0,'2026-01-17 21:17:30','2026-01-18 05:24:57'),(2,12,'tidak terlau pas ini',0,'2026-01-17 21:17:50',NULL),(3,12,'sip mantapmi',0,'2026-01-17 21:18:02','2026-01-18 05:46:53'),(5,15,'hayabusa',0,'2026-01-17 21:20:05',NULL),(6,15,'<p>kimi&nbsp;</p><p><img style=\"width: 25%;\" src=\"http://127.0.0.1:3000/api/media-path/file/4014502cf784a6247b3c50717cbe7ea39f2a55908280e371504cce75fd9a6c97\"><br></p>',1,'2026-01-17 21:20:10','2026-03-23 10:52:40'),(7,15,'yuzong',0,'2026-01-17 21:20:20',NULL),(9,14,'yuzong',0,'2026-01-18 05:23:21',NULL),(10,12,'kita tes ubah dulu ya',1,'2026-01-18 05:33:49','2026-01-18 05:45:58'),(11,14,'alfath sanjaya',0,'2026-01-18 06:02:24',NULL),(12,14,'trindil',1,'2026-01-18 06:02:41',NULL),(13,16,'saya percaya dan yakin',1,'2026-01-25 10:54:35','2026-01-25 11:03:01'),(14,16,'saya yakin',0,'2026-01-25 10:54:45',NULL),(15,16,'kurang yakin',0,'2026-01-25 10:54:52',NULL),(16,16,'tidak yakin',0,'2026-01-25 10:54:55',NULL),(17,16,'yakin sekali',0,'2026-01-25 10:55:03',NULL),(18,13,'oke ini aman',0,'2026-01-28 07:59:23',NULL),(19,13,'jangan pi begitu',0,'2026-01-28 07:59:31',NULL),(20,13,'om ganteng bansit',0,'2026-01-28 07:59:39',NULL),(21,13,'gaskan mi om',1,'2026-01-28 07:59:46',NULL),(22,9,'doraemon',1,'2026-01-28 08:00:38',NULL),(23,9,'xmen',0,'2026-01-28 08:00:46',NULL),(24,9,'fatal fury',0,'2026-01-28 08:00:52',NULL),(25,9,'mortal kombat',0,'2026-01-28 08:01:00',NULL),(26,8,'IAIN Kendari',0,'2026-01-28 08:01:39',NULL),(27,8,'UIN Makassar',0,'2026-01-28 08:01:46',NULL),(28,8,'UIN Jakarta',0,'2026-01-28 08:01:52',NULL),(29,8,'IIQ JA Kendari',1,'2026-01-28 08:02:11',NULL),(30,7,'<p>FATIK</p><p><img src=\"http://127.0.0.1:3000/api/media-path/file/b144390412ea41fd14eb7a11f21e913af5b5ee347b0df0515a624cf2eba78991\" style=\"width: 25%;\"><br></p>',1,'2026-01-28 08:02:45','2026-03-23 10:53:24'),(31,7,'FUAD',0,'2026-01-28 08:02:52',NULL),(32,7,'PASCA',0,'2026-01-28 08:02:57',NULL),(33,7,'FEBI',0,'2026-01-28 08:03:03',NULL),(34,6,'Bangsat',1,'2026-01-28 08:03:43',NULL),(35,6,'Munafik',0,'2026-01-28 08:03:53',NULL),(36,6,'Omonng Kosong',0,'2026-01-28 08:04:01',NULL),(37,6,'Tidak Becus',0,'2026-01-28 08:04:08',NULL);
/*!40000 ALTER TABLE `bank_soal_pilihans` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `bank_soals`
--

LOCK TABLES `bank_soals` WRITE;
/*!40000 ALTER TABLE `bank_soals` DISABLE KEYS */;
INSERT INTO `bank_soals` VALUES (6,6,8,2025,1,'apa yang dimaksud dengan ini ?',1,1,'2026-01-08 09:00:40',NULL),(7,6,8,2025,1,'apakah kamu setuju dengan ini ?',1,1,'2026-01-08 13:25:51',NULL),(8,6,8,2025,3,'kenapa ini mau makan tapi lapar ?',1,1,'2026-01-08 13:26:36',NULL),(9,6,8,2025,1,'Kenapa tadi bisa kalah bro, pdhl mau comeback ?',1,1,'2026-01-08 13:28:05','2026-01-09 04:55:30'),(12,6,8,2026,5,'apakah anda mengatahui kenapa matahari itu muncul saat jam 6 pagi ?',1,1,'2026-01-16 19:36:38',NULL),(13,6,9,2026,1,'apakah anda paham maksud dari NKRI harga mati ?',1,1,'2026-01-16 19:37:51','2026-01-16 19:39:54'),(14,6,9,2026,7,'apa makna dari sila ke 5 dalam pancasila',1,1,'2026-01-16 19:40:19',NULL),(15,6,9,2026,1,'<p>kapan uud 1945 mulai di rancang?</p><p><img style=\"width: 50%;\" src=\"http://127.0.0.1:3000/api/media-path/file/9688ab3ec6fb73d46c3b9d6509c1e427909a0c4b461097a46be9a10aa40e6ee2\"><br></p>',1,1,'2026-01-16 19:40:29','2026-03-23 10:52:51'),(16,6,9,2026,3,'apakah kamu kenal dengan dia ?',0,1,'2026-01-25 10:45:09',NULL);
/*!40000 ALTER TABLE `bank_soals` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_soals`
--

LOCK TABLES `domain_soals` WRITE;
/*!40000 ALTER TABLE `domain_soals` DISABLE KEYS */;
INSERT INTO `domain_soals` VALUES (8,'TPA','Tes Potensi Akademik',NULL,NULL),(9,'TWK','Tes Wawasan Kebangsaan',NULL,NULL);
/*!40000 ALTER TABLE `domain_soals` ENABLE KEYS */;
UNLOCK TABLES;

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
  `is_mulai` tinyint(1) DEFAULT NULL,
  `is_selesai` tinyint(1) DEFAULT NULL,
  `mulai_at` datetime DEFAULT NULL,
  `selesai_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_seleksi_sesi` (`seleksi_id`,`sesi`),
  KEY `jadwal_seleksis_status_IDX` (`status`) USING BTREE,
  CONSTRAINT `jadwal_seleksis_ibfk_1` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=676 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal_seleksis`
--

LOCK TABLES `jadwal_seleksis` WRITE;
/*!40000 ALTER TABLE `jadwal_seleksis` DISABLE KEYS */;
INSERT INTO `jadwal_seleksis` VALUES (1,2,1,'2026-01-01','08:00:00','09:30:00','IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-02 19:31:00',NULL),(3,2,2,'2026-01-01','10:00:00','11:30:00','IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-02 20:17:26',NULL),(5,3,1,'2026-03-01','08:00:00','10:00:00','Dari Rumah Masing-masing','normal',NULL,NULL,NULL,NULL,'2026-01-02 20:53:41',NULL),(15,2,5,'2026-04-01','08:00:00','10:00:00','Lab Multimedia','normal',NULL,NULL,NULL,NULL,'2026-01-04 13:45:32',NULL),(26,9,1,'2026-01-11','08:00:00','08:00:00','IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-11 20:18:48',NULL),(47,9,2,'2026-01-11','08:00:00','08:00:00','Lab Komputer II','normal',NULL,NULL,NULL,NULL,'2026-01-11 20:52:34',NULL),(48,9,3,'2026-01-11','08:00:00','08:00:00','Lab Bahasa','normal',NULL,NULL,NULL,NULL,'2026-01-11 20:52:53',NULL),(50,9,4,'2026-01-11','09:00:00','10:00:00','Lab Bahasa','normal',NULL,NULL,NULL,NULL,'2026-01-11 21:05:15',NULL),(51,11,1,'2026-01-14','08:00:00','09:30:00','Lab I IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-14 14:05:10',NULL),(53,11,2,'2026-01-14','08:00:00','09:30:00','Lab II IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-14 14:19:33',NULL),(56,11,3,'2026-01-14','08:00:00','09:30:00','Lab Bahasa IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-14 14:33:03',NULL),(57,11,4,'2026-01-16','08:00:00','09:00:00','Lab Komputer Gedung Multimedia IAIN Kendari','normal',NULL,NULL,NULL,NULL,'2026-01-16 05:35:39','2026-01-16 05:36:32'),(656,7,1,'2026-02-15','08:00:00','09:00:00','Lab Komp 1','normal',1,NULL,'2026-04-01 07:29:09','2026-03-31 12:01:26','2026-02-27 07:31:20','2026-04-01 07:29:09'),(657,7,2,'2026-02-15','08:00:00','09:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(658,7,3,'2026-02-15','09:00:00','10:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(659,7,4,'2026-02-15','09:00:00','10:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(660,7,5,'2026-02-16','08:00:00','09:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(661,7,6,'2026-02-16','08:00:00','09:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(662,7,7,'2026-02-16','09:00:00','10:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(663,7,8,'2026-02-16','09:00:00','10:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(664,7,9,'2026-02-17','08:00:00','09:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:20',NULL),(665,7,10,'2026-02-17','08:00:00','09:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(666,7,11,'2026-02-17','09:00:00','10:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(667,7,12,'2026-02-17','09:00:00','10:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(668,7,13,'2026-02-18','08:00:00','09:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(669,7,14,'2026-02-18','08:00:00','09:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(670,7,15,'2026-02-18','09:00:00','10:00:00','Lab Komp 1','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(671,7,16,'2026-02-18','09:00:00','10:00:00','Lab Komp 2','normal',NULL,NULL,NULL,NULL,'2026-02-27 07:31:21',NULL),(674,7,17,'2026-03-27','08:00:00','08:00:00','Online','susulan',1,NULL,'2026-04-08 07:39:47','2026-04-08 07:37:58','2026-03-27 08:08:17','2026-04-08 07:39:47'),(675,7,18,'2026-03-29','19:00:00','19:00:00','Online','susulan',NULL,NULL,NULL,NULL,'2026-03-29 19:24:05',NULL);
/*!40000 ALTER TABLE `jadwal_seleksis` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jawaban_pesertas`
--

LOCK TABLES `jawaban_pesertas` WRITE;
/*!40000 ALTER TABLE `jawaban_pesertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `jawaban_pesertas` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`),
  UNIQUE KEY `jenis_soals_unique` (`kode`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jenis_soals`
--

LOCK TABLES `jenis_soals` WRITE;
/*!40000 ALTER TABLE `jenis_soals` DISABLE KEYS */;
INSERT INTO `jenis_soals` VALUES (6,'PG','Pilihan Ganda',NULL,NULL),(7,'ESS','Essay Test',NULL,NULL),(8,'LSTN','Listening','2026-02-05 06:02:22',NULL);
/*!40000 ALTER TABLE `jenis_soals` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jumlah_soals`
--

LOCK TABLES `jumlah_soals` WRITE;
/*!40000 ALTER TABLE `jumlah_soals` DISABLE KEYS */;
INSERT INTO `jumlah_soals` VALUES (7,8,11,5,'2026-01-25 18:55:07','2026-01-25 18:55:20.957'),(8,9,11,15,'2026-01-25 22:11:12',NULL),(10,8,7,3,'2026-02-16 10:21:25',NULL),(12,9,7,2,'2026-02-25 12:41:06',NULL);
/*!40000 ALTER TABLE `jumlah_soals` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `maping_pilihan_pesertas`
--

LOCK TABLES `maping_pilihan_pesertas` WRITE;
/*!40000 ALTER TABLE `maping_pilihan_pesertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `maping_pilihan_pesertas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maping_soal_pesertas`
--

LOCK TABLES `maping_soal_pesertas` WRITE;
/*!40000 ALTER TABLE `maping_soal_pesertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `maping_soal_pesertas` ENABLE KEYS */;
UNLOCK TABLES;

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
  `jenis` enum('gambar','audio','video','dokumen') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `uuid` varchar(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_paths_unique` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_paths`
--

LOCK TABLES `media_paths` WRITE;
/*!40000 ALTER TABLE `media_paths` DISABLE KEYS */;
INSERT INTO `media_paths` VALUES (1,'-','storage/media_path/2026/02/50be4aa8415bc0d1dfe6c55d574de583.png','gambar','1234','2026-02-11 14:54:27',NULL),(2,'editor-image','storage/media_path/2026/03/9b1cc32b6c95b6a00fe47cce908fee2d.png',NULL,'4321','2026-03-08 05:32:11',NULL),(3,'editor-image','storage/media_path/2026/03/76599f4a2b891a42c7545932e7b6d47e.png',NULL,'0001','2026-03-08 05:33:03',NULL),(4,'editor-image-soal','storage/media_path/2026/03/a74645f3d0e193557c3f9666e6c2b286.png',NULL,'0191','2026-03-08 05:35:12',NULL),(5,'editor-image-soal-pilihan','storage/media_path/2026/03/7e2611a21359f52da8136ad647eed50a.png','gambar','1917','2026-03-08 05:39:40',NULL),(6,'editor-image-seleksi','storage/media_path/2026/03/f7f39a9a91db8bc4cec4a7e7bdb74504.png','gambar','0193','2026-03-08 05:43:41',NULL),(7,'editor-image-seleksi','storage/media_path/2026/03/0266c71a373e9f0f41b57ae9a9bf05f7.png','gambar','5462','2026-03-08 06:02:14',NULL),(8,'editor-image-seleksi','storage/media_path/2026/03/abaf676a7b90262d864b8d972ebdb5e9.png','gambar','8782','2026-03-08 06:07:06',NULL),(9,'editor-image-seleksi','storage/media_path/2026/03/177a334afb4fd53ed067b8faf9dfaa5e.png','gambar','6743','2026-03-08 06:22:04',NULL),(10,'editor-image-soal','storage/media_path/2026/03/7cc419558ecb52dc7d678bfdcebbb67b.png','gambar','2209','2026-03-08 17:08:34',NULL),(11,'editor-image-pilihan','storage/media_path/2026/03/9b354822ed798733a34abc82d8db721a.png','gambar','7654','2026-03-08 17:08:53',NULL),(12,'editor-image-pilihan','storage/media_path/2026/03/3ccf2c0a8d2fec2d54d12bf7ffd03a8a.png','gambar','9009','2026-03-08 17:11:46',NULL),(13,'Foto Enter Ujian','storage/enter_foto/2026/03/9bbceee52e6064832bafc3743fc9e74d.jpg','gambar','1203','2026-03-13 19:01:09',NULL),(14,'Foto Enter Ujian','storage/enter_foto/2026/03/175ab7260fe0ee4e9c60f79a50fe596e.jpg','gambar','3301','2026-03-13 19:04:42',NULL),(19,'Foto Enter Ujian','storage/enter_foto/2026/03/263dae5bcce06cef54ed04de26cff543.jpg','gambar','0192','2026-03-15 09:25:50',NULL),(20,'Foto Enter Ujian','storage/enter_foto/2026/03/b5c301000bf05ebab27d893892fa4d19.jpg','gambar','3816','2026-03-15 09:27:14',NULL),(21,'Foto Enter Ujian','storage/enter_foto/2026/03/5018de00b9dad6ecf4fbbfac87803f92.jpg','gambar','1039','2026-03-17 21:08:36',NULL),(22,'Foto Enter Ujian','storage/enter_foto/2026/03/c67fdef85e62ac41d6fae931da9ed906.jpg','gambar','3018','2026-03-18 17:51:52',NULL),(23,'Foto Enter Ujian','storage/enter_foto/2026/03/54ab145fccef64e62abcbc7b1d3498c6.jpg','gambar','3493','2026-03-19 10:24:54',NULL),(28,'Reschedulle Ujian','storage/reschedule/2026/03/038f276f268e98697d35fffe43e25214.pdf','dokumen','4913','2026-03-22 23:23:58',NULL),(29,'editor-image-seleksi','storage/media_path/2026/03/6181b853d1a081eb54cfe2eda288966f.png','gambar','6665','2026-03-23 10:09:18',NULL),(30,'editor-image-seleksi','storage/media_path/2026/03/22895bd051e288c985947e809b13a735.png','gambar','8990','2026-03-23 10:10:13',NULL),(31,'editor-image-seleksi','storage/media_path/2026/03/20a6e56c9c531f8bbe493891acd89a90.png','gambar','0990','2026-03-23 10:43:15',NULL),(32,'editor-image-seleksi','storage/media_path/2026/03/7fd9cad1b23b93f451234d12fdc6418f.png','gambar','bfda2ecb3445fbfccf6d53cf3c4ba207dc99f888c63811154708e8dc1949ffe6','2026-03-23 10:44:17',NULL),(33,'editor-image-seleksi','storage/media_path/2026/03/0ca8b235cfee4435affbba88877563a9.png','gambar','b7d9d37de4985058bbf869069ab8f96d2d5d864494c2584d488bbc3780d48a37','2026-03-23 10:44:38',NULL),(34,'editor-image-seleksi','storage/media_path/2026/03/662c9aa6c02a9c79b31e77b95fdab31a.png','gambar','b517abaa76607f3a7daedf38d9af8d48a55525d6b73959e3f2b7c7fcffd604f6','2026-03-23 10:48:15',NULL),(35,'editor-image-seleksi','storage/media_path/2026/03/088c6b97af3e39ab51e016ec329c3202.png','gambar','8bf8164d5bba154005420386c8562617213ba3c6162220ee4b5a9e17ba3a8ee0','2026-03-23 10:48:26',NULL),(36,'editor-image-seleksi','storage/media_path/2026/03/d3fc5b289e980caf4e860bdedc33138d.png','gambar','958fcc2d98fa9fc6aecaac8013c3a4f65e00243b35da628d76b23b4af286c711','2026-03-23 10:50:35',NULL),(37,'editor-image-seleksi','storage/media_path/2026/03/0564b2ad4049f780bb1dc63ddb02e7f4.png','gambar','fb05b08031a46cb3fda9b0570a0a5dc3582504ca576265111c4e95fb666cc7ab','2026-03-23 10:50:50',NULL),(38,'editor-image-soal','storage/media_path/2026/03/4944f66cf246ab197b8391809626f402.png','gambar','9688ab3ec6fb73d46c3b9d6509c1e427909a0c4b461097a46be9a10aa40e6ee2','2026-03-23 10:52:08',NULL),(39,'editor-image-pilihan','storage/media_path/2026/03/8aeb0a426e08ce56e02bb881b040702b.png','gambar','4014502cf784a6247b3c50717cbe7ea39f2a55908280e371504cce75fd9a6c97','2026-03-23 10:52:27',NULL),(40,'editor-image-pilihan','storage/media_path/2026/03/4446997f62a15c7ff274a740b808d806.png','gambar','b144390412ea41fd14eb7a11f21e913af5b5ee347b0df0515a624cf2eba78991','2026-03-23 10:53:21',NULL),(44,'Reschedulle Ujian','storage/reschedule/2026/03/8906459012d5e3f2c9c37f5b3ecc30a4.pdf','dokumen','4563','2026-03-25 10:54:02',NULL),(45,'Reschedulle Ujian','storage/reschedule/2026/03/474ddaa92d4571adabf8cae7574528c5.pdf','dokumen','7689','2026-03-25 10:54:17',NULL),(46,'Reschedulle Ujian','storage/reschedule/2026/03/1048d36ee5e9f3a0bc157f373d0ea67d.pdf','dokumen','cba80673f29b58d40c07c0ed10085a6d56bfdab6d44de10e65fe8e9553e0cc13','2026-03-25 11:01:34',NULL),(59,'Reschedulle Ujian','storage/reschedule/2026/03/ce5df1fa2a6b5cfc794f8aae32212252.pdf','dokumen','ab1c458921ad570e13e23e6256bceed0a1196d3437e2088d34d942e82d668cc9','2026-03-26 12:13:11',NULL),(60,'Reschedulle Ujian','storage/reschedule/2026/03/1bf075bea4d2d0e9a16197baf4697658.pdf','dokumen','bf22b01aa8e15b404b2da3349b3b565e0182263e32cd50ec947eb47673dbb7f9','2026-03-26 12:16:48',NULL),(100,'Reschedulle Ujian','storage/reschedule/2026/03/8589c75c95754e73fae29f89f2545d78.pdf','dokumen','a343be696e6ec274b05197fa68031c63a3eda8e6bee160e18f246198eda24703','2026-03-26 17:32:57',NULL),(102,'Reschedulle Ujian','storage/reschedule/2026/03/7960d0324bf56c37894ef1e5159b5884.pdf','dokumen','b6021c11baa16a1abe06369dc5a8767b9487291e22f3fb59f04b0731edb00d20','2026-03-26 20:36:25',NULL),(103,'Reschedulle Ujian','storage/reschedule/2026/03/3182b7d12ebdf8f812cec7fd13b4d74e.pdf','dokumen','c2dad9fbad17b4097133cb3242489356763d86d26ba56cdd4dfc2a42d65cc3c9','2026-03-29 19:22:20',NULL),(107,'Reschedulle Ujian','storage/reschedule/2026/03/797ccdcc553696cd7f4fcde3594f4744.pdf','dokumen','c3091c62dc8578cbd6d61f7047bfaa8c51921c12c16b9c02a1fa8824d730b8f2','2026-03-30 11:16:23',NULL),(109,'Reschedulle Ujian','storage/reschedule/2026/03/86a4c037ddb80d79fbcefa501c79c224.pdf','dokumen','672e33651c8089d0eebc14731c6ee161690ba9b69f81138b2cc9852572891044','2026-03-30 11:17:33',NULL),(110,'Reschedulle Ujian','storage/reschedule/2026/03/1edee74928a49ebb99061ca509e6a685.pdf','dokumen','d63901ac54d859c8e044ab5de19620d0557f027e30fdb9bf0b5eac8364480d3c','2026-03-30 11:18:18',NULL),(112,'Foto Enter Ujian','storage/enter_foto/2026/03/46dfa355d87806b0e3d6aada7bab6070.jpg','gambar',NULL,'2026-03-30 14:57:59',NULL),(113,'Foto Enter Ujian','storage/enter_foto/2026/03/7eac37de985a73e4444068673fed4f7c.jpg','gambar',NULL,'2026-03-30 15:55:16',NULL),(114,'Foto Enter Ujian','storage/enter_foto/2026/03/36e3fef4e37a57bf3b9ecdf223248f1e.jpg','gambar','2e07ffd26869e21901edf53ec72aa49c609c5317d5ed4a75318ff495f509cc8c','2026-03-30 15:58:33',NULL),(116,'editor-image-seleksi','storage/media_path/2026/03/9de3dcc55d7eb75126c28e6eaddd7cac.png','gambar','9d5cdd5b6c82ad2db16763280ee1842c167566b4bcc74075ac8498db8b7b2781','2026-03-31 20:29:10',NULL),(117,'Foto Enter Ujian','storage/enter_foto/2026/04/c425dad9145d864c375ab305e23d1912.jpg','gambar','56a2e2f97314ca69677c4889432b51be31e377fb26e52b0809a6fede718bd8fd','2026-04-01 13:25:50',NULL),(118,'Foto Enter Ujian','storage/enter_foto/2026/04/0dacfea1ccaefbd542dbf576cf069cf1.jpg','gambar','74c9784fca126f1b2ada2adfa2b43244b183a910d6caccd36f3e1da2649c1b1b','2026-04-01 13:28:33',NULL),(120,'Foto Enter Ujian','storage/enter_foto/2026/04/937ed17d1784c88835e8b59283fef36e.jpg','gambar','0621531d94925ce21d591884aa75d6ac8b0ef2cfe26576e5c94ba883be5a353f','2026-04-01 13:31:22',NULL),(121,'Foto Enter Ujian','storage/enter_foto/2026/04/d1fd50055ccba7c671ddad35df21fc39.jpg','gambar','0f66371edb3c1202c865d756e9db8c43a0f1c286a21afe6b27bacb983d4c2d7e','2026-04-01 13:34:17',NULL),(123,'Foto Enter Ujian','storage/enter_foto/2026/04/85c20b26f7198a624cd38e0da4330fdb.jpg','gambar','4e2fe50a3cac1d025f77ba61aa2e4b67936dad6f4ec5517abfbf386c7d0bed3c','2026-04-01 14:22:55',NULL),(124,'Foto Enter Ujian','storage/enter_foto/2026/04/d34b98a87fdee429d72dcd1584aff7be.jpg','gambar','616b8503d8b8e182d50bf9cf482b36989362455e6c4e3f14c0ed27a8eccc585c','2026-04-01 14:33:29',NULL),(125,'Foto Enter Ujian','storage/enter_foto/2026/04/1dc711e51555667be443d3a681ea3205.jpg','gambar','e3b46900a5171d70fd3f5c18f89583c6f5186e681a9c6f0a5b304ecfea22cb35','2026-04-01 14:35:22',NULL),(126,'Foto Enter Ujian','storage/enter_foto/2026/04/a20e328b4b394a5c129510b92c8c9d64.jpg','gambar','655b5a5ab18bd607a27c79fec2c9172e285c934cbe7d7a6b42ada4f28884b451','2026-04-01 14:42:22',NULL),(127,'Foto Enter Ujian','storage/enter_foto/2026/04/4fc374e682d22803fb4cef26684c4ade.jpg','gambar','194a90be242385042834d8eb28bf71a9c0a2224ab524e067daef33f7daed3ad7','2026-04-01 14:56:28',NULL),(128,'Foto Enter Ujian','storage/enter_foto/2026/04/d9adc7599a3fdbc35c68e6ba8b6278e7.jpg','gambar','f571930cc9f8ddb28294ac1a8029bcacbebc48aeada896a4dc5d9c5c70f30125','2026-04-02 08:58:10',NULL),(129,'Foto Enter Ujian','storage/enter_foto/2026/04/a475b359b44b1f509a68c72d18386dfe.jpg','gambar','3d2b07274b5a72456e28198d69255d39b569957e22349860df09b36571430d2d','2026-04-02 08:59:40',NULL),(130,'Foto Enter Ujian','storage/enter_foto/2026/04/d0c1fe9955bcf1c2dfd59cf8853196ac.jpg','gambar','b2ba9d9db22d47d34634ce52b355dada2dca13f5558d4b47abda51390a7025ab','2026-04-02 09:03:33',NULL),(131,'Foto Enter Ujian','storage/enter_foto/2026/04/deacb629dc2a8c3749ad210dfecd929b.jpg','gambar','4362388eb87fdf5b60061b7bf66d26adfb12ccc3ceb96478160e37073a32a0f6','2026-04-03 07:31:03',NULL),(132,'Foto Enter Ujian','storage/enter_foto/2026/04/521dce08bf8809f1ef4a028e85ee9794.jpg','gambar','4c0e1612a7be80a719daa5076b785b4193acbfacd8f4fcc1289e1850e55c3ad7','2026-04-03 07:52:33',NULL),(133,'Foto Enter Ujian','storage/enter_foto/2026/04/6ffe5572df53903097d0362cb2193751.jpg','gambar','2cb904acaf1614b153daca26f3fefdd96dc19884906d012ffc2c0f6c308c2c99','2026-04-07 15:18:20',NULL),(134,'Foto Enter Ujian','storage/enter_foto/2026/04/9413b95a47a306d023620c71117f3e00.jpg','gambar','ff82c4d16f1650c25b95f634d455af331a647cf7380c03dcf2e6f3c02c5c603c','2026-04-07 15:23:05',NULL),(135,'Foto Enter Ujian','storage/enter_foto/2026/04/ecaa7090410b5e31802875adeec4eb87.jpg','gambar','bde1cc17603279b2d2b58659bed111776f039ad46b2f942746cf4b748fa66492','2026-04-07 19:06:11',NULL),(137,'Foto Enter Ujian','storage/enter_foto/2026/04/203e60a3d37901b7a0e2a19f2a08a6ce.jpg','gambar','81807442502040b6bfb0d418da58df791d54dcc1d819d67dcda4b29ae8550f6f','2026-04-07 19:07:25',NULL),(138,'Foto Enter Ujian','storage/enter_foto/2026/04/3049f51fe51fcb21e544fba637e002af.jpg','gambar','9e87d2e2766319590cf4e7ee3063bd36bd209e618a48c46a688a3703562643a5','2026-04-07 19:24:30',NULL),(139,'Foto Enter Ujian','storage/enter_foto/2026/04/7a801052683cbed308cecc4f274e05a7.jpg','gambar','72beea2f9f7eb28df32b7d3315619c6ab85fce2623d2386d098f9cec8abd7aa1','2026-04-07 19:25:03',NULL),(140,'Foto Enter Ujian','storage/enter_foto/2026/04/7a8e50df7f12ad0813d2ca340062ee0d.jpg','gambar','b681d180f438798d530ccc68ae2b7c7a3d577b02381f779e94d4c7995070ae05','2026-04-07 19:26:38',NULL),(141,'Foto Enter Ujian','storage/enter_foto/2026/04/1e6cf13bed191bc0dcd8f19366c63391.jpg','gambar','4d2cf4a431569b7274d54f36d0b39186e6ca351f0747c076dfe00b6829e4eec5','2026-04-07 19:29:21',NULL),(142,'Foto Enter Ujian','storage/enter_foto/2026/04/d9f135ef7d085004262e1d1b0274e016.jpg','gambar','b0dc10acf9295ff1dc47accf1223bfc48217f0e702b74863dda5415bc7c30c68','2026-04-07 19:30:07',NULL),(143,'Foto Enter Ujian','storage/enter_foto/2026/04/85486f22878a4cbeee8e34b50aee6895.jpg','gambar','46fa5fa1126a5fefffbfbc9a4d6df471ece1e9c48a33c148ffc80ff3a136090b','2026-04-08 05:49:25',NULL),(144,'Foto Enter Ujian','storage/enter_foto/2026/04/73a431b7fb4a79f12626158026fe91cb.jpg','gambar','33bb9b3097f5906870da7b6aeba4e63a5947329d620378e0d30ca1c3e067de62','2026-04-08 05:50:36',NULL),(145,'Foto Enter Ujian','storage/enter_foto/2026/04/0411edf102a58ce8f56d765ea2d6d1f6.jpg','gambar','d08368239c519d60ad726f4a5c761e8025a84213bcb92190e1d70c4fd6577ca9','2026-04-08 05:51:52',NULL),(146,'Foto Enter Ujian','storage/enter_foto/2026/04/86245caccf0a21aeac7e742c6008ae3d.jpg','gambar','7eb9425d30aea37cfba3fd356a3732f5dabb060800b9d8cc60d527d42a56f0a4','2026-04-08 06:00:12',NULL),(147,'Foto Enter Ujian','storage/enter_foto/2026/04/b1b3129b1b14fbd1e90db8bb98e0ce14.jpg','gambar','31efc0dc091931c532562f7a828fc4ef7ff81cf76ce967c9e507c6685dbb6749','2026-04-08 06:02:10',NULL),(148,'Foto Enter Ujian','storage/enter_foto/2026/04/79181de648632e258eace7ac5d25c31c.jpg','gambar','5f047b6d8f9ffbf8acf3459db0db6816ea1208a44477e70ab79da9f1b7bd1f76','2026-04-08 07:40:12',NULL);
/*!40000 ALTER TABLE `media_paths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengawas_seleksis`
--

DROP TABLE IF EXISTS `pengawas_seleksis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengawas_seleksis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jadwal_seleksi_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengawas_seleksis_unique_1` (`jadwal_seleksi_id`,`user_id`),
  KEY `pengawas_seleksis_users_FK` (`user_id`),
  CONSTRAINT `pengawas_seleksis_ibfk_1` FOREIGN KEY (`jadwal_seleksi_id`) REFERENCES `jadwal_seleksis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pengawas_seleksis_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengawas_seleksis`
--

LOCK TABLES `pengawas_seleksis` WRITE;
/*!40000 ALTER TABLE `pengawas_seleksis` DISABLE KEYS */;
INSERT INTO `pengawas_seleksis` VALUES (191,656,1,'2026-02-27 07:31:20',NULL),(192,657,5,'2026-02-27 07:31:20',NULL),(193,658,7,'2026-02-27 07:31:20',NULL),(194,659,11,'2026-02-27 07:31:20',NULL),(195,660,1,'2026-02-27 07:31:20',NULL),(196,661,5,'2026-02-27 07:31:20',NULL),(197,662,7,'2026-02-27 07:31:20',NULL),(198,663,11,'2026-02-27 07:31:20',NULL),(199,664,1,'2026-02-27 07:31:20',NULL),(200,665,5,'2026-02-27 07:31:21',NULL),(201,666,7,'2026-02-27 07:31:21',NULL),(202,667,11,'2026-02-27 07:31:21',NULL),(203,668,1,'2026-02-27 07:31:21',NULL),(204,669,5,'2026-02-27 07:31:21',NULL),(213,670,5,'2026-02-28 19:24:24',NULL),(215,671,5,'2026-02-28 19:24:40',NULL),(216,674,1,'2026-03-27 08:08:17',NULL),(219,675,5,'2026-03-29 19:24:05',NULL);
/*!40000 ALTER TABLE `pengawas_seleksis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pengawas_seleksis_old`
--

DROP TABLE IF EXISTS `pengawas_seleksis_old`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pengawas_seleksis_old` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `jadwal_seleksi_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengawas_seleksis_unique_1` (`jadwal_seleksi_id`,`user_id`),
  KEY `pengawas_seleksis_users_FK` (`user_id`) USING BTREE,
  CONSTRAINT `pengawas_seleksis_ibfk_1_copy` FOREIGN KEY (`jadwal_seleksi_id`) REFERENCES `jadwal_seleksis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pengawas_seleksis_users_FK_copy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengawas_seleksis_old`
--

LOCK TABLES `pengawas_seleksis_old` WRITE;
/*!40000 ALTER TABLE `pengawas_seleksis_old` DISABLE KEYS */;
/*!40000 ALTER TABLE `pengawas_seleksis_old` ENABLE KEYS */;
UNLOCK TABLES;

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
  `jabatan` enum('panitia','pembuat-soal','pengawas') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pengelola_seleksis_unique_1` (`user_id`,`seleksi_id`,`jabatan`),
  KEY `pengelola_seleksis_seleksi_FK` (`seleksi_id`),
  CONSTRAINT `pengelola_seleksis_seleksi_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `pengelola_seleksis_users_FK` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pengelola_seleksis`
--

LOCK TABLES `pengelola_seleksis` WRITE;
/*!40000 ALTER TABLE `pengelola_seleksis` DISABLE KEYS */;
INSERT INTO `pengelola_seleksis` VALUES (1,1,2,'panitia','2026-01-01 20:58:51',NULL),(2,3,2,'panitia','2026-01-01 20:59:30',NULL),(3,8,2,'panitia','2026-01-01 20:59:41','2026-01-01 21:01:18'),(5,6,2,'panitia','2026-01-02 19:12:59',NULL),(8,1,3,'panitia','2026-01-02 20:36:13',NULL),(13,1,7,'panitia','2026-01-11 11:57:57','2026-02-25 08:08:04'),(14,1,9,'panitia','2026-01-11 12:54:05',NULL),(18,8,9,'pembuat-soal','2026-01-11 19:34:09',NULL),(19,8,9,'panitia','2026-01-11 19:35:59',NULL),(20,5,9,'panitia','2026-01-11 19:38:18',NULL),(23,1,11,'panitia','2026-01-16 05:18:47',NULL),(24,5,11,'panitia','2026-01-16 05:19:35',NULL),(26,7,11,'pembuat-soal','2026-01-16 05:19:51',NULL),(27,6,11,'pembuat-soal','2026-01-16 05:32:26',NULL),(28,1,7,'pembuat-soal','2026-02-14 05:30:30',NULL),(29,1,7,'pengawas','2026-02-14 05:30:37',NULL),(30,5,7,'pengawas','2026-02-27 07:26:33',NULL),(33,7,7,'pengawas','2026-02-27 07:27:22',NULL),(35,11,7,'pengawas','2026-02-27 07:27:43',NULL);
/*!40000 ALTER TABLE `pengelola_seleksis` ENABLE KEYS */;
UNLOCK TABLES;

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
  `media_path_id` bigint unsigned DEFAULT NULL,
  `enter_at` datetime DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT '0',
  `is_allow` tinyint(1) DEFAULT '0',
  `is_valid` tinyint(1) NOT NULL DEFAULT '1',
  `allow_at` datetime DEFAULT NULL,
  `total_soal` int NOT NULL DEFAULT '0',
  `total_dijawab` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `peserta_seleksi_unique` (`peserta_id`,`jadwal_seleksi_id`),
  UNIQUE KEY `peserta_seleksis_unique` (`peserta_id`,`is_valid`),
  KEY `jadwal_seleksi_id` (`jadwal_seleksi_id`),
  KEY `peserta_seleksis_media_paths_FK` (`media_path_id`),
  KEY `peserta_seleksis_peserta_id_IDX` (`peserta_id`) USING BTREE,
  CONSTRAINT `peserta_seleksis_ibfk_1` FOREIGN KEY (`peserta_id`) REFERENCES `pesertas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `peserta_seleksis_ibfk_2` FOREIGN KEY (`jadwal_seleksi_id`) REFERENCES `jadwal_seleksis` (`id`),
  CONSTRAINT `peserta_seleksis_media_paths_FK` FOREIGN KEY (`media_path_id`) REFERENCES `media_paths` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peserta_seleksis`
--

LOCK TABLES `peserta_seleksis` WRITE;
/*!40000 ALTER TABLE `peserta_seleksis` DISABLE KEYS */;
INSERT INTO `peserta_seleksis` VALUES (1,6,1,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-05 13:33:06',NULL),(2,8,1,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-05 13:33:59',NULL),(3,9,1,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-05 13:34:15',NULL),(5,10,3,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-05 13:39:12',NULL),(12,18,26,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-13 05:40:22',NULL),(14,17,26,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-14 06:12:12',NULL),(15,19,51,0,NULL,NULL,0,0,0,NULL,0,0,'2026-01-16 19:12:35','2026-01-30 19:18:50'),(18,20,51,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-16 19:13:55',NULL),(20,22,51,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-16 19:16:14',NULL),(21,19,57,0,NULL,NULL,0,0,1,NULL,0,0,'2026-01-16 19:12:35',NULL),(58,186,656,0,NULL,'2026-04-08 06:00:11',0,0,1,'2026-04-08 06:00:20',0,0,'2026-02-28 21:13:23','2026-04-08 06:01:21'),(60,188,656,0,NULL,'2026-04-08 05:51:51',0,0,0,'2026-04-08 05:52:00',0,0,'2026-02-28 21:13:24','2026-04-08 05:52:23'),(61,189,656,0,NULL,'2026-04-07 19:30:06',0,0,1,'2026-04-07 19:30:15',0,0,'2026-02-28 21:13:24','2026-04-08 05:34:59'),(62,190,657,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:24',NULL),(63,191,657,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:24',NULL),(64,192,657,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(65,193,657,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(66,194,658,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(67,195,658,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(68,196,658,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(69,197,658,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(70,198,659,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:25',NULL),(71,199,659,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:26',NULL),(72,200,659,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:26',NULL),(73,201,659,0,NULL,NULL,0,0,1,NULL,0,0,'2026-02-28 21:13:26',NULL),(96,187,656,0,NULL,'2026-04-08 06:02:09',0,0,1,'2026-04-08 06:02:16',0,0,NULL,'2026-04-08 06:02:41'),(120,188,674,0,NULL,'2026-04-08 07:40:12',0,0,1,'2026-04-08 07:40:20',0,0,NULL,'2026-04-08 07:40:55');
/*!40000 ALTER TABLE `peserta_seleksis` ENABLE KEYS */;
UNLOCK TABLES;

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
  `token_login` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `device_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pesertas_unique` (`seleksi_id`,`nomor_peserta`),
  UNIQUE KEY `pesertas_unique_1` (`user_name`),
  KEY `pesertas_device_id_IDX` (`device_id`) USING BTREE,
  CONSTRAINT `pesertas_seleksis_FK` FOREIGN KEY (`seleksi_id`) REFERENCES `seleksis` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=269 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesertas`
--

LOCK TABLES `pesertas` WRITE;
/*!40000 ALTER TABLE `pesertas` DISABLE KEYS */;
INSERT INTO `pesertas` VALUES (6,'001',2,'Arif Amrullah','251001','$2b$10$SiMjmMPC1QSXBnLKnNHEyeTqidAvWsU43ju/Mb8dTnLSVz.HdCeWO',NULL,'2002-02-15',NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-05 09:00:41',NULL),(8,'002',2,'Sigit Budiarto','251002','$2b$10$vX7/1Yturii2RPSc4Y9Xpekgz3rzYs7waQY16T5MSd.2CdgCOB7Ga',NULL,'2001-01-03',NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-05 09:03:24',NULL),(9,'003',2,'Hamsah B Idris','251003','$2b$10$ZEtrdeEbKZvu5ZcDp25Yz.bJ7B6zs758RfCGjEMYeeEYSK87lAxGm',NULL,'2004-11-09',NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-05 09:08:54',NULL),(10,'004',2,'Idi Amin','251004','$2b$10$sWaW635y0uA6ZbWyaUsJ.Om6MOsorcFNzSqb/a0yH41n/V2yIvCrq',NULL,'2006-10-09',NULL,NULL,NULL,0,NULL,NULL,NULL,'2026-01-05 13:17:13',NULL),(17,'901002',9,'deni sumargo','264901002','$2b$10$NsBxcxpAwrV8DfhX8UYJEOIPab2V6PY.CwOuUnQDc7qO1k4Ltn9UC','L','2000-02-01','0853241519000','deny@iainkendari.ac.id',NULL,0,NULL,NULL,NULL,'2026-01-13 04:05:30','2026-01-14 05:58:16'),(18,'901001',9,'enceng gondok','264901001','$2b$10$fb34cnY4Vw4zYW73.oX6s.EC54DtRG9YVVnTk.DTTB56bYFvn2mUm','L','2000-01-15','0853241519876','gondok@iainkendari.ac.id',NULL,0,NULL,NULL,NULL,'2026-01-13 04:06:13',NULL),(19,'0001',11,'Mimi Cantik','2650001','$2b$10$wRmviC1M2gSQapUHpwpeFOcBgCw2ReBUXmMto0zw8uhmju.Fbs32u','P','2020-01-01','085331019999','mimicanti@gmail.com',NULL,1,'2026-01-30 08:28:25',NULL,NULL,'2026-01-16 19:01:14','2026-01-30 08:28:25'),(20,'0002',11,'Apath Endut','2650002','$2b$10$PtcHFpCDpS6zSW3g.A7L0ukuOhlG10EKu6YZROdQFt.gQpvp5ed1K','L','2017-08-17','085331009999','apathendut@gmail.com',NULL,0,NULL,NULL,NULL,'2026-01-16 19:02:06','2026-01-16 19:04:58'),(22,'0003',11,'Echa Manis','2650003','$2b$10$qWA48NOAm0fIk00ssPVacOb3itaGUgh/Kaq3weY0tFckbadyUHM/G','P','2011-08-17','085331009999','echamanis@gmail.com',NULL,0,NULL,NULL,NULL,'2026-01-16 19:06:22',NULL),(186,'001-04-001',7,'Al Fath Sanjaya','263-001-04-001','$2b$10$BisQBVcFhNfQ6vjHPBKPSOD0tEzNK2bpI7HNzuP3MpfEvnTQdK8/.','L','2019-01-31','085331019999','fath@gmail.com',NULL,0,'2026-04-08 06:00:02',NULL,'8d8730a1-5565-4b3b-be52-4377d54449d4','2026-02-25 05:45:53','2026-04-08 06:00:02'),(187,'001-04-002',7,'Arumi Khairunnisa','263-001-04-002','$2b$10$ql0BNyNUA8RXVv5CuoJl5uEnINaAsdEMCRz2Uofl8gBTlYd/4TWDW','P','2019-01-31','085331084932','arumi@gmail.com',NULL,0,'2026-04-08 06:01:59',NULL,'8d8730a1-5565-4b3b-be52-4377d54449d4','2026-02-25 05:45:53','2026-04-08 06:01:59'),(188,'001-04-003',7,'Aleesya Salsabila','263-001-04-003','$2b$10$sVfugfgMsdl8/c5FC.50HOKlP1YHnlsROQH8vrTF/l7Z9TZakcW3K','P','2019-01-31','085331098233','eca@gmail.com',NULL,1,'2026-04-08 06:03:47','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg4LCJ1c2VyX25hbWUiOiIyNjMtMDAxLTA0LTAwMyIsIm5hbWUiOiJBbGVlc3lhIFNhbHNhYmlsYSIsImVtYWlsIjoiZWNhQGdtYWlsLmNvbSIsInJvbGVzIjpbInBlc2VydGEiXSwiaWF0IjoxNzc1NTk5NDI3LCJleHAiOjE3NzYxMTc4Mjd9.A_Z6bkOW63DbpGzCnn_NBeuLnveNlQWuP80s0-zlj9M','8d8730a1-5565-4b3b-be52-4377d54449d4','2026-02-25 05:45:53','2026-04-08 06:03:47'),(189,'001-04-004',7,'Al Insan Mubarak','263-001-04-004','$2b$10$Jc01I/qZKFZZVf1sTQg38.IF43ar6dbDDcAqevGUO9wsg.lvy9crO','L','2019-01-31','085309872098','incan@gmail.com',NULL,0,'2026-04-07 19:24:19',NULL,'8d8730a1-5565-4b3b-be52-4377d54449d4','2026-02-25 05:45:54','2026-04-07 19:24:19'),(190,'001-04-005',7,'Arofat','263-001-04-005','$2b$10$QWwzpIrjpETWpbE8xMvWcOffhb9tf/mmpLkqwK7k8/HcrRT76FxAG','L','2019-01-31','085312736400','arofat@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:54',NULL),(191,'001-04-006',7,'Geran','263-001-04-006','$2b$10$ZyaZKEreWYZC1GPLLxLv0eTLhTPmJquxAFehkBhV116zofswZomwO','L','2019-01-31','085398443902','geran@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:54',NULL),(192,'001-04-007',7,'Rifat','263-001-04-007','$2b$10$u1TTgKiUIZy6FdkN1N8Jpe3mW5TOs/cXbqHWyiPA6zp2n96CB4tem','L','2019-01-31','085384756333','rifat@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:54',NULL),(193,'001-04-008',7,'Haris','263-001-04-008','$2b$10$ZrBuY1x3Y8DIniLY7nfzweeBM7w1P45MskdqIMNthloaarMoNDOE2','L','2019-01-31','085309389099','haris@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:54',NULL),(194,'001-04-009',7,'Fatimah','263-001-04-009','$2b$10$8CH1rQGj5zwtPfy5Ka3gtOO2iRXknUo.8NyuHy2ntIBr4Rnm.cbuy','P','2019-01-31','085354637298','fatimah@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:54',NULL),(195,'001-04-010',7,'Abdullah','263-001-04-010','$2b$10$Rl8yIWG.0QSuYsBgrfk8fOOmTcgirBGxmu22VRfOFvyRX9v1MQ1M6','L','2019-01-31','085343526766','abdullah@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(196,'001-04-011',7,'Salsabila','263-001-04-011','$2b$10$TEXeYUvlPiPMtKP/bXmmA.IKnLEqT82F5oHZ35vHvKVYA2J7ThDVq','P','2019-01-31','085311117777','salsabila@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(197,'001-04-012',7,'Hana','263-001-04-012','$2b$10$JvuG1u.EiFsd6/INhC6vqu0AQ/F1LA7sY2Hp3xXd50V7jKl/uffOy','P','2019-01-31','085387678788','hana@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(198,'001-04-013',7,'Soroya','263-001-04-013','$2b$10$ZwaP0XRo2J0vsPmV5nITxe.bNkGpUKaJEBwZorknUqc.5I1HgNWFC','P','2019-01-31','085309098978','soroya@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(199,'001-04-014',7,'Ubaid','263-001-04-014','$2b$10$QMkvoVPM5FMBAYT4xtvA/O46v/YfVpaNuPt0NNaDveorqyEDYJb7G','L','2019-01-31','085334565657','ubaid@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(200,'001-04-015',7,'Ilo','263-001-04-015','$2b$10$T/eJ9ofaw/.cw0x4KeMHUurQRfj.oiTPhmtK35MkqXFssmlVgbhCK','P','2019-01-31','085387654321','ilo@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL),(201,'001-04-016',7,'Tufail','263-001-04-016','$2b$10$DHjMT6yKITS4zhIhKhS4J.c477dX6UKa40LuOueYiKpdhhFgHTy/q','L','2019-01-31','085367898877','tufail@gmail.com',NULL,0,NULL,NULL,NULL,'2026-02-25 05:45:55',NULL);
/*!40000 ALTER TABLE `pesertas` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `pilihan_soal_pesertas`
--

LOCK TABLES `pilihan_soal_pesertas` WRITE;
/*!40000 ALTER TABLE `pilihan_soal_pesertas` DISABLE KEYS */;
/*!40000 ALTER TABLE `pilihan_soal_pesertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reschedules`
--

DROP TABLE IF EXISTS `reschedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reschedules` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `media_path_id` bigint unsigned DEFAULT NULL,
  `peserta_seleksi_id` bigint unsigned NOT NULL,
  `peserta_id` bigint unsigned NOT NULL,
  `alasan` text NOT NULL,
  `status` enum('proses','terima','tolak') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'proses',
  `verified_user_id` bigint unsigned DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL,
  `catatan_verifikasi` text,
  `is_kirim` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reschedules_unique` (`peserta_seleksi_id`),
  UNIQUE KEY `reschedules_unique_1` (`peserta_id`),
  KEY `user_id` (`verified_user_id`),
  KEY `reschedulles_media_paths_FK` (`media_path_id`),
  KEY `idx_peserta_seleksi_id` (`peserta_seleksi_id`),
  CONSTRAINT `reschedules_ibfk_1` FOREIGN KEY (`peserta_seleksi_id`) REFERENCES `peserta_seleksis` (`id`),
  CONSTRAINT `reschedules_ibfk_2` FOREIGN KEY (`verified_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reschedules_pesertas_FK` FOREIGN KEY (`peserta_id`) REFERENCES `pesertas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reschedulles_media_paths_FK` FOREIGN KEY (`media_path_id`) REFERENCES `media_paths` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reschedules`
--

LOCK TABLES `reschedules` WRITE;
/*!40000 ALTER TABLE `reschedules` DISABLE KEYS */;
INSERT INTO `reschedules` VALUES (46,110,60,188,'sangat tidak efektif','terima',NULL,NULL,NULL,1,'2026-03-30 11:18:18','2026-03-30 11:26:06');
/*!40000 ALTER TABLE `reschedules` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',NULL,NULL),(2,'pengguna',NULL,NULL),(3,'peserta','2025-12-31 21:49:30',NULL),(4,'pimpinan','2025-12-31 21:49:50',NULL),(8,'keuangan','2026-01-14 12:15:04','2026-01-14 12:15:46');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

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
  `waktu_mulai` date DEFAULT NULL,
  `waktu_selesai` date DEFAULT NULL,
  `reschedule_mulai` date DEFAULT NULL,
  `reschedule_selesai` date DEFAULT NULL,
  `wajib_validasi_foto` tinyint(1) NOT NULL DEFAULT '1',
  `prefix_app` int NOT NULL,
  `keterangan` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seleksi_unique_1` (`prefix_app`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seleksis`
--

LOCK TABLES `seleksis` WRITE;
/*!40000 ALTER TABLE `seleksis` DISABLE KEYS */;
INSERT INTO `seleksis` VALUES (2,2025,1,'seleksi mahasiswa baru jalur Mandiri Lokal','2025-12-31','2025-12-31','2025-12-31','2025-12-31',1,251,NULL,'2026-01-01 20:36:03',NULL),(3,2026,1,'Seleksi masuk CPNS','2026-01-01','2026-01-01','2026-01-01','2026-01-01',1,261,'seleksi cpns percobaan','2026-01-02 20:32:59','2026-01-02 20:33:47'),(4,2025,2,'Seleksi Jalur RPL Tahun 2025','2025-11-01','2025-11-20','2025-11-01','2025-11-20',1,252,NULL,'2026-01-04 13:11:41',NULL),(6,2026,2,'Seleksi SPAN PTKIN Tahun 2026','2026-02-01','2026-03-20','2026-02-01','2026-03-20',1,262,'<p>mantapmieeee</p><p>&nbsp;<img style=\"width: 50%;\" src=\"http://127.0.0.1:3000/api/media-path/file/9d5cdd5b6c82ad2db16763280ee1842c167566b4bcc74075ac8498db8b7b2781\"></p>','2026-01-04 13:13:29','2026-03-31 20:29:18'),(7,2026,3,'SELEKSI UM PTKIN TAHUN 2026','2026-03-07','2026-05-08','2026-03-07','2026-03-31',1,263,'<p>Jalur ujian masuk perguruan tinggi nasional kementerian agama RI</p><p><img style=\"width: 25%;\" src=\"http://127.0.0.1:3000/api/media-path/file/fb05b08031a46cb3fda9b0570a0a5dc3582504ca576265111c4e95fb666cc7ab\"><br></p>','2026-01-04 13:13:47','2026-04-07 15:21:34'),(9,2026,4,'Seleksi Penerimaan PPPK IAIN Kendari','2026-01-11','2026-01-14','2026-01-11','2026-01-14',1,264,'seleksi PPPK','2026-01-11 11:46:30',NULL),(11,2026,5,'Seleksi Master Chef Tahun 2026','2026-01-14','2026-01-16','2026-01-14','2026-01-16',1,265,NULL,'2026-01-14 13:57:29','2026-01-16 05:31:03');
/*!40000 ALTER TABLE `seleksis` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `soal_media_paths`
--

LOCK TABLES `soal_media_paths` WRITE;
/*!40000 ALTER TABLE `soal_media_paths` DISABLE KEYS */;
/*!40000 ALTER TABLE `soal_media_paths` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soal_seleksis`
--

LOCK TABLES `soal_seleksis` WRITE;
/*!40000 ALTER TABLE `soal_seleksis` DISABLE KEYS */;
INSERT INTO `soal_seleksis` VALUES (14,6,11,'2026-01-28 07:47:09',NULL),(15,7,11,'2026-01-28 07:47:12',NULL),(16,8,11,'2026-01-28 07:47:17',NULL),(17,9,11,'2026-01-28 07:47:21',NULL),(19,12,11,'2026-01-28 07:47:30',NULL),(20,13,11,'2026-01-28 07:47:35',NULL),(21,14,11,'2026-01-28 07:47:38',NULL),(22,15,11,'2026-01-28 07:47:42',NULL),(23,16,11,'2026-01-28 07:47:46',NULL),(24,12,7,NULL,NULL),(25,9,7,NULL,NULL),(29,8,7,NULL,NULL),(30,7,7,NULL,NULL),(31,6,7,NULL,NULL),(32,16,7,NULL,NULL),(33,15,7,NULL,NULL),(34,14,7,NULL,NULL),(35,13,7,NULL,NULL);
/*!40000 ALTER TABLE `soal_seleksis` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,11,2,'2025-12-31 21:01:54',NULL),(2,11,1,'2025-12-31 21:01:54',NULL),(3,14,2,'2025-12-31 21:33:47',NULL),(4,1,1,'2026-01-01 06:51:35',NULL),(11,16,2,'2026-01-02 20:20:38',NULL),(12,16,4,'2026-01-02 20:29:19','2026-01-02 20:30:10'),(14,18,2,'2026-01-11 11:27:20',NULL),(15,1,4,'2026-01-11 11:37:06','2026-01-11 11:38:01'),(18,1,2,'2026-01-11 11:38:41',NULL),(20,21,2,'2026-01-14 12:10:09',NULL),(24,5,2,'2026-01-16 05:27:33',NULL),(26,7,2,'2026-01-16 19:21:00',NULL),(27,6,2,'2026-01-25 10:36:45',NULL);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'tommy@iainkendari.ac.id','Tommy Irawan Patra','$2b$10$Zmq2.IOMNsw.49N8gzGuZuq9TgOlXJZCNioJ9OoO8Z83vhtDzmzVK',NULL,NULL),(3,'admin@iainkendari.ac.id','Admin System','$2b$10$6HLZexLYJhkHIyBdgbGN3eEgDc8fzv3K7xuUvfzKgE/xZld5ZULIi',NULL,'2025-12-31 11:36:31'),(5,'alfat@iainkendari.ac.id','Al Fath Sanjaya','$2b$10$OL1bgsEOU1cTLVIfz.ClaOumcS0QfLjUzvRqtuaXyXmAPJ2iSoE3O','2025-12-31 11:15:23',NULL),(6,'aku@iainkendari.ac.id','Amlia Desi Arisanti','$2b$10$fUMEydn90/fhq.nRuozzEuNAEKNHXzSNX8DGuQdIbL2e.GHP4o5pO',NULL,'2026-01-25 10:35:53'),(7,'aleesya@iainkendari.ac.id','Aleesya Salsabila Irawan','$2b$10$DvlH.Rd7zs7CTlMgjiyxA.SLm0uTIkhIyJyR1dd7EHZESCZfEQg9W','2025-12-31 11:21:14',NULL),(8,'arumi@iainkendari.ac.id','Arumi Khaerunnisa','$2b$10$hCxbfJislOFouoKhFvLj.uxmJhVpJB3aJSIsDuVqd.mbyPx2upmPW','2025-12-31 11:43:51',NULL),(11,'insn@iainkendari.ac.id','Al Incang','$2b$10$TYbKClKtsz.rBR4VoFetYOlf7dw77IStyZxaoxqqh3T6qkMVFR5TS','2025-12-31 21:01:54',NULL),(14,'gege@iainkendari.ac.id','Gege Gaming','$2b$10$jVfm1m5vhFUfunYmSsTqIeL9QMXeRmY6Riho6nzbCzQkqrqwu3oJC','2025-12-31 21:33:47',NULL),(16,'adminiiq@gmail.com','Admin IIQ','$2b$10$IGly5Zp.oJCX44z0xS1KVefOgbgulryujOhF6gyWNAK86AL0fH46u','2026-01-02 20:20:38','2026-01-03 06:45:09'),(18,'ecceng@iainkendari.ac.id','Enceng Palsu','$2b$10$45UyaSgKyT8LzwmVlsKUY.VI/ayaFQWc9PwD/hHi56RD7W6uoXIXO','2026-01-11 11:27:20','2026-01-11 11:28:01'),(21,'ramadhan@iainkendari.ac.id','Ramadhan','$2b$10$I18mcTCXfBBxm0tFrDZXDumeTCdUO3H2gdNm.gIjbIAk9QYEzgUYy','2026-01-14 12:10:09',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2026-04-10 15:03:24
