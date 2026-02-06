const readline = require('readline');
const fs = require('fs')

const UrimHord = {};
const UscriptureHord = {};

function awritan(gewrit) {
    console.log(gewrit);
}

function wyrceanForraeden(gylt) {
    console.log(`
/\\/\\ FORRAEDEN \\/\\/
${gylt};        
`);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function toslitanForme(tacen) {
    const endeSticcu = tacen.lastIndexOf(".");
    if (endeSticcu === -1) {
        wyrceanForraeden("Tacen sceal maero haebban (.abb)");
    }
    const nama = tacen.slice(0, endeSticcu);
    const maero = tacen.slice(endeSticcu + 1);
    
    return { nama, maero };
}

function raedanForme(nama, maero) {
    if (maero !== "abb") {
        wyrceanForraeden("Tacen sceal habban thaet betste maero (.abb)")
    }
    const gewrit = fs.readFileSync(`${nama}.${maero}`, "utf8");
    return gewrit;
}

function sceawungMicel(gewrit) {
    const run = awendan(gewrit);
    const wyrd = claensian(run);
    return wyrd
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

        if (ruun === ",") {
            run.push({ cyn: "COMMA", sceatt: "," });
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
    const formaMiccle = scr => scr.charAt(0).toUpperCase() + scr.slice(1);
    let it = 0;

    function deed() {
        return run[it] || null;
    }

    const wyrd = [];

    while (it < run.length) {

        if (deed() && deed().cyn === "END") { it++; continue; }   
        if (deed() && deed().cyn === "COMMA") { it++; continue; }   

        const display = "apert"
        const file = "raedan"
        const set = "healdan"

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == display) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${display} sceal beon '['`);
                break;
            }
            it++;

            if (!deed() || deed().cyn !== "SCRIPTURE" && deed().cyn !== "RIM") {
                wyrceanForraeden(`On ${display} sceal beon riht cyn.`);
                break;
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                wyrceanForraeden(`Aefter tham gewrit sceal beon ']'`);
                break;
            }
            it++;

            const ast = {
                cyn: `${formaMiccle(display)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }
        if (deed() && deed().cyn === "WEORC" && deed().sceatt == file) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${file} sceal beon '['`);
                break;
            }
            it++;

            if (!deed() || deed().cyn !== "SCRIPTURE" && deed().cyn !== "RIM") {
                wyrceanForraeden(`On ${file} sceal beon riht cyn.`);
                break;
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                wyrceanForraeden(`Aefter tham gewrit sceal beon ']'`);
                break;
            }
            it++;

            const ast = {
                cyn: `${formaMiccle(file)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == set) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${set} sceal beon '['`);
                break;
            }
            it++;

            if (!deed() || deed().cyn !== "WEORC" || (deed().sceatt.toUpperCase() 
                !== "RIM" && deed().sceatt.toUpperCase() !== "SCRIPTURE")) {
                    wyrceanForraeden(`On ${set} sceal beon riht cyn (SCRIPTURE/RIM)`);
                    break;
            }

            const hiw = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "COMMA") {
                wyrceanForraeden("Hit sceal beon todala");
                break;
            }
            it++

            if (!deed() || deed().cyn !== "WEORC") {
                wyrceanForraeden('Thu scealt giefan naman hordes');
                break;
            };
            
            const nama = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "COMMA") {
                wyrceanForraeden("Hit sceal beon todala");
                break;
            }
            it++

            if (!deed() || (deed().cyn !== "RIM" && deed().cyn !== "SCRIPTURE")) { 
                wyrceanForraeden(`On ${set} thu scealt giefan sceatt`); 
                break; 
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                wyrceanForraeden(`Aefter tham gewrit sceal beon ']'`);
                break;
            }
            it++;

            const ast = {
                cyn: `${formaMiccle(set)}.W`,
                hiw: hiw,
                nama: nama,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }
        wyrceanForraeden("Claensian: Unbekend weorc '" + (deed()?.sceatt || "?") + "'");
        break;
    }
    return wyrd;
}

function ongietan(wyrd) {
    for (let i = 0; i < wyrd.length; i++) {
        const ast = wyrd[i];

        if (ast.cyn === "Apert.W") {
            awritan(ast.sceatt);
            continue;
        }

        if (ast.cyn === "Raedan.W") {
            const { nama, maero } = toslitanForme(ast.sceatt);
            const gewrit = raedanForme(nama, maero);
            const fAst = sceawungMicel(gewrit)
            ongietan(fAst)
            continue;
        }

        if (ast.cyn == "Healdan.W") {
            const hiw = ast.hiw
            const nama = ast.nama
            const sceatt = ast.sceatt

            if (hiw == "scripture") {
                UscriptureHord[nama] = String(sceatt);
            } else if (hiw == "rim") {
                UrimHord[nama] = Number(sceatt);
            } else {
                wyrceanForraeden(`Thes cyn ne aetstent (${hiw})`);
            };
            continue;
        }
        wyrceanForraeden(`Unbekend weorc: ${ast.cyn}`);
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
