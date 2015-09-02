<div class="container">
    <div class="row">
            <Input id="njAnswer1" class="njQuizAnswerButton"  type="button"
                   value="<?php echo($fragenRunde->getAntworten()[0]->getText()) ?>"
                   onclick="checkResults(0)">
            </Input>
            <Input  id="njAnswer2"class="njQuizAnswerButton"  type="button"
                    value="<?php echo($fragenRunde->getAntworten()[1]->getText()) ?>"
                      onclick="checkResults(1)">
            </Input>
    </div>
    <div class="row">
            <Input id="njAnswer3"class="njQuizAnswerButton"  type="button"
                   value="<?php echo($fragenRunde->getAntworten()[2]->getText()) ?>"
                   onclick="checkResults(2)">
            </Input>

            <Input id="njAnswer4" class="njQuizAnswerButton"  type="button"
                   value="<?php echo($fragenRunde->getAntworten()[3]->getText()) ?>"
                   onclick="checkResults(3)">
            </Input>

    </div>
</div>
