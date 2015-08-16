SET CHARACTER SET 'utf8';

CREATE TABLE IF NOT EXISTS frage (
  id         INT AUTO_INCREMENT NOT NULL,
  text       VARCHAR(255)       NOT NULL,
  media_id   INT,
  date_value DATETIME,
  PRIMARY KEY (id)
)
  ENGINE InnoDB;


CREATE TABLE IF NOT EXISTS antwort (
  id          INT AUTO_INCREMENT NOT NULL,
  text        VARCHAR(255)       NOT NULL,
  ist_richtig BOOLEAN            NOT NULL,
  frage_id    INT                NOT NULL,
  FOREIGN KEY (frage_id) REFERENCES frage (id)
    ON DELETE CASCADE,
  PRIMARY KEY (id)
)
  ENGINE InnoDB;


CREATE TABLE IF NOT EXISTS rubriken (
  id   INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(255)       NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE InnoDB;


CREATE TABLE IF NOT EXISTS media (
  id   INT AUTO_INCREMENT NOT NULL,
  url  VARCHAR(512)       NOT NULL,
  type VARCHAR(16)        NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE InnoDB;

CREATE TABLE IF NOT EXISTS time (
  id   INT AUTO_INCREMENT NOT NULL,
  type VARCHAR(32)        NOT NULL,
  sek  INT                NOT NULL,
  PRIMARY KEY (id)
)
  ENGINE InnoDB;


CREATE TABLE IF NOT EXISTS fragen_rubriken (
  frage_id  INT NOT NULL,
  rubrik_id INT NOT NULL,
  PRIMARY KEY (frage_id, rubrik_id)
)
  ENGINE InnoDB;





