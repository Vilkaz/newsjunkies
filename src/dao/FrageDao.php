<?php
namespace dao;

use classes\Frage;
use classes\FragenRunde;
use classes\MyPDO;
use PDO;

/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:
 */
class FrageDao
{

    /**
     * @param Frage $frage
     * @return string
     */

    public static function insertFrage($frage)
    {
        $db = MyPDO::getInstance();

        $db->query('insert into frage(text, media_id, date_value)
                    VALUES (:text, :media_id, :date_value) ');
        /** @var Frage $frage */
        $db->bindVal(':text', $frage->getText());
        $db->bindVal(':media_id', $frage->getMediaId());
        $db->bindVal(':date_value', $frage->getDateValue()->getTimestamp());
        $db->execute();
        return $db->lastInsertId();
    }

    public static function getFrageByID($id)
    {
        $db = MyPDO::getInstance();
        $db->query('select * from frage WHERE id=' . $id);
        $result = $db->single();
        return new Frage($result['id'], $result['text'], $result['media_id'], $result['date_value']);
    }

    public static function setFragenRubrik($fragenid, $rubrikid)
    {
        $db = MyPDO::getInstance();
        $db->query('insert into fragen_rubriken(frage_id, rubrik_id) VALUES (:frage_id, :rubrik_id)');
        $db->bindVal(':frage_id', $fragenid);
        $db->bindVal(':rubrik_id', $rubrikid);
        $db->execute();
    }

    public static function getAllFragenIDsByRubrikID($rubrikID)
    {
        $db = MyPDO::getInstance();
        $db->query('SELECT frage_id from fragen_rubriken where rubrik_id=:rubrik_id');
        $db->bindVal(':rubrik_id', $rubrikID,PDO::PARAM_INT);
        return $db->resultset();
    }

    public static function getFragenWithAntwortenByIdArray($idArray)
    {
        $db = MyPDO::getInstance();
        $result = array();
        foreach ($idArray as $id) {
            $frage = FrageDao::getFrageByID($id);
            $antworten = AntwortDao::getAntwortenToFrageId($id);
            $result[] = new FragenRunde($frage, $antworten);
        }
        return $result;
    }


}