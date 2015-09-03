<div class="container">
    <div class="row">
            <Button id="njAnswer1" class="njQuizAnswerButton"  onclick="checkResults2(0)" >
                   <?php echo($fragenRunde->getAntworten()[0]->getText()) ?>
            </Button>
            <Button  id="njAnswer2" class="njQuizAnswerButton"  type="button"  onclick="checkResults2(1)">
                    <?php echo($fragenRunde->getAntworten()[1]->getText()) ?>
            </Button>
    </div>
    <div class="row">
            <Button id="njAnswer3" class="njQuizAnswerButton"   onclick="checkResults2(2)">
                   <?php echo($fragenRunde->getAntworten()[2]->getText()) ?>
            </Button>

            <Button id="njAnswer4" class="njQuizAnswerButton"  type="button"  onclick="checkResults2(3)">
                   <?php echo($fragenRunde->getAntworten()[3]->getText()) ?>
            </Button>

    </div>
</div>
