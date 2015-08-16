<?php
namespace dao;

use classes\Antwort;
use classes\FragenRunde;
use classes\MyPDO;

/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:            
 */


class FragenRundeDao {

    /**
     * @param int $fragenID
     * @return string
     */
    public static function getFragenRundeByFragenID($fragenID) {
        $db=MyPDO::getInstance();
        $frage = FrageDao::getFrageByID($fragenID);
        $db->query('select * from antwort WHERE frage_id='.$fragenID);
        $antwortenIDs = $db->resultset();
        $antworten = array();
        foreach ($antwortenIDs as $antwortID) {
            $antworten[] = AntwortDao::getAntwortByID($antwortID);
        }
        $fragenRunde = new FragenRunde($frage, $antworten);
        return $fragenRunde;

    }

    public static function getAntwortByID($id){
        $db=MyPDO::getInstance();
        $db->query('select * from antwort WHERE id='.$id);
        $result = $db->single();
        return new Antwort($result['id'], $result['text'], $result['ist_richtig'], $result['frage_id']);
    }

    public static function allign(){

    }



}