<?php
namespace classes;
use DateTime;

/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:            
 */
 
class Frage {
    private $id;
    private $text;
    private $media_id;
    private $date_value;

    public function __construct($id=null, $text, $media_id=null , $date_value) {
        $this->setId($id);
        $this->setText($text);
        $this->setMediaId($media_id);
        $this->setDateValue($date_value);
    }


    //region geter and setter




    /**
     * @return mixed
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id) {
        $this->id = $id;
    }

    /**
     * @return mixed
     */
    public function getText() {
        return $this->text;
    }

    /**
     * @param mixed $text
     */
    public function setText($text) {
        $this->text = $text;
    }

    /**
     * @return mixed
     */
    public function getMediaId() {
        return $this->media_id;
    }

    /**
     * @param mixed $media_id
     */
    public function setMediaId($media_id) {
        $this->media_id = $media_id;
    }

    /**
     * @return Datetime
     */
    public function getDateValue() {
        return $this->date_value;
    }

    /**
     * @param mixed $date_value
     */
    public function setDateValue($date_value) {
        $this->date_value = $date_value;
    }


    //endregion getter and setter
}
?>