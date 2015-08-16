<div id="njMainContainer">
    <img src="img/news-junkies_logo.png">

    <div id="njInnerContent">
        <h1>Herzlich wilkommen auf der Newsjunkie Seite ! </h1></br>
        <label>Haben Sie bei unserer Sendung gut aufgepasst ? Hier finden wir es gemeinsam raus !</label></br>
        <label>Bitte wählen Sie in welcher Kategorie Ihr Wissen geprüft werden soll !</label></br></br>
        <form id="njForm">

            <div class="njRubrikCheckbox">
                <label for="njBildertest">Bildertest</label>
                <input id="njBildertest" type="checkbox" name="njBildertest" onchange="getAnzahlDerFragen()">

                &nbsp;&nbsp;

                <label for="njInland"> Inland</label>
                <input id="njInland" type="checkbox" name="njInland" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njAusland">Ausland</label>
                <input id="njAusland" type="checkbox" name="njAusland" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njWirtschaft">Wirtschaft</label>
                <input id="njWirtschaft" type="checkbox" name="njWirtschaft" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njKultur">Kultur</label>
                <input id="njKultur" type="checkbox" name="njKultur" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njBildertest">Sport</label>
                <input id="njsport" type="checkbox" name="njSport" onchange="getAnzahlDerFragen()">
            </div>
            <br>
            <br>
            <span> Wie weit in die Vergangenheit soll der Quizz gehen ?</span>
            <br>
            <input id="njTimeRangeInput" type="range" min="0" max="52" value="0" step="1"
                   onchange="showNJTimeRange(this.value); getAnzahlDerFragen()"/>
            <span id="njTimeRange">Aktuelle Woche</span>
            <br>
        </form>
        <br>
        <span>Anzahl der potenziellen Fragen:</span><span id="njAnzahlDerFragen"></span><br><br><br>

        <input id="startQuizBtn" class="btn btn-default" type="button" value="Quiz Starten ! " onclick="startQuiz()">
    </div>

</div>

