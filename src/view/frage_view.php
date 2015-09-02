<?php
/**
 * Created by IntelliJ IDEA.
 * User: Vilkaz
 * Date: 29.08.2015
 * Time: 16:19
 */


use classes\Frage;
use classes\FragenRunde;
use controller\FrageViewController;
use dao\MediaDAO;

require_once ('classes/myAutoloader.php');

/** @var FragenRunde $fragenRunde */
//$fragenRunde = FrageViewController::getFrage();

$fragen = unserialize($_SESSION['fragenSets']);
$frageNr = $_SESSION['fragenNr'];
$fragenRunde =  $fragen[$frageNr];


/** mal wieder sieht man,l Mediaid war zu wenig, wir brauchen Media objekt :(  */
$mediaID = $fragenRunde->getFrage()->getMediaId();
$media = MediaDAO::getMediaByID($mediaID);


$filename = $media->getType().'_FragerundeTemplate.php';

require_once $filename;



