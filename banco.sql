/*
SQLyog Community Edition- MySQL GUI v6.05
Host - 5.1.53-community-log : Database - redwine
*********************************************************************
Server version : 5.1.53-community-log
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

create database if not exists `redwine`;

USE `redwine`;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*Table structure for table `vinho` */

DROP TABLE IF EXISTS `vinho`;

CREATE TABLE `vinho` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `price` decimal(6,2) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `nacionalidade` varchar(100) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `safra` decimal(4,0) DEFAULT NULL,
  `uva` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=latin1;

/*Data for the table `vinho` */

insert  into `vinho`(`id`,`name`,`description`,`image`,`price`,`sku`,`nacionalidade`,`tipo`,`safra`,`uva`) values (1,'Marcos James','De coloração rubi com reflexos violáceos, tem aromas frutados, com toque fresco.','img1','88.00','marcos-james','Nacional','tinto','2010','Cabernet Savignon'),(2,'Miolo Cabernet Sauvignon','Vinho de forte coloração, onde no nariz apresenta bouquet intenso.','img2','75.00','miolo','Nacional','tinto','2015','Carmenere'),(3,'Concha y Toro','Ótimo vinho para todas ocasiões','img3','70.00','concha-y-toro','Chile','tinto','2015','Merlot'),(4,'Periquita','Vinho português elaborado com uvas viníferas tintas européias.','img4','95.00','periquita','Portugal','tinto','2014','Cabernet Savignon'),(5,'Valpolicella','Corpo médio, harmonioso, longa persistência.','img5','75.00','valpolicella','Chile','tinto','2015','Merlot'),(6,'Frascatti','Vinho italiano branco, elaborado a partir de uvas viníferas diversas.','img6','120.00','frascatti','Itália','branco','2014','Lambrusco');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
