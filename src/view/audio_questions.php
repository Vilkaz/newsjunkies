<input id="mediaURL" value="" style="width: 60%" placeholder="audio URL zb www.abc.de/1.mp3" onchange="playNewURL()">
<audio id="audioPlayer" controls>
    <source src="http://www.noiseaddicts.com/samples_1w72b820/2553.mp3" type="audio/mpeg" />
    <a href="http://www.w3schools.com/html/horse.mp3">horse</a>
</audio>
<input id="textQuestion" value="">
<div id="videoContainer">

</div>
<br>
    <?php require_once('empty_answers.php');
    require_once('submit_button.php');
    ?>

<!--serialise geht nicht ... ok .... dann halt so, ist spät.-->
<input id="qtype" type="hidden" value="audio">