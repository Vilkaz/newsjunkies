<div class="container">
    <div class="row">
        <div class="njAntwortCss col-lg-3 col-md-3 col-sm-4">
            <textarea id="njAnswer1" class="njAdminQuestionarea" rows="4" cols="50">
                <?php $fragenRunde->getAntworten()[0]->getText() ?>
            </textarea>
        </div>
        <div class="njAntwortCss col-lg-2 col-md-2 col-sm-4">
            <textarea id="njAnswer2" class="njAdminQuestionarea" rows="4" cols="50">
                <?php $fragenRunde->getAntworten()[1]->getText() ?>
            </textarea>

        </div>
    </div>
    <div class="row">
        <div class="njAntwortCss col-lg-3 col-md-3 col-sm-4">
            <textarea id="njAnswer3" class="njAdminQuestionarea" rows="4" cols="50">
                <?php $fragenRunde->getAntworten()[2]->getText() ?>
            </textarea>

        </div>
        <div class="njAntwortCss col-lg-2 col-md-2 col-sm-4">
            <textarea id="njAnswer4" class="njAdminQuestionarea" rows="4" cols="50">
                <?php $fragenRunde->getAntworten()[3]->getText() ?>
            </textarea>

        </div>
    </div>
</div>


<?php
require_once('question_category.php');