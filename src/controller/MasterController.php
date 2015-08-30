<?php
/**
 * Created by IntelliJ IDEA.
 * User: Vilkaz
 * Date: 30.08.2015
 * Time: 22:53
 */

namespace controller;


class MasterController {

    /**
     * @return string
     */
    public static function getGamephase(){
        if (!isset($_SESSION['phase'])){
            $_SESSION['phase']='selectMenu';
        }
        return $_SESSION['phase'];
    }

} 