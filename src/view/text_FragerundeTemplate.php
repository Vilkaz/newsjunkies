<input id="textQuestion" value="<?php $fragenRunde->getFrage()->getText() ?>">
<input id="mediaURL" type="hidden" value=""> <!--just to prevent nulls in jquery-->
<br>
<?php require_once('filled_questions.php');
?>

