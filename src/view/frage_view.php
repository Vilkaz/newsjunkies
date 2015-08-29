<?php
/**
 * Created by IntelliJ IDEA.
 * User: Vilkaz
 * Date: 29.08.2015
 * Time: 16:19
 */

use controller\FrageViewController;

require_once '../classes/myAutoloader.php';
session_start();

ECHO"JAJA";

$frage = FrageViewController::getFrage();

var_dump($frage);

