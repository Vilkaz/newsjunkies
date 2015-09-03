<?php

namespace classes;

use PDO;
use PDOException;

/**
 * User: Vilius Kukanauskas, mydata GmbH
 * Package:
 * Date: 29.12.14
 * Time: 09:47
 *
 */
class MyPDO extends PDO
{
    private $dbh;
    private $error;
    private $stmt;


    private $host = "localhost";
    private $dbname = "newsjunkies";
    private $user = "root";
    private $pass ="km#fexu21";

//mys
//    private $dbname = "newsjunkies";
//    private $user = "root";
//    private $pass ="";


//    private $host = "db580751936.db.1and1.com";
//    private $dbname = "db580751936";
//    private $user = "dbo580751936";
//    private $pass = "N3WsJuNk1eSH4Ck4T0N";

    /** @var myPDO */
    private static $pdo;

    public function __construct()
    {
        // Set DSN
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
        // Set options
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );
        // Create a new PDO instanace
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } // Catch any errors
        catch (PDOException $e) {
            $this->error = $e->getMessage();
        }
    }

    /**
     * @return myPDO
     */
    public static function getInstance()
    {
        if (isset(self::$pdo)) {
            return self::$pdo;
        } else {
            self::$pdo = new myPDO();
            return self::$pdo;
        }
    }


    public static function showInstance()
    {
        var_dump(self::$pdo);
    }

    /** dies war eine kontroll funktion, um zu gucken ob pdo richtig instanziert wurde */
    public function getPDO()
    {
        if (isset($this->dbh)) {
            echo 'dbh ist gesetzt und von typen' . gettype($this->dbh);
            return $this->dbh;
        } else {
            echo 'PDO ist nicht gesetzt';
        }
        return null;
    }

    public function query($query)
    {
        //var_dump($query);
        $this->stmt = $this->dbh->prepare($query);
    }

    public function getStmt($query)
    {
        return $this->dbh->prepare($query);
    }

    /**
     * @param  $param
     * @param $value
     * @param null $type
     */
    public function bindVal($param, $value, $type = null)
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    //$type = PDO::PARAM_
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    public function bindPar($param, $variable, $type = null)
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($variable):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($variable):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($variable):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindParam($param, $variable, $type);
    }

    public function execute()
    {
        return $this->stmt->execute();
    }

    public function resultset()
    {
        $this->execute();
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function single()
    {
        $this->execute();
        return $this->stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function rowCount()
    {
        return $this->stmt->rowCount();
    }

    public function lastInsertId()
    {
        return $this->dbh->lastInsertId();
    }

    /* brauchen wir hier noch nicht.

    public function beginTransaction(){
        return $this->dbh->beginTransaction();
    }

    public function endTransaction(){
        return $this->dbh->commit();
    }

    public function cancelTransaction(){
        return $this->dbh->rollBack();
    }*/
}