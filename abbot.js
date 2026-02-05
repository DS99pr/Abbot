const readline = require('readline');
const fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function toslitanForme(tacen) {
    const endeSticcu = tacen.lastIndexOf(".");
    if (endeSticcu === -1) {
        throw new Error("Tacen sceal maero haebban (.abb)");
    }
    const nama = tacen.slice(0, endeSticcu);
    const maero = tacen.slice(endeSticcu + 1);
    
    return { nama, maero };
}

function raedanForme(nama, maero) {
    if (maero !== "abb") {
        throw new Error("Tacen sceal habban thaet betste maero (.abb)")
    }
    const text = fs.readFileSync(`${nama}.${maero}`, "utf8");
    const run = awendan(text);
    const wyrd = claensian(run);
    return wyrd;
}


function awendan(aerende) {
    const run = [];
    let it = 0;

    while (it < aerende.length) {
        const ruun = aerende[it]
        if (/\s/.test(ruun)) {
            it++;
            continue;
        }

        if (ruun === '"') {
            it++;
            let sceatt = "";

            while (aerende[it] !== '"') {
                sceatt += aerende[it]
                it++;
            }

            it++;
            run.push({ cyn: "SCRIPTURE", sceatt })
            continue;
        }

        if (/[0-9]/.test(ruun)) {
            let rim = "";

            while (/[0-9]/.test(aerende[it])) {
                rim += aerende[it];
                it++;
            }

            run.push({
                cyn: "RIM",
                sceatt: Number(rim)
            })

            continue;
        }

        if (ruun === "[") {
            run.push({ cyn: "L.TRENDEL", sceatt: "[" });
            it++;
            continue;
        }

        if (ruun === "]") {
            run.push({ cyn: "R.TRENDEL", sceatt: "]" });
            it++;
            continue;
        }

        if (ruun === ";") {
            run.push({ cyn: "END", sceatt: ";" });
            it++;
            continue;
        }


        if (ruun >= 'a' && ruun <= 'z') {
            let sceatt = "";

            while (aerende[it] >= 'a' && aerende[it] <= 'z') {
                sceatt += aerende[it];
                it++;
            }

            run.push({ cyn: "WEORC", sceatt });
            continue;
        }
    }

    return run
}

function claensian(run) {
    const capitalize = scr => scr.charAt(0).toUpperCase() + scr.slice(1);
    let it = 0;

    function deed() {
        return run[it] || null;
    }

    const wyrd = [];

    while (it < run.length) {

        if (deed() && deed().cyn === "END") { it++; continue; }    

        const display = "apert"
        const file = "raedan"

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == display) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                throw new Error(`Aefter ${display} sceal beon '['`);
            }
            it++;

            if (!deed() || deed().cyn !== "SCRIPTURE" && deed().cyn !== "RIM") {
                throw new Error(`On ${display} sceal beon riht cyn.`);
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                throw new Error(`Aefter tham gewrite sceal beon ']'`)
            }
            it++;

            const ast = {
                cyn: `${capitalize(display)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }
        if (deed() && deed().cyn === "WEORC" && deed().sceatt == file) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                throw new Error(`Aefter ${file} sceal beon '['`);
            }
            it++;

            if (!deed() || deed().cyn !== "SCRIPTURE" && deed().cyn !== "RIM") {
                throw new Error(`On ${file} sceal beon riht cyn.`);
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                throw new Error(`Aefter tham gewrite sceal beon ']'`)
            }
            it++;

            const ast = {
                cyn: `${capitalize(file)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }
        throw new Error("Claensian: Unbekend weorc '" + (deed()?.sceatt || "?") + "'");
    }
    return wyrd;
}

function ongietan(wyrd) {
    for (let i = 0; i < wyrd.length; i++) {
        const ast = wyrd[i];

        if (ast.cyn === "Apert.W") {
            console.log(ast.sceatt);
            continue;
        }

        if (ast.cyn === "Raedan.W") {
            const { nama, maero } = toslitanForme(ast.sceatt);
            const extra = raedanForme(nama, maero);
            ongietan(extra)
            continue;
        }

        throw new Error(`Unbekend weorc: ${ast.cyn}`);
    }
}

function doon() {
    rl.question(">> ", (agen) => {
        let run = awendan(agen)
        let asts = claensian(run)
        ongietan(asts)
        doon();
    })
}

doon()
