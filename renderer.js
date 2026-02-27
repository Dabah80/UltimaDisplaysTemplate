import { PDFDocument, cmyk } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

function mmToPt(mm) { return mm * 2.834645; }

document.getElementById('ok').addEventListener('click', async () => {
    const widthMM = parseFloat(document.getElementById('width').value);
    const heightMM = parseFloat(document.getElementById('height').value);
    const nettoOffsetMM = parseFloat(document.getElementById('netto').value);
    const safeStrokeMM = 80;

    if (isNaN(widthMM) || isNaN(heightMM) || isNaN(nettoOffsetMM)) {
        alert('Nieprawidłowe wymiary');
        return;
    }

    const widthPt = mmToPt(widthMM);
    const heightPt = mmToPt(heightMM);
    const nettoOffsetPt = mmToPt(nettoOffsetMM);
    const safeStrokePt = mmToPt(safeStrokeMM);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([widthPt, heightPt]);

    const cutColor = cmyk(0,1,0,0);
    const infoColor = cmyk(0.53,0.40,0.40,0.23);
    const infoRed = cmyk(0,1,1,0);

    page.drawRectangle({ x:0, y:0, width:widthPt, height:heightPt, borderColor:cutColor, borderWidth:0.2 });
    page.drawRectangle({ x: safeStrokePt/2, y: safeStrokePt/2, width: widthPt - safeStrokePt, height: heightPt - safeStrokePt, borderColor:infoColor, borderWidth: safeStrokePt, opacity:0.37 });
    page.drawRectangle({ x: nettoOffsetPt, y: nettoOffsetPt, width: widthPt - nettoOffsetPt*2, height: heightPt - nettoOffsetPt*2, borderColor: infoColor, borderWidth:2 });

    const fontSize = 20;
    page.drawText(`Brutto: ${widthMM} x ${heightMM} mm`, { x: widthPt*0.35, y: heightPt*0.75, size: fontSize, color: infoRed });
    page.drawText(`Netto: ${widthMM - 2*nettoOffsetMM} x ${heightMM - 2*nettoOffsetMM} mm`, { x: widthPt*0.35, y: heightPt*0.65, size: fontSize, color: infoRed });
    page.drawText(`Obszar Bezpieczny: ${widthMM - 2*safeStrokeMM} x ${heightMM - 2*safeStrokeMM} mm`, { x: widthPt*0.35, y: heightPt*0.55, size: fontSize, color: infoRed });

    const appFolder = path.dirname(process.execPath);
    const pdfPath = path.join(appFolder, 'szablon.pdf');
    fs.writeFileSync(pdfPath, await pdfDoc.save());

    document.getElementById('info').innerText = 'Szablon utworzony ✅ plik: szablon.pdf';
});

document.getElementById('cancel').addEventListener('click', () => window.close());