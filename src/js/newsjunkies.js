/**
 * Created by vk on 6/18/15.
 */

function saveQuestion() {
    var data = ($('#njQuestionEditor').serialize());
    if (data == "") {
        alert("bitte eine Fragekategorie auswählen");
    } else {
        if (isRightAnswerMarked()) {
            var url = 'master.php?' + data;
            $.get(url, {
                action: 'FrageSpeichern',
                questionText: $('#textQuestion').val(),
                answer1: $('#njAnswer1').val(),  //es ist gleich mitternacht, ich weiss das es scheisse ist ok ? muss fertig werden.
                answer2: $('#njAnswer2').val(),
                answer3: $('#njAnswer3').val(),
                answer4: $('#njAnswer4').val(),
                qtype: $('#qtype').val(),
                mediaURL: $('#mediaURL').val()
            }, function (data) {
                console.log(data);
            }, 'json')
        } else {
            alert("bitte eine Antwort als richtig markieren");
        }

    }

}

function isRightAnswerMarked() {
    var checked = false;
    $.each($('.nsAnswerbuttonsClass'), function () {
        if ($(this).is(":checked")) {
            checked = true;
        }
    });
    return checked;
}

function showNJTimeRange(value) {
    if (value == 0) {
        $('#njTimeRange').text('Aktuelle Woche');
    } else {
        $('#njTimeRange').text(value + ' wochen zurück ab heute (natürlich kann man hier auch konkretes Datum Anzeigen)');
    }
}

function getAnzahlDerFragen() {
    var data = $('#njForm').serialize();
    $.get('master.php?' + data,
        {
            action: 'anzahlDerFragen'
        },
        function (data) {
            console.log(data);
            $('#njAnzahlDerFragen').text(data);
        }, 'json')
}

function startQuiz() {
    var data = $('#njForm').serialize();
    if (data == '') {
        alert('bitte mindestens eine Kategorie auswählen !')
    } else {
        $.get('master.php?' + data,
            {
                action: 'startQuiz',
                category: data['njCategory']
            },
            function (data) {
                loadQuestions();
            }, 'json')
    }

}

function test() {
    alert('test');
}

function loadQuestions() {
    $('#njInnerContent').load('frageTemplate.php');
}

function checkAnswer(antwortNr, divID) {
    $.get('master.php', {
        action: 'checkAnswer',
        answerNr: antwortNr
    }, function (data) {
        $('#njInnerContent').load('frageTemplate.php');
        ;
    }, 'json')
}


function njPlayAgain() {
    location.reload();
}


function progress(timeleft, timetotal, $element) {
    var progressBarWidth = timeleft * $element.width() / timetotal;
    $element
        .find('div')
        .animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, 'linear')
    //.html(timeleft);  //es zeigt die Zeit in Sekuden IM Balken an
    if (timeleft >= 0 && checkProgressBar()) {
        setTimeout(function () {
            progress(timeleft - 1, timetotal, $element);
        }, 1000);
    } else {
        stopProgressbar();
        checkResults();
    }
};

function checkProgressBar() {
    return  $('#progressBar').data('run');
}

function stopProgressbar() {
    $('#progressBar').data('run', false);
}

function checkResults(answerNr) {
    $.get('master.php', {
        action: 'getAnswers'
    }, function (data) {
        disableButtons();
        stopProgressbar();
        markButtonsRedAndGreed(answerNr, data);
    }, 'json')
}

function markButtonsRedAndGreed(answerNr, data) {
    if (data[answerNr] == '1') {
        njPlaySound('audio/singleClap.mp3');
        markButtonRight(answerNr);
    } else {
        njPlaySound('audio/shateredGlass.mp3');
        markButtonWrong(answerNr);
        markButtonRight(getRightAnswerFromData(data));
        countdown();
    }
}

function getRightAnswerFromData(data) {
    for (var i = 0; i <= 3; i++) {
        if (data[i] = 1) {
            return i;
        }
    }
}

function markButtonRight(questionNr) {
    $('#njAnswer' + (questionNr + 1)).on('click', '').css({
        'background-color': 'green',
        'fontSize': '35px',
        'fontFamily': 'bold'
    }).effect('highlight');

}
function markButtonWrong(questionNr) {
    $('#njAnswer' + (questionNr + 1)).effect('explode');
}


function countdown() {
    var counter = 4;
    var interval = setInterval(function () {
        counter--;
        $('#countdown').html('&nbsp&nbsp&nbsp&nbsp weiter in ' + counter + ' Sekunden');
        if (counter <= 0) {
            clearInterval(interval);
            console.log('weiter gehts !');
            $('#countdown').empty();
        }
    }, 1000);
}

function disableButtons() {
    $('.njAntwortCss').attr('disabled', 'true');
}


// verstos gegen oaoo .. ich weiss ...
function createQuestionForEditor(type) {
    switch (type) {
        case ('text_question'):
            $('#njQuestionEditor').load('view/text_question.php');
            break;
        case ('img_question'):
            $('#njQuestionEditor').load('view/img_questions.php');
            break;
        case ('video_question'):
            $('#njQuestionEditor').load('view/video_questions.php');
            break;
        case ('audio_question'):
            $('#njQuestionEditor').load('view/audio_questions.php');
            break;
    }

}

function loadVideoIntoIframe() {
    $("#videoContainer").empty();
    var videoURL = 'https://www.youtube.com/embed/' + $('#videoURL').val();
    $("#videoContainer").empty().append($('<iframe width="420" height="315" frameborder="0" allowfullscreen></iframe>')
        .attr("src", videoURL));
    $('#mediaURL').val(videoURL);

}

function playNewURL() {
    $("#audioPlayer").attr("src", $('#mediaURL').val()).trigger("play");
}

function showImg() {
    var file = $('#mediaURL').val();
    $('#imgContainer').append('<img src=' + file + '>');
}

//extern functions
function njPlaySound(url) {
    var helper = $('#audioPlayed').val();
    if (helper == 'true') {
        $('#audioPlayed').val('false');
    } else {
        $('#audioPlayed').val('true');
        $('#audioDIV').append($('<audio autoplay hidden="true"> ' +
            ' <source src="' + url + '" type="audio/mpeg">' +
            '</audio>'))
    }
}