
    <div id="njInnerContent">
        <img src="img/news-junkies_logo.png" width="650" height="250" style="margin-left: 50px">
        <form id="njForm">
            <div class="njRubrikCheckbox">
                <label for="njBildertest">Bildertest</label>
                <input id="njBildertest" value="1" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">

                &nbsp;&nbsp;

                <label for="njInland"> Inland</label>
                <input id="njInland" value="2" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njAusland">Ausland</label>
                <input id="njAusland" value="3" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njWirtschaft">Wirtschaft</label>
                <input id="njWirtschaft" value="4" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njKultur">Kultur</label>
                <input id="njKultur" value="5" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
                &nbsp;&nbsp;

                <label for="njBildertest">Sport</label>
                <input id="njsport" value="6" type="radio" name="njCategory" onchange="getAnzahlDerFragen()">
            </div>
            <br>
            <br>
          </form>
        <br>
        <input id="startQuizBtn" class="btn btn-default" type="button" value="Quiz Starten ! "
               onClick="startQuiz2()">
    </div>


