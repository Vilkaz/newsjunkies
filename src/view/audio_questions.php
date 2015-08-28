<input id="audioURL" value="" placeholder="audio URL" onchange="playNewURL()">
<audio id="audioPlayer" controls>
    <source src="http://www.w3schools.com/html/horse.ogg" type="audio/ogg" />
    <source src="http://www.w3schools.com/html/horse.mp3" type="audio/mpeg" />
    <a href="http://www.w3schools.com/html/horse.mp3">horse</a>
</audio>
<div id="videoContainer">

</div>
<br>
<form>
    <?php require_once('empty_answers.php') ?>
</form>
<input  id="submitQuestion" class="btn btn-default" value="Frage speichern" onclick="saveVideoQuestion()">