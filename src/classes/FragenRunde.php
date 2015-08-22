<?php
namespace classes;
use classes\Frage;


/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:            
 */
 
class FragenRunde {
    /** @var  Frage */
    private $frage;
    /** @var  array() */
    private $antworten;
    public function __construct($frage, $antworten) {
        $this->setFrage($frage);
        $this->setAntworten($antworten);
    }


    public function getAnswerTruthList(){
        $result = array();
        foreach ($this->antworten as $key=>$antwort){
            /** @var Antwort $antwort*/
            $result[$key]=$antwort->getIstRichtig();
        }
        return $result;
    }



    //region getter and setter

    /**
         * @return Frage
         */
        public function getFrage() {
            return $this->frage;
        }

        /**
         * @param Frage $frage
         */
        public function setFrage($frage) {
            $this->frage = $frage;
        }

        /**
         * @return array
         */
        public function getAntworten() {
            return $this->antworten;
        }

        /**
         * @param array $antworten
         */
        public function setAntworten($antworten) {
            $this->antworten = $antworten;
        }


    //endregion getter and setter
}
?>