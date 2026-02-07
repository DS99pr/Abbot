const readline = require('readline');
const fs = require('fs')

const UrimHord = {pi: 3.1415};
const UscriptureHord = {};

function awritan(gewrit) {
    console.log(gewrit);
}

function wyrceanForraeden(gylt) {
    console.log(`
\\/\\/\\ FORRAEDEN \\/\\/
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
        const input = "inlidan"
        const delay = "bidian"

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == display) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${display} sceal beon '['`);
                break;
            }
            it++;

            let sceatt = null;

            if (deed() && (deed().cyn === "SCRIPTURE" || deed().cyn === "RIM")) {
                sceatt = deed();
                it++;
            }
            else if (deed() && deed().cyn === "WEORC" &&
                    (deed().sceatt === "rim" || deed().sceatt === "scripture")) {

                const hiw = deed().sceatt;
                it++;

                if (!deed() || deed().cyn !== "L.TRENDEL") {
                    wyrceanForraeden(`Aefter ${hiw} sceal beon '['`);
                    break;
                }
                it++;

                if (!deed() || deed().cyn !== "WEORC") {
                    wyrceanForraeden('Thu scealt giefan naman hordes');
                    break;
                 }

                const nama = deed().sceatt;
                it++;

                if (!deed() || deed().cyn !== "R.TRENDEL") {
                    wyrceanForraeden(`Aefter ${nama} sceal beon ']'`);
                    break;
                }
                it++;
            
                sceatt = {
                    cyn: "Var.R",
                    hiw: hiw,
                    nama: nama
                };
            } else {
                wyrceanForraeden(`On ${display} sceal beon riht cyn.`);
                break;
            }

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
                wyrceanForraeden(`On ${file} sceal beon riht cyn`);
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

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == input) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${input} sceal beon '['`);
                break;
            }
            it++;

            if (!deed() || deed().cyn !== "WEORC" || 
                (deed().sceatt !== "rim" && deed().sceatt !== "scripture")) { 
                    wyrceanForraeden(`On niman sceal beon cyn (rim/scripture)`); 
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

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                wyrceanForraeden(`Aefter tham gewrit sceal beon ']'`);
                break;
            }
            it++;

            const ast = {
                cyn: `${formaMiccle(input)}.W`,
                hiw: hiw,
                nama: nama
            };
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == delay) {
            it++;

            if (!deed() || deed().cyn !== "L.TRENDEL") {
                wyrceanForraeden(`Aefter ${delay} sceal beon '['`);
                break;
            }
            it++;

            if (!deed() || deed().cyn !== "RIM") {
                wyrceanForraeden(`Her sceal beon rim`);
            }

            const sceatt = deed().sceatt;
            it++;

            if (!deed() || deed().cyn !== "R.TRENDEL") {
                wyrceanForraeden(`Aefter tham gewrit sceal beon ']'`);
                break;
            }
            it++;

            const ast = {
                cyn: `${formaMiccle(delay)}.W`,
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



async function ongietan(wyrd) {
    for (let i = 0; i < wyrd.length; i++) {

        const ast = wyrd[i];

        if (ast.cyn === "Apert.W") {
            let sceatt = ast.sceatt;

            if (typeof sceatt === "object" && sceatt.cyn === "Var.R") {

                if (sceatt.hiw === "rim") {
                    if (!(sceatt.nama in UrimHord)) {
                        wyrceanForraeden(`Rim '${sceatt.nama}' ne is`);
                        continue;
                    }
                    sceatt = UrimHord[sceatt.nama];
                }

                else if (sceatt.hiw === "scripture") {
                    if (!(sceatt.nama in UscriptureHord)) {
                        wyrceanForraeden(`Scripture '${sceatt.nama}' ne is`);
                        continue;
                    }
                    sceatt = UscriptureHord[sceatt.nama];
                }
            }

            else if (typeof sceatt === "object" && sceatt.cyn === "RIM") {
                sceatt = sceatt.sceatt;
            }

            else if (typeof sceatt === "object" && sceatt.cyn === "SCRIPTURE") {
                sceatt = sceatt.sceatt;
            }

            awritan(sceatt);
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

        if (ast.cyn == "Inlidan.W") {
            const hiw = ast.hiw;
            const nama = ast.nama;

            await new Promise(resolve => {
                rl.question(">>> ", (agen) => {
                    if (hiw === "rim") {
                        const num = Number(agen)
                        if (Number.isNaN(num)) { 
                            wyrceanForraeden(`Ne maeg niman rim of '${agen}'`); 
                        } else { 
                            UrimHord[nama] = num; 
                        }
                    } else {
                        UscriptureHord[nama] = agen;
                    }
                    resolve();
                });
            });
            continue;
        }

        if (ast.cyn == "Bidian.W") {
            const tid = Number(ast.sceatt);

            await new Promise(r => setTimeout(r, tid * 1000));
            continue;
        }

    
        if (ast.cyn == "Var.R") {
            if (ast.hiw == "rim") {
                return UrimHord[ast.nama];
            }
            if (ast.hiw == "scripture") {
                return UscriptureHord[ast.nama];
            }
        }
        wyrceanForraeden(`Unbekend weorc: ${ast.cyn}`);
    }
}



async function doon() {
    rl.question(">> ", async (agen) => {
        let run = awendan(agen)
        let asts = claensian(run)
        await ongietan(asts)
        doon();
    })
}



doon()
