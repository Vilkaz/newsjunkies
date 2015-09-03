<?php
namespace src;

use classes\Antwort;
use classes\Frage;
use classes\FragenRunde;
use classes\Media;
use dao\AntwortDao;
use dao\FrageDao;
use dao\MediaDAO;
use DateTime;

session_start();

require_once 'classes/myAutoloader.php';


var_dump($_REQUEST);

$action = $_REQUEST['action'];
//$data = $_REQUEST['data'];

/**
 * @return string
 */
function FrageSpeichern() {

    if ($_REQUEST['qtype'] !== 'text') {
        $media   = new Media(null, $_REQUEST['mediaURL'], $_REQUEST['qtype']);
        $mediaID = MediaDAO::insertMedia($media);
    }
    else {
        $mediaID = null;
    }


    $frage = new Frage(
            null,
            $_REQUEST['questionText'],
            $mediaID,
            new DateTime('now')
    );

    $frageID = FrageDao::insertFrage($frage);

    $antwort1 = new Antwort(null, $_REQUEST['answer1'], false, $frageID);
    $antwort2 = new Antwort(null, $_REQUEST['answer2'], false, $frageID);
    $antwort3 = new Antwort(null, $_REQUEST['answer3'], false, $frageID);
    $antwort4 = new Antwort(null, $_REQUEST['answer4'], false, $frageID);

    $richtigeAntwort = $_REQUEST['njAnswerRadiobutton'];

    switch ($richtigeAntwort) {
        case('1'):
            $antwort1->setIstRichtig(true);
            break;

        case('2'):
            $antwort2->setIstRichtig(true);
            break;

        case('3'):
            $antwort3->setIstRichtig(true);
            break;

        case('4'):
            $antwort4->setIstRichtig(true);
            break;
    }

    AntwortDao::insertAntwort($antwort1);
    AntwortDao::insertAntwort($antwort2);
    AntwortDao::insertAntwort($antwort3);
    AntwortDao::insertAntwort($antwort4);


    FrageDao::setFragenRubrik($frageID, getRubrikID());


    return ("alels gut");

}

function getRubrikenIDs() {
    $rubrikIDs = array();
    if (isset($_REQUEST['njBildertest'])) {
        $rubrikIDs[] = 1;
    }
    if (isset($_REQUEST['njInland'])) {
        $rubrikIDs[] = 2;
    }
    if (isset($_REQUEST['njAusland'])) {
        $rubrikIDs[] = 3;
    }
    if (isset($_REQUEST['njWirtschaft'])) {
        $rubrikIDs[] = 4;
    }
    if (isset($_REQUEST['njKultur'])) {
        $rubrikIDs[] = 5;
    }
    if (isset($_REQUEST['njSport'])) {
        $rubrikIDs[] = 6;
    }

    return $rubrikIDs;
}

function getRubrikID() {
    $rubrik = "";
    switch ($_REQUEST['questionCategory']) {
        case 'picture':
            $rubrik = 1;
            break;
        case 'innland':
            $rubrik = 2;
            break;
        case 'ausland':
            $rubrik = 3;
            break;
        case 'wirtschaft':
            $rubrik = 4;
            break;
        case 'kultur':
            $rubrik = 5;
            break;
        case 'sport':
            $rubrik = 6;
            break;
    }

    return $rubrik;
}


function getAnzahlDerFragen() {
    $rubrikIDs     = getRubrikenIDs();
    $fragenIdArray = FrageDao::getAllFragenIDsByRubrikID($rubrikIDs);
    $length        = count($fragenIdArray);

    return $length;
}

function startQuiz() {
    $rubrikID                      = $_REQUEST['njCategory'];
    $fragenIDs                     = FrageDao::getAllFragenIDsByRubrikID($rubrikID);
    $fixedIDs                      = fixArray($fragenIDs);
    $fragenSets                    = FrageDao::getFragenWithAntwortenByIdArray($fixedIDs);
    $_SESSION['fragenSets']        = serialize($fragenSets);
    $_SESSION['fragenNr']          = 0;
    $_SESSION['richtigeAntworten'] = 0;
    $_SESSION['phase']             = 'frage_view';
    var_dump($_SESSION);

    return "ok";
}

function fixArray($array) {
    $result = array();
    foreach ($array as $key => $value) {
        $result[] = $value['frage_id'];
    }

    return $result;

}


function checkAntwort() {
    $fragen    = unserialize($_SESSION['fragenSets']);
    $frageNr   = $_SESSION['fragenNr'];
    $antwortNr = $_REQUEST['answerNr'];
    $test      = $fragen[$frageNr]->getAntworten();
    $isTrue    = $test[$antwortNr]->getIstRichtig();
    //$_SESSION['fragenNr']++;
    addPoints($isTrue);

    return $isTrue;
}


function addPoints($isRight) {
    if ($isRight == 1) {
        $_SESSION['richtigeAntworten']++;
    }
}

function getAnswers() {
    $fragen    = unserialize($_SESSION['fragenSets']);
    $frageNr   = $_SESSION['fragenNr'];
    $antwortNr = $_REQUEST['answerNr'];
    $test      = $fragen[$frageNr]->getAntworten();
    $isTrue    = $test[$antwortNr]->getIstRichtig();
    addPoints($isTrue);
    if ($frageNr > sizeof($fragen)) {
        $_SESSION['phase'] = 'endQuiz';
    }

    /** @var FragenRunde $fragenRunde */
    $fragenRunde = $fragen[--$frageNr];
    return $fragenRunde->getAnswerTruthList();
}


switch ($action) {
    case ('FrageSpeichern'):
        print(json_encode(FrageSpeichern()));
        break;
    case ("anzahlDerFragen"):
        print(json_encode(getAnzahlDerFragen()));
        break;
    case('startQuiz'):
        $test = json_encode(startQuiz());
        print $test;
        break;
    case('checkAnswer'):
        print(json_encode(checkAntwort()));
        break;
    case('getAnswers'):
        print(json_encode(getAnswers()));
        break;
}

