<?php

namespace src;

use dao\FrageDao;


require_once 'classes/myAutoloader.php';


echo("php geht");
//print_r($fragenRunde1);

//print_r($test);

try {
    $test = FrageDao::getFrageByID(40);
} catch (\Exception $e) {
    echo $e->getMessage();
}
echo $test->getText();


echo '
   <script type="text/javascript" src="js/newsjunkies.js"></script>;
   <script type="text/javascript" src="js/jquery.js"></script>';
