<?php require_once('frageText_FragerundeTemplate.php'); ?>
<br><br>
<audio id="audioPlayer" controls>
    <source src="<?php echo($media->getMediaURL())?>" type="audio/mpeg" />
    <a href="http://www.w3schools.com/html/horse.mp3">horse</a>
</audio>
<br>
<br>

<?php require_once('filled_questions.php');
?>

<div id="countdown"></div>


