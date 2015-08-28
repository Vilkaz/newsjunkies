<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <script type="text/javascript" src="js/jquery.js"></script>
    <script type="text/javascript" src="../libs/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
    <script type="text/javascript" src="js/newsjunkies.js"></script>
    <link type="text/css" rel="stylesheet" href="../css/bootstrap.css">
    <link type="text/css" rel="stylesheet" href="../libs/jquery-ui-1.11.4.custom/jquery-ui.css">
    <link type="text/css" rel="stylesheet" href="../css/style.css">
    <title></title>
</head>
<body>
<div id="njMainContainer">
    <div id="njQuestiontype">
        <h3>Fragentyp</h3>
        <label for="QuestionTypeText">Text</label>
        <input id="QuestionTypeText" type="radio" name="questionType" value="text_question" onchange="createQuestionForEditor('text_question')">
        <label for="QuestionTypeBilder">Bilder</label>
        <input id="QuestionTypeBilder" type="radio" name="questionType" value="text_question" onchange="createQuestionForEditor('img_question')">
        <label for="QuestionTypeVideo">Video</label>
        <input id="QuestionTypeVideo" type="radio" name="questionType" value="video_question" onchange="createQuestionForEditor('video_question')">
        <label for="QuestionTypeAudio">Audio</label>
        <input id="QuestionTypeAudio"  type="radio" name="questionType" value="audio_question" onchange="createQuestionForEditor('audio_question')">
    </div>
    <form  id="njQuestionEditor">

    </form>

</div>



</body>
</html>




