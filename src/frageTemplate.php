<?php
namespace src;

use classes\FragenRunde;

require_once 'classes/myAutoloader.php';

session_start();

$fragen = unserialize($_SESSION['fragenSets']);

$frageNr = $_SESSION['fragenNr'];

$rightAnswers  = $_SESSION['richtigeAntworten'];

if ($frageNr < sizeof($fragen)) {
    echo('<div> <div  class="njAllgemeinCounter">Frage nr ' . ($frageNr+1) . '</div><div id="njRichtigeAntwortenCounter" class="njAllgemeinCounter">richtige Antworten soweit : '.$rightAnswers.'</div> </div><br>');
    showFrage($fragen[$frageNr]);
} else{
    finishGame();
}


/**@parameter FragenRunde $fragenSet */
function showFrage($fragenSet)
{
    echo(showPicture($fragenSet->getFrage()));
    echo('<div id="njFragenId" > ' . $fragenSet->getFrage()->getText() . '</div>');
    showAnswers($fragenSet->getAntworten());

}

function showAnswers($answers){

    echo ('<input  id="njAnswer1" class="njAntwortCss" type="button" onclick="checkAnswer(0)" value="'.$answers[0]->getText().'">');
    echo ('<input  id="njAnswer2" class="njAntwortCss" type="button" onclick="checkAnswer(1)" value="'.$answers[1]->getText().'">');
    echo("<br>");
    echo ('<input  id="njAnswer3" class="njAntwortCss" type="button" onclick="checkAnswer(2)" value="'.$answers[2]->getText().'">');
    echo ('<input  id="njAnswer4" class="njAntwortCss" type="button" onclick="checkAnswer(3)" value="'.$answers[3]->getText().'">');
}


function showPicture($frage){
    if ($frage->getMediaId()!==null){
        return '<img src="img/'.$frage->getMediaId().'.png">';
    }
    return "";
}


function  finishGame(){
    echo("<div id='nsGameOverTextField'>");
    echo('<div class="njAfterGame"> Vielen dank dass Sie an unserem Spiel teilgenommen haben !</div><br>');
    echo('<div> Sie haben in dieser Runde '.$_SESSION['richtigeAntworten'].' Punkte verdient !  </div><br>');
    echo('<div> Probieren Sie doch mal eine andere Kategorie !  </div><br>');
    echo('<div> (In der Vollversion könnten Sie jetzt die Beiträge zu den Fragen sehen,  </div><br>');
    echo('<div> Sowohl Ihren Ranking in der Highscoreliste und gewiss noch vieles mehr ! </div><br>');
    echo('<input id="njPlayAgainBtn" type="button" value="egal ! nochmal spielen!" onclick="njPlayAgain()"><br>');
    echo("</div>");
}