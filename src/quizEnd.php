<?php
namespace src;

use classes\Frage;

require_once 'classes/myAutoloader.php';
session_start();
require_once('view/main_header.php');
?>
<div id="quiz2">
    <a href="quiz2.php">
        <img src="img/news-junkies_logo.png" width="100" height="50" style="margin-left: 50px">
    </a>

    <div id="njMainContainer">
        <?php $richtig = $_SESSION['richtigeAntworten'];
                $alle =   sizeof(unserialize($_SESSION['fragenSets']));
        $procent = $richtig/$alle*100;
        ?>
        Sie haben  <?php echo($richtig) ?> Fragen von <?php  echo($alle) ?>richtig beantwortet ! (<?php echo($procent); ?>%)
        <br>

        Somit liegen sie auf heutigem Platz 1 in der gespielten Kategorie.
        <br>

        <form action="quiz2.php">
            <input class="btn btn-default" type="submit" value="nochmal spielen">
        </form>

    </div>
</div>


</body>
</html>

<?php

    $_SESSION['fragenSets']        = null;
    $_SESSION['fragenNr']          = 0;
    $_SESSION['richtigeAntworten'] = 0;
    $_SESSION['phase']             = 'frage_view';
    $_SESSION['quizGestartet']     = 'OFF';
