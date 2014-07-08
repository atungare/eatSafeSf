CREATE DATABASE IF NOT EXISTS inspectionData;

USE inspectionData;

DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS businesses;

CREATE TABLE IF NOT EXISTS inspections (
  business_id INT,
  score INT,
  inspection_date INT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS businesses (
  business_id INT,
  name varchar(255),
  address varchar(255),
  latitude FLOAT,
  longitude FLOAT,
  PRIMARY KEY (business_id)
) ENGINE = InnoDB;
