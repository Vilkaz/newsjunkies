<?php
namespace classes;
/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:            
 */
 
class Antwort {
    private $id;
    private $text;
    private $istRichtig;
    private $frageID;
    private $rubrik;
    public function __construct($id, $text, $istRichtig, $frageID) {
        $this->setId($id);
        $this->setText($text);
        $this->setIstRichtig($istRichtig);
        $this->setFrageID($frageID);

    }




    //region getter and setter


    /**
       * @return mixed
       */
      public function getRubrik() {
          return $this->rubrik;
      }

      /**
       * @param mixed $rubrik
       */
      public function setRubrik($rubrik) {
          $this->rubrik = $rubrik;
      }


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
      public function getIstRichtig() {
          return $this->istRichtig;
      }

      /**
       * @param mixed $istRichtig
       */
      public function setIstRichtig($istRichtig) {
          $this->istRichtig = $istRichtig;
      }

      /**
       * @return mixed
       */
      public function getFrageID() {
          return $this->frageID;
      }

      /**
       * @param mixed $frageID
       */
      public function setFrageID($frageID) {
          $this->frageID = $frageID;
      }




    //endregion getter and setter
}
?>