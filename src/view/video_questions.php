<input id="mediaURL" value="" placeholder="nur video ID, z.B. rp8hvyjZWHs in youtube.com/watch?v=rp8hvyjZWHs">
<input class="btn btn-default" onclick="loadVideoIntoIframe()" type="button" value="load Video">
<input id="textQuestion" value="">
<div id="videoContainer">

</div>
<br>
<?php require_once('empty_answers.php');
require_once('submit_button.php');
?>
<!--serialise geht nicht ... ok .... dann halt so, ist spät.-->
<input id="qtype" type="hidden" value="video">