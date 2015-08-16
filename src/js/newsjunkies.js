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
                action: 'startQuiz'
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
    $.get('master.php',{
        action:'checkAnswer',
        answerNr:antwortNr
    },function (data){
        $('#njInnerContent').load('frageTemplate.php');;
    },'json' )
}


function njPlayAgain(){
    location.reload();
}