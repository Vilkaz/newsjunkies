<?php
namespace src;

use classes\Frage;
use classes\FragenRunde;
use classes\Media;
use dao\MediaDAO;

require_once 'classes/myAutoloader.php';

session_start();

// WTF hab ich hier gemacht -.- scheisse .... Hackaton spagetthi code :((
?>
    <input id="audioPlayed" value="false"
           type="hidden"> <!-- wieder quick and dirty ... fix it damit dersound nicht zweimal spielt -->
    <div id="audioDIV">
    </div>
<?php

$fragen = unserialize($_SESSION['fragenSets']);
$frageNr = $_SESSION['fragenNr'];
$_SESSION['fragenNr']++;

$rightAnswers = $_SESSION['richtigeAntworten'];

echo '<script>
      progress(15, 15, $("#progressBar"));
      </script>';

if ($frageNr < sizeof($fragen)) {
    /** hier sind die variablen, die man zum schluss ausgeben sollte */
    //echo('<div> <div  class="njAllgemeinCounter">Frage nr ' . ($frageNr+1) . '</div><div id="njRichtigeAntwortenCounter" class="njAllgemeinCounter">richtige Antworten soweit : '.$rightAnswers.'</div> </div>');
    echo '<br><div id="progressBar" data-run=true><div></div></div>';
    showQuestion($fragen[$frageNr]);
    echo '<div id="countdown"></div>';

} else {
    finishGame();
}


/**@parameter FragenRunde $fragenSet */
function showQuestion($fragenSet)
{
    /** @var FragenRunde $fragenSet */
    echo(showMedia($fragenSet->getFrage()));
    echo('<div id="njFragenId" > ' . $fragenSet->getFrage()->getText() . '</div>');
    showAnswers($fragenSet);

}


/**
 * @param FragenRunde$fragenSet
 */
function showAnswers($fragenSet)
{
    $answers = $fragenSet->getAntworten();
    require_once('view/answers.php');
}

/** hier hat man gemerkt, dass das model schlecht ist,
 * anstadt nur mediaID brauchte man das unterobjekt "media" in der klasse
 * "Frage" so müssen wir wieder hackseln*/
function showMedia($frage)
{
    /** @var Frage $frage */
    if ($frage->getMediaId() !== null) {
        /** @var Media $media */
        $media = MediaDAO::getMediaByID($frage->getMediaId());
        return getMediaEmbedCode($media);
    }
    return "";
}

/**@parameter Media $media */
function getMediaEmbedCode($media){
    /** @var Media $media */
    switch($media->getType()){
        case ('img'):
            return '<img src="' . $media->getMediaURL() . '">';
            break;
        case ('video'):
            return '<iframe width="560" height="315"
            src="'.$media->getMediaURL().'"
             frameborder="0"></iframe>';
            break;
        case ('audio'):
            return '<audio id="audioPlayer" controls autoplay>
            <source src="'.$media->getMediaURL().'"
             type="audio/mpeg">
            </audio>';
        break;
    }
}



/** @parameter Frage $frage */
function getMediaByID($id)
{
    $media = MediaDAO::getMediaByID($id);
}

function  finishGame()
{
    echo("<div id='nsGameOverTextField'>");
    echo('<div class="njAfterGame"> Vielen dank dass Sie an unserem Spiel teilgenommen haben !</div><br>');
    echo('<div> Sie haben in dieser Runde ' . $_SESSION['richtigeAntworten'] . ' Punkte verdient !  </div><br>');
    echo('<div> Probieren Sie doch mal eine andere Kategorie !  </div><br>');
    echo('<div> (In der Vollversion könnten Sie jetzt die Beiträge zu den Fragen sehen,  </div><br>');
    echo('<div> Sowohl Ihren Ranking in der Highscoreliste und gewiss noch vieles mehr ! </div><br>');
    echo('<input id="njPlayAgainBtn" type="button" value="egal ! nochmal spielen!" onclick="njPlayAgain()"><br>');
    echo("</div>");
}