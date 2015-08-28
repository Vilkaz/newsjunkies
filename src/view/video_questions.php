<input id="videoURL" value="" placeholder="nur video ID, z.B. rp8hvyjZWHs in youtube.com/watch?v=rp8hvyjZWHs">
<input  class="btn btn-default" onclick="loadVideoIntoIframe()" type="button" value="load Video">
<div id="videoContainer">

</div>
<br>
<form>
    <?php require_once('empty_answers.php') ?>
</form>
<input  id="submitQuestion" class="btn btn-default" value="Frage speichern" onclick="saveVideoQuestion()">