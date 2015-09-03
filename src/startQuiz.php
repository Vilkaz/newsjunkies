<?php
namespace src;

use classes\Antwort;
use classes\Frage;
use classes\FragenRunde;
use classes\Media;
use dao\FrageDao;
use dao\MediaDAO;

require_once 'classes/myAutoloader.php';
session_start();

require_once('view/main_header.php');

if (!isset($_SESSION['quizGestartet']) || ($_SESSION['quizGestartet']) == 'NEW') {
    startQuiz();
}


?>
  <div id="quiz2">
  <a href="quiz2.php">
  <img src="img/news-junkies_logo.png" width="100" height="50" style="margin-left: 50px">
  </a>

    <div id="njMainContainer">
    <?php

            /** @var FragenRunde $fragenRunde */
            $fragenRunde = getFragenRunde();

            /** @var Frage $frage */
            $frage = $fragenRunde->getFrage();

            $mediaID = $fragenRunde->getFrage()->getMediaId();
            $media   = MediaDAO::getMediaByID($mediaID);

                if ($media->getType()==null){
                    $media->setType('text');
                }
            require_once(getViewByMedia($media));
?>
    </div>
</div>



    </body>
    </html>
<?php
function startQuiz() {
    $rubrikID                      = $_REQUEST['njCategory'];
    $fragenIDs                     = FrageDao::getAllFragenIDsByRubrikID($rubrikID);
    $fixedIDs                      = fixArray($fragenIDs);
    $fragenSets                    = FrageDao::getFragenWithAntwortenByIdArray($fixedIDs);
    $_SESSION['fragenSets']        = serialize($fragenSets);
    $_SESSION['fragenNr']          = 0;
    $_SESSION['richtigeAntworten'] = 0;
    $_SESSION['phase']             = 'frage_view';
    $_SESSION['quizGestartet']     = 'ON';

}

function quizFinished() {
    $fragen  = unserialize($_SESSION['fragenSets']);
    $frageNr = $_SESSION['fragenNr'];
    echo "menge der Fragen" . sizeof($fragen);
    echo "Frage nr " . $frageNr;
    if (sizeof($fragen) <=  $frageNr){
        echo"SEITEN WECHSEL!";
        header('Location: quizEnd.php');
    }
}


function fixArray($array) {
    $result = array();
    foreach ($array as $key => $value) {
        $result[] = $value['frage_id'];
    }

    return $result;
}

function getFragenRunde() {
    $frageNr = $_SESSION['fragenNr'];
    $fragen  = unserialize($_SESSION['fragenSets']);

    return $fragen[$frageNr];
}

/**
 * @param Media $media
 *
 * @return string
 */
function getViewByMedia($media) {
    return 'view2/' . $media->getType() . '_FragerundeTemplate.php';
}

