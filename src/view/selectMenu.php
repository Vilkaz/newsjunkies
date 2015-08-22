<div id="njMainContainer">
    <img id="njLogo_img" src="img/news-junkies_logo.png">
    <div id="njInnerContent">
        <h3>Herzlich wilkommen auf der Newsjunkie Seite ! </h3></br>
        <label>Haben Sie bei unserer Sendung gut aufgepasst ? Hier finden wir es gemeinsam raus !</label></br>
        <label>Bitte wählen Sie in welcher Kategorie Ihr Wissen geprüft werden soll !</label></br></br>
        <form id="njForm">
            <div class="njRubrikCheckbox">
                <label for="njBildertest">Bildertest</label>
                <input id="njBildertest" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">

                &nbsp;&nbsp;

                <label for="njInland"> Inland</label>
                <input id="njInland" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njAusland">Ausland</label>
                <input id="njAusland" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njWirtschaft">Wirtschaft</label>
                <input id="njWirtschaft" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njKultur">Kultur</label>
                <input id="njKultur" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njBildertest">Sport</label>
                <input id="njsport" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
            </div>
            <br>
            <br>
          </form>
        <br>
        <input id="startQuizBtn" class="btn btn-default" type="button" value="Quiz Starten ! " onclick="startQuiz()">
    </div>

</div>

