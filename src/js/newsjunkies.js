/**
 * Created by vk on 6/18/15.
 */

function saveQuestion() {
    var data = ($("form").serialize());
    console.log(data);
    var url = 'master.php?' + data;
    console.log(url);
    $.get(url, {
        action: 'FrageSpeichern'

    }, function (data) {
        console.log(data);
    }, 'json')
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
    if (data == "") {
        alert("bitte mindestens eine Kategorie auswählen !")
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
    alert("test");
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
        .animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, "linear")
        .html(timeleft);
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
    var test = $('#progressBar').data('run');
    return test;
}

function stopProgressbar() {
    $('#progressBar').data('run', false);
}

function checkResults(answerNr) {
    $.get('master.php', {
        action: 'getAnswers'
    }, function (data) {
        stopProgressbar();
        markButtonsRedAndGreed(answerNr, data);
    }, 'json')
}

function markButtonsRedAndGreed(answerNr, data) {
    if (data[answerNr] == "1") {
        markButtonRight(answerNr);
    } else {
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
    $('#njAnswer' + (questionNr + 1)).css("background-color", "green");
}
function markButtonWrong(questionNr) {
    $('#njAnswer' + (questionNr + 1)).css("background-color", "red");
}


function countdown() {
    $('#countdown').ClassyCountdown({
        theme: "black", // theme
        format: 'S',
        end: $.now() + 5, // end time
        labels:true,
        labelsOptions: {
                lang: {
      seconds: 'gleich geht es weiter !'
    },
    style: 'font-size: 0.5em;'
}


})
}
