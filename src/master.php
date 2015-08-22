<?php
namespace src;

use classes\Antwort;
use classes\Frage;
use dao\AntwortDao;
use dao\FrageDao;
use DateTime;

session_start();

require_once 'classes/myAutoloader.php';

$action = $_REQUEST['action'];
//$data = $_REQUEST['data'];

/**
 * @return string
 */
function FrageSpeichern() {

    $frage = new Frage(
            null,
            $_REQUEST['FragenText'],
            null,
            new DateTime('now')
    );

    $frageID = FrageDao::insertFrage($frage);


    $antwort1 = new Antwort(null, $_REQUEST['antwort1'], false, $frageID);
    $antwort2 = new Antwort(null, $_REQUEST['antwort2'], false, $frageID);
    $antwort3 = new Antwort(null, $_REQUEST['antwort3'], false, $frageID);
    $antwort4 = new Antwort(null, $_REQUEST['antwort4'], false, $frageID);

    $richtigeAntwort = $_REQUEST['istrichtig'];

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

    if (isset($_REQUEST['rubrik1'])) {
        FrageDao::setFragenRubrik($frageID, 1);
    }
    if (isset($_REQUEST['rubrik2'])) {
        FrageDao::setFragenRubrik($frageID, 2);
    }
    if (isset($_REQUEST['rubrik3'])) {
        FrageDao::setFragenRubrik($frageID, 3);
    }
    if (isset($_REQUEST['rubrik4'])) {
        FrageDao::setFragenRubrik($frageID, 4);
    }
    if (isset($_REQUEST['rubrik5'])) {
        FrageDao::setFragenRubrik($frageID, 5);
    }
    if (isset($_REQUEST['rubrik6'])) {
        FrageDao::setFragenRubrik($frageID, 6);
    }

    return ("alels gut");

}
function getRubrikenIDs(){
    $rubrikIDs = array();
    if (isset($_REQUEST['njBildertest'])){
        $rubrikIDs[]=1;
    }
    if (isset($_REQUEST['njInland'])){
        $rubrikIDs[]=2;
    }
    if (isset($_REQUEST['njAusland'])){
        $rubrikIDs[]=3;
    }
    if (isset($_REQUEST['njWirtschaft'])){
        $rubrikIDs[]=4;
    }
    if (isset($_REQUEST['njKultur'])){
        $rubrikIDs[]=5;
    }
    if (isset($_REQUEST['njSport'])){
        $rubrikIDs[]=6;
    }

    return $rubrikIDs;
}



function getAnzahlDerFragen(){
    $rubrikIDs = getRubrikenIDs();
    $fragenIdArray = FrageDao::getAllFragenIDsByRubrikID($rubrikIDs);
    $length =  count($fragenIdArray);
    return $length;
}

function startQuiz(){
    $rubrikIDs = $_REQUEST['njCategory'];
    $fragenIDs = FrageDao::getAllFragenIDsByRubrikID($rubrikIDs);
    $fixedIDs =fixArray($fragenIDs);
    $fragenSets = FrageDao::getFragenWithAntwortenByIdArray($fixedIDs);
    $_SESSION['fragenSets']=serialize($fragenSets);
    $_SESSION['fragenNr']=0;
    $_SESSION['richtigeAntworten']=0;
    return "okok";
}

function fixArray($array){
    $result = array();
    foreach ($array as $key => $value) {
        $result[]=$value['frage_id'];
    }
    return $result;

}


function checkAntwort(){
    $fragen = unserialize($_SESSION['fragenSets']);
    $frageNr = $_SESSION['fragenNr'];
    $antwortNr = $_REQUEST['answerNr'];
    $test =  $fragen[$frageNr]->getAntworten();
    $isTrue = $test[$antwortNr]->getIstRichtig();
    $_SESSION['fragenNr']++;
    addPoints($isTrue);
    return $isTrue;
}


function addPoints($isRight){
    if ($isRight==1){
        $_SESSION['richtigeAntworten']++;
    }
}

function getAnswers(){
    $fragen = unserialize($_SESSION['fragenSets']);
    $frageNr = $_SESSION['fragenNr'];
    return  $fragen[$frageNr]->getAnswerTruthList();
}

$test= 1;
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

