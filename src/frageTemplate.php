<?php
namespace src;

use classes\FragenRunde;

require_once 'classes/myAutoloader.php';

session_start();

$fragen = unserialize($_SESSION['fragenSets']);

$frageNr = $_SESSION['fragenNr'];

$rightAnswers  = $_SESSION['richtigeAntworten'];

echo'<script>progress(15, 15, $("#progressBar"))</script>';

    if ($frageNr < sizeof($fragen)) {
        /** hier sind die variablen, die man zum schluss ausgeben sollte */
    //echo('<div> <div  class="njAllgemeinCounter">Frage nr ' . ($frageNr+1) . '</div><div id="njRichtigeAntwortenCounter" class="njAllgemeinCounter">richtige Antworten soweit : '.$rightAnswers.'</div> </div>');
    echo'<br><div id="progressBar" data-run=true><div></div></div>';
        showQuestion($fragen[$frageNr]);
        echo'<div id="countdown"></div>';
} else{
    finishGame();
}


/**@parameter FragenRunde $fragenSet */
function showQuestion($fragenSet)
{
    echo(showMedia($fragenSet->getFrage()));
    echo('<div id="njFragenId" > ' . $fragenSet->getFrage()->getText() . '</div>');
    showAnswers($fragenSet);

}

function showAnswers($fragenSet){
    $answers=$fragenSet->getAntworten();
    require_once('view/answers.php');
}


function showMedia($frage){
    if ($frage->getMediaId()==1){
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