<?php

namespace src;

use classes\Antwort;
use DateTime;
use classes\Frage;
use classes\FragenRunde;

require_once 'classes/myAutoloader.php';


$test = new Antwort(null, 'erste Antwort', false, 1);
$test2 = new Antwort(null, 'zweite Antwort', false, 2);
$test3 = new Antwort(null, 'dritte Antwort', true, 3);
$test4 = new Antwort(null, 'vierte Antwort', false, 4);

$frage = new Frage(null, 'Frage nummer eins ! ', null, new DateTime());


$fragenRunde1 = new FragenRunde($frage, array($test, $test2, $test3, $test4));


//print_r($fragenRunde1);

//print_r($test);





?>

<form>
    <div class="container">
        <label for="fragenText" class="fragenTextCSS">Frage:</label>
        <input id="fragenText" type="text" name="FragenText"></br>


        <label for="antwort1" class="fragenTextCSS">Antwort1:</label>
        <input id="antwort1" type="text" name="antwort1">
        richtig? <input type="radio" name="istrichtig" value='1'></br>

        <label for="antwort2" class="fragenTextCSS">Antwort2:</label>
        <input id="antwort2" type="text" name="antwort2">
        richtig? <input type="radio" name="istrichtig" value='2'></br>

        <label for="antwort3" class="fragenTextCSS">Antwort3:</label>
        <input id="antwort3" type="text" name="antwort3">
        richtig? <input type="radio" name="istrichtig" value='3'></br>

        <label for="antwort4" class="fragenTextCSS">Antwort4:</label>
        <input id="antwort4" type="text" name="antwort4">
        richtig? <input type="radio" name="istrichtig" value='4'>
        </br>
        <label>Allgemeines</label>
        <input id="" type="checkbox" name="rubrik1" value="Allgemeines">
        </br>
        <label>Inland</label>
        <input type="checkbox" name="rubrik2" value="Inland">
        </br>
        <label>Ausland</label>
        <input type="checkbox" name="rubrik3" value="Ausland">
        </br>
        <label>Wirtschaft</label>
        <input type="checkbox" name="rubrik4" value="Wirtschaft">
        </br>
        <label>Kultur</label>
        <input type="checkbox" name="rubrik5" value="Kultur">
        </br>
        <label>Sport</label>
        <input type="checkbox" name="rubrik6" value="Sport">

        </br>
        <input type="button" value="Frage Speichern" onclick="saveQuestion()">



    </div>
</form>


<?php
echo '
   <script type="text/javascript" src="js/newsjunkies.js"></script>;
   <script type="text/javascript" src="js/jquery.js"></script>';
