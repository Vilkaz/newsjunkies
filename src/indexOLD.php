<?php
namespace src;

use classes\Frage;

require_once 'classes/myAutoloader.php';
require 'view/main_header.php';
session_start();

?>
<div id="njMainContainer">
    <?php
    require_once 'view/content.php';
    ?>
</div>
</body>
</html>
