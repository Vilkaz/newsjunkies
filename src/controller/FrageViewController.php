<?php
/**
 * Created by IntelliJ IDEA.
 * User: Vilkaz
 * Date: 29.08.2015
 * Time: 16:24
 */

namespace controller;
use classes\Frage;



class FrageViewController {

    /**
     * @return Frage
     */
    public static function getFrage(){
        $fragen = unserialize($_SESSION['fragenSets']);
        $frageNr = $_SESSION['fragenNr'];
        return $fragen[$frageNr];
    }
} 