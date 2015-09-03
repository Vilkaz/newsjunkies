<?php require_once('frageText_FragerundeTemplate.php'); ?>
<br><br>
<img src="<?php echo($media->getMediaURL()) ?>"
<br>
<br>
<?php require_once('progressTimer.php');
echo '<script>
      progress(15, 15, $("#progressBar"));
      </script>'; ?>
<br>
<?php require_once('filled_questions.php');
?>

<div id="countdown"></div>

