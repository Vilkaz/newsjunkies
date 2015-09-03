<?php
session_start();

use classes\Antwort;
use classes\FragenRunde;

require_once "classes/FragenRunde.php";
require_once "classes/Antwort.php";
require_once "classes/Frage.php";
require_once "classes/myAutoloader.php";


if (isset($_REQUEST['action'])) {
    switch ($_REQUEST['action']) {
        case'getAnswers':
            print(json_encode(getAnswers()));
            break;
        case'checkQuizEnd':
            print(json_encode(checkQuizEnd()));
            break;

    }
}



function checkQuizEnd(){
    $fragen  = unserialize($_SESSION['fragenSets']);
    $frageNr = $_SESSION['fragenNr'];
    if (sizeof($fragen)<=$frageNr){
        return "JA";
    }
    else return "Noep";
}

function getAnswers() {
    $fragen    = unserialize($_SESSION['fragenSets']);
    $frageNr   = $_SESSION['fragenNr'];
    $antwortNr = $_REQUEST['answerNr'];
    /** @var FragenRunde $fragenRunde */
    $fragenRunde      = $fragen[$frageNr];
    $antwortTrueListe = $fragen[$frageNr]->getAnswerTruthList();
    $antworten        = $fragenRunde->getAntworten();
    /** @var Antwort $geklickteAntwort */
    if ($antwortNr!=-1){
        $geklickteAntwort = $antworten[$antwortNr];
          if ($geklickteAntwort->getIstRichtig()) {
              $_SESSION['richtigeAntworten']++;
          }
    }

    $_SESSION['fragenNr']++;


//    $isTrue           = $geklickteAntwort->getIstRichtig();
//    addPoints($isTrue);
//    if ($frageNr > sizeof($fragen)) {
//        $_SESSION['phase'] = 'endQuiz';
//    }
//
//    /** @var FragenRunde $fragenRunde */
//    $fragenRunde = $fragen[--$frageNr];
//
//    return $fragenRunde->getAnswerTruthList();
    return $antwortTrueListe;
}

