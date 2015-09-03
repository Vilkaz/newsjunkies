<?php
namespace src;

use classes\Frage;

require_once 'classes/myAutoloader.php';
session_start();
$_SESSION['quizGestartet'] = 'NEW';
require_once('view/main_header.php');
?>
  <div id="quiz2">
  <img src="img/news-junkies_logo.png" width="100" height="50" style="margin-left: 50px">
    <div id="njMainContainer">
    <?php
    require_once('view2/selectMenu.php');
    ?>

    </div>
</div>



    </body>
    </html>

<?php
function getSite() {
    if (isset($_GET['site'])) {
        switch ($_GET['site']) {
            case'startQuiz':
                break;
            default:
                return 'view/selectMenu';
    }

        return 'selectMenu';
    }
}