// 
// TEN JEZYK BEDZIE PRZEPISANY JAK COS
//

const readline = require('readline');
const fs = require('fs')

const UrimHord = {pi: 3.1415};
const UscriptureHord = {};
const UtreowHord = {}

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

    function scortre(r, char, cyn) {
        if (r === char) {
            run.push({ cyn: cyn, sceatt: char });
            it++;
            return true
        }
    }

    function boolify(a, b) {
        if (aerende.slice(it, it + a.length) === a) { 
            run.push({ 
                cyn: "TREOW", 
                sceatt: b 
            }); 
            it += a.length; 
            return true; 
        }
    }

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

            if (/[A-Za-z]/.test(aerende[it])) { 
                wyrceanForraeden("Awendan: Unbekend getael"); 
                break; 
            }

            run.push({
                cyn: "RIM",
                sceatt: Number(rim)
            })

            continue;
        }

        if (boolify("aefest", true)) continue;
        if (boolify("facen", false)) continue;
        if (scortre(ruun, "[", "L.TRENDEL")) continue;
        if (scortre(ruun, "]", "R.TRENDEL")) continue;
        if (scortre(ruun, ";", "END")) continue;
        if (scortre(ruun, ",", "COMMA")) continue;
        if (scortre(ruun, "+", "OP.AND")) continue;
        if (scortre(ruun, "-", "OP.LAES")) continue;

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

    

    function sceawHit(cyn, error) {
        if (!deed() || deed().cyn !== cyn) {
            wyrceanForraeden(error);
            return false
        }
        it++;
        return true
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
        const vars = "awrit"

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == display) {
            it++;

            if (!sceawHit("L.TRENDEL", `Aefter ${display} sceal beon '['`)) break;

            let sceatt = null;

            if (deed() && (deed().cyn === "SCRIPTURE" || deed().cyn === "RIM" || deed().cyn === "TREOW")) {
                sceatt = deed();
                it++;
            }
            else if (deed() && deed().cyn === "WEORC" &&
                    (deed().sceatt === "rim" || deed().sceatt === "scripture" || deed().sceatt === "treow")) {

                const hiw = deed().sceatt;
                it++;

                if (!sceawHit("L.TRENDEL", `Aefter ${hiw} sceal beon '['`)) break;

                if (!deed() || deed().cyn !== "WEORC") {
                    wyrceanForraeden('Thu scealt giefan naman hordes');
                    break;
                }

                const nama = deed().sceatt;
                it++;

                if (!sceawHit("R.TRENDEL", `Aefter ${nama} sceal beon ']'`)) break;
            
                sceatt = {
                    cyn: "Var.R",
                    hiw: hiw,
                    nama: nama
                };

            } else {
                wyrceanForraeden(`On ${display} sceal beon riht cyn.`);
                break;
            }

            if (!sceawHit("R.TRENDEL", "Aefter tham gewrit sceal beon ']'")) break;

            const ast = {
                cyn: `${formaMiccle(display)}.W`,
                sceatt: sceatt
            };  
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == file) {
            it++;

            if (!sceawHit("L.TRENDEL", `Aefter ${file} sceal beon '['`)) break;

            if (!deed() || deed().cyn !== "SCRIPTURE" && deed().cyn !== "RIM" && deed().cyn !== "TREOW") {
                wyrceanForraeden(`On ${file} sceal beon riht cyn`);
                break;
            }

            const sceatt = deed().sceatt;
            it++;

            if (!sceawHit("R.TRENDEL", "Aefter nama sceal beon ']'")) break;

            const ast = {
                cyn: `${formaMiccle(file)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == set) {
            it++;

            if (!sceawHit("L.TRENDEL", `Aefter ${set} sceal beon '['`)) break;

            if (!deed() || deed().cyn !== "WEORC" || (
                deed().sceatt.toUpperCase() !== "RIM" &&
                deed().sceatt.toUpperCase() !== "SCRIPTURE" &&
                deed().sceatt.toUpperCase() !== "TREOW"
            )) {
                wyrceanForraeden(`On ${set} sceal beon riht cyn (SCRIPTURE/RIM/TREOW)`);
                break;
            }


            const hiw = deed().sceatt;
            it++;

            if (!sceawHit("COMMA", "Hit sceal beon todala")) break;

            if (!deed() || deed().cyn !== "WEORC") {
                wyrceanForraeden('Thu scealt giefan naman hordes');
                break;
            };
            
            const nama = deed().sceatt;
            it++;

            if (!sceawHit("COMMA", "Hit sceal beon todala")) break;

            let sceatt = null;

            if (deed() && deed().cyn === "SCRIPTURE") { sceatt = deed().sceatt; it++; }
            else if (deed() && deed().cyn == "RIM") {
                const wyn = deed().sceatt;
                it++;

                if (deed() && (deed().cyn === "OP.AND" || deed().cyn == "OP.LAES")) {
                    const op = deed().cyn;
                    it++;

                    if (!deed() || deed().cyn == "RIM") {
                        wyrceanForraeden("Aefter weorce sceal beon rim"); 
                        break;
                    }
                    const riht = deed().sceatt;
                    it++;

                    sceatt = {
                        cyn: "RIMCRAEFT",
                        wyn: wyn,
                        op: op,
                        riht: riht
                    };
                } else {
                    sceatt = wyn;
                }
            }
            else if (deed() && deed().cyn === "TREOW") {
                sceatt = deed().sceatt;
                it++;
            }


            if (!sceawHit("R.TRENDEL", "Aefter tham gewrit sceal beon ']'")) break;

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

            if (!sceawHit("L.TRENDEL", `Aefter ${input} sceal beon '['`)) break;

            if (!deed() || deed().cyn !== "WEORC" || 
                (deed().sceatt !== "rim" && deed().sceatt !== "scripture" && deed().sceatt !== "treow")) { 
                    wyrceanForraeden(`On niman sceal beon cyn (rim/scripture/treow)`); 
                    break; 
            }

            const hiw = deed().sceatt;
            it++;

            if (!sceawHit("COMMA", "Hit sceal beon todala")) break;

            if (!deed() || deed().cyn !== "WEORC") {
                wyrceanForraeden('Thu scealt giefan naman hordes');
                break;
            };
            
            const nama = deed().sceatt;
            it++;

            if (!sceawHit("R.TRENDEL", "Aefter tham gewrit sceal beon ']'")) break;

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

            if (!sceawHit("L.TRENDEL", `Aefter ${delay} sceal beon '['`)) break;

            if (!deed() || deed().cyn !== "RIM") {
                wyrceanForraeden(`Her sceal beon rim`);
            }

            const sceatt = deed().sceatt;
            it++;

            if (!sceawHit("R.TRENDEL", "Aefter rim sceal beon ']'")) break;

            const ast = {
                cyn: `${formaMiccle(delay)}.W`,
                sceatt: sceatt
            };
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "WEORC" && deed().sceatt == vars) {
            it++;

            if (!sceawHit("L.TRENDEL", `Aefter ${vars} sceal beon '['`)) break;

            if (!deed() || deed().cyn !== "WEORC" || 
                (deed().sceatt !== "rim" && deed().sceatt !== "scripture" && deed().sceatt !== "treow")) { 
                    wyrceanForraeden(`On niman sceal beon cyn (rim/scripture/treow)`); 
                    break; 
            }

            const hiw = deed().sceatt;
            it++

            if (!sceawHit("COMMA", "Hit sceal beon todala")) break;

            if (!deed() || deed().cyn !== "WEORC") {
                wyrceanForraeden('Thu scealt giefan naman hordes');
                break;
            };

            const nama = deed().sceatt;
            it++

            if (!sceawHit("R.TRENDEL", "Aefter nama sceal beon '['")) break;

            const ast = {
                cyn: `${formaMiccle(vars)}.W`,
                hiw: hiw,
                nama: nama
            };
            wyrd.push(ast)
            continue;
        }

        if (deed() && deed().cyn === "RIM") { it++; continue; }
        if (deed() && deed().cyn === "SCRIPTURE") { it++; continue; }
        if (deed() && deed().cyn === "TREOW") { it++; continue; }
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

                else if (sceatt.hiw === "treow") {
                    if (!(sceatt.nama in UtreowHord)) {
                        wyrceanForraeden(`Scripture '${sceatt.nama}' ne is`);
                        continue;
                    }
                    sceatt = UtreowHord[sceatt.nama]
                }
            }

            else if (typeof sceatt === "object" && sceatt.cyn === "RIM") {
                sceatt = sceatt.sceatt;
            }

            else if (typeof sceatt === "object" && sceatt.cyn === "SCRIPTURE") {
                sceatt = sceatt.sceatt;
            }

            else if (typeof sceatt === "object" && sceatt.cyn === "TREOW") {
                sceatt = sceatt.sceatt
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

            if (sceatt && sceatt.cyn === "RIMCRAEFT") { 
                const { wyn, op, riht } = sceatt; 
                let ende = 0; 
                if (op === "OP.AND") ende = wyn + riht; 
                if (op === "OP.LAES") ende = wyn - riht; 
                if (hiw === "rim") { 
                    UrimHord[nama] = ende; 
                } else { 
                    wyrceanForraeden("Rimcraft maeg beon on rim anum"); 
                } 
                continue; 
            }

            if (hiw == "scripture") {
                UscriptureHord[nama] = String(sceatt);
            } else if (hiw == "rim") {
                UrimHord[nama] = Number(sceatt);
            } else if (hiw == "treow") {
                UtreowHord[nama] = Boolean(sceatt);
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
                    } else if (hiw === "treow") {
                        if (agen.length == 0) {
                            wyrceanForraeden(`Ne maeg niman treow of '${agen}'`);
                        } else {
                            UtreowHord[nama] = Boolean(agen)
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

        if (ast.cyn == "Awrit.W") {
            const hiw = ast.hiw
            const nama = ast.nama;

            if (hiw.toUpperCase() === "SCRIPTURE") {
                UscriptureHord[nama] = Object.entries(UscriptureHord).map(([k, v]) => `${k}: ${v}`).join(', ')
            } else if (hiw.toUpperCase() === "RIM") {
                UscriptureHord[nama] = Object.entries(UrimHord).map(([k, v]) => `${k}: ${v}`).join(', ')
            } else if (hiw.toUpperCase() === "TREOW") {
                UscriptureHord[nama] = Object.entries(UtreowHord).map(([k, v]) => `${k}: ${v}`).join(', ')
            } else {
                wyrceanForraeden(`Thes cyn ne aetstent (${hiw})`);
            }
            continue;
        }
    
        if (ast.cyn == "Var.R") {
            if (ast.hiw == "rim") {
                return UrimHord[ast.nama];
            }
            if (ast.hiw == "scripture") {
                return UscriptureHord[ast.nama];
            }
            if (ast.hiw == "treow") {
                return UtreowHord[ast.nama]
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
