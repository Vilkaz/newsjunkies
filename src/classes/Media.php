<?php
/**
 * Created by IntelliJ IDEA.
 * User: Vilkaz
 * Date: 28.08.2015
 * Time: 22:02
 */

namespace classes;


class Media {
    /** @var  int */
    private $id;
    /** @var  String */
    private $mediaURL;
    /** @var  String */
    private $type;
    function __construct($id=null, $mediaURL,$type  ){
        $this->id=$id;
        $this->mediaURL=$mediaURL;
        $this->type=$type;
    }








    //region geter and setter

    /**
     * @param String $type
     */
    public function setType($type) {
        $this->type = $type;
    }


    /**
        * @param String $mediaURL
        */
       public function setMediaURL($mediaURL) {
           $this->mediaURL = $mediaURL;
       }



    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }


    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return String
     */
    public function getMediaURL()
    {
        return $this->mediaURL;
    }

    /**
     * @return String
     */
    public function getType()
    {
        return $this->type;
    }



    //endregion
} 