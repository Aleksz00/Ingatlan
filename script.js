function renderIngatlan(){
    let ingatlanHTML="";
    let ingatlanLista=document.getElementById("ingatlanok-lista");
    let xhr = new XMLHttpRequest();
    console.log(xhr);

    xhr.open('GET', 'http://localhost:3000/ingatlanok', true);
    xhr.onload=function(){

        if(xhr.status === 200){
            console.log(xhr.responseText);
            let ingatlanok = JSON.parse(xhr.responseText); 
            ingatlanok.forEach(function(ingatlan) {
                ingatlanHTML+=`
                <div class="col m-50 p-50">
                <div class="${ingatlan.Parkolas ? "bg-success" : "bg-danger"} m-2 p-2">
                    <h2>${ingatlan.Elhelyezkedese}</h2>
                    <p>A termék ára: ${ingatlan.ara} Ft</p>
                    <button class="btn btn-danger" onclick="torles(${ingatlan.id})">Törlés</button>
                    <button class="btn btn-primary" onclick="modositas(${ingatlan.id})">Módosítás</button>
                </div>
            </div>
                `
            });

            ingatlanLista.innerHTML = ingatlanHTML;
        }
    };
    xhr.send();
}

document.getElementById('uj-ingatlan').onclick = function (){
    let newFormHTML = `
    <h4>Ingatlan hozzáadása:</h4>
    <form id="ujingatlan" class="p-5 m-5">
        <label class= "w-50">
            <h5>Ingatlan Elhelyezkedese:</h5>
            <input class="form-control" type="text" name="Elhelyezkedese">
        </label>
        <label class="w-50">
            <h5>Ingatlan ára:</h5>
            <input class="form-control" type="number" name="ara">
        </label>
        <label class="w-50">
            <h5>Van Ingyenes Parkoló?</h5> 
            <input type="checkbox" name="Parkolas">
        </label>
        <br>
        <button class="btn btn-success" type="submit">Meghirdet</button>
    </form>
    
    `;

    let ujElem = document.getElementById('uj');
    ujElem.innerHTML = newFormHTML;
    document.getElementById('uj-ingatlan').style.display = 'none';
    let ujIngatlanUrlap = document.getElementById("ujingatlan");
    ujIngatlanUrlap.onsubmit = function (event) {
        event.preventDefault();
        let Elhelyezkedese = event.target.elements.Elhelyezkedese.value;
        let ara = event.target.elements.ara.value;
        let Parkolas = event.target.elements.Parkolas.checked;

        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3000/ingatlanok', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = function() {
            if (xhr.status === 201) {
                renderIngatlan();
                ujElem.innerHTML = '';
                document.getElementById('uj-ingatlan').style.display = 'block';
            } else {
                console.error('Hiba történt az adatok létrehozása során:', xhr.status, xhr.statusText);
            }    
    };
    xhr.send(JSON.stringify({
        Elhelyezkedese: Elhelyezkedese,
        ara: ara,
        Parkolas: Parkolas
        }));
    };
};

function torles(id) {
    console.log("Elem törlés id:", id)
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'http://localhost:3000/ingatlanok/' + id, true);

    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 204) {
            renderIngatlan();
            console.log(xhr.status);
        } else {
            console.error('Hiba történt a törlés során:', xhr.status, xhr.statusText);
        }
    };
    xhr.send();
}

function modositas(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/ingatlanok/' + id, true);
    if(xhr.status==200){
        let ingatlan=JSON.parse(xhr.responseText)
        let modositasFormHTML=`
        <h4>Ingatlan módosítása:</h4>
                <form id="modositas-Ingatlan" class="p-5">
                    <label class="w-100">
                        <h5>Ingatlan Elhelyezkedése:</h5>
                        <input class="form-control" type="text" name="Elhelyezkedese" value="${ingatlan.Elhelyezkedese}">
                    </label>
                    <label class="w-100">
                        <h5>Ingatlan ára:</h5>
                        <input class="form-control" type="number" name="ara" value="${ingatlan.ara}">
                    </label>
                    <label>
                        <h5>Van ingyenes parkolás?</h5> 
                        <input type="checkbox" name="Parkolas" ${ingatlan.Parkolas ? 'checked' : ''}>
                    </label>
                    <br>
                    <button class="btn btn-primary" type="submit">Mentés</button>
                </form>
        `;
        let szerkesztesElem = document.getElementById('szerkesztes');
        szerkesztesElem.innerHTML = modositasFormHTML;
        document.getElementById('uj-ingatlan').style.display = 'none';

        let modositasIngatlanForm = document.getElementById("modositas-Ingatlan");
        modositasIngatlanForm.onsubmit = function (event) {
            event.preventDefault();
            let Elhelyezkedese = event.target.elements.Elhelyezkedese.value;
            let ara = event.target.elements.ara.value;
            let Parkolas = event.target.elements.Parkolas.checked;

            let xhr = new XMLHttpRequest();
                xhr.open('PUT', 'http://localhost:3000/ingatlanok/' + id, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        renderIngatlan();
                        szerkesztesElem.innerHTML = '';
                        document.getElementById('uj-ingatlan').style.display = 'block';
                    } else {
                        console.error('Hiba történt az adatok módosítása során:', xhr.status, xhr.statusText);
                    }
                };
                xhr.send(JSON.stringify({
                    Elhelyezkedese: Elhelyezkedese,
                    ara: ara,
                    Parkolas: Parkolas
                }));
        }

    }
    xhr.send();
}
window.onload = renderIngatlan;