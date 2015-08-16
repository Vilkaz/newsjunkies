<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <script type="text/javascript" src="js/newsjunkies.js"></script>
    <script type="text/javascript" src="js/jquery.js"></script>
    <title></title>
</head>
<body onload="test()">
<?php
$URL = "http://www.tagesschau.de";

$domain = file_get_contents($URL);

echo $domain
?>
</body>
</html>
