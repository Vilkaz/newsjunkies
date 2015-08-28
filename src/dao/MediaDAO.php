<?php
namespace dao;

use classes\Media;
use classes\MyPDO;

/**
 * Erstellung:              6/17/15
 * Autor:                   Vilius Kukanauskas, mydata GmbH
 * Beschreibung:
 */
class MediaDAO
{

    /**
     * @param Media $media
     * @return string
     */
    public static function insertMedia($media)
    {
        $db = MyPDO::getInstance();
        $db->query('insert into media(url, type)
                    VALUES (:url, :type)');
        $db->bindVal(':url', $media->getMediaURL());
        $db->bindVal(':type', $media->getType());
        $db->execute();
        return $db->lastInsertId();
    }

    public static function getMediaByID($id)
    {
        $db = MyPDO::getInstance();
        $db->query('SELECT url, \'type\' from media WHERE id=:id');
        $result = $db->single();
        return new Media($id, $result['url'], $result['type']);

    }

}