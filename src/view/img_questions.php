<input id="mediaURL" type="text" placeholder="bild URLm z.B. www.abc.de/foto.jpg">
<input class="btn btn-default" onclick="showImg()" type="button" value="load Picture">
<input id="textQuestion" value="">
<div id="imgContainer">

</div>
<br>
    <?php require_once('empty_answers.php') ;
    require_once('submit_button.php');
    ?>

<!--serialise geht nicht ... ok .... dann halt so, ist spät.-->
<input id="qtype" type="hidden" value="img">