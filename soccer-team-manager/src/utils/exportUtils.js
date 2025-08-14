// Export utilities for saving formations as images and PDFs
// Note: This requires installing html2canvas and jspdf
// Run: npm install html2canvas jspdf

// For now, we'll use a fallback method until libraries are installed
export async function exportFormationAsImage({ fieldElement, formationName, players, timestamp }) {
    try {
        // Method 1: Using html2canvas (preferred - install with: npm install html2canvas)
        if (window.html2canvas) {
            const canvas = await window.html2canvas(fieldElement, {
                backgroundColor: '#eaf4ea',
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: false
            });

            // Add formation info overlay
            const ctx = canvas.getContext('2d');
            addFormationOverlay(ctx, canvas.width, canvas.height, formationName, timestamp, players.length);

            // Download the image
            downloadCanvas(canvas, `${formationName}_${timestamp.replace(/\//g, '-')}.png`);
            return;
        }

        // Method 2: Fallback using native Canvas API
        await exportUsingNativeCanvas(fieldElement, formationName, players, timestamp);

    } catch (error) {
        console.error('Image export failed:', error);
        throw error;
    }
}

export async function exportFormationAsPDF({ fieldElement, formationName, players, timestamp }) {
    try {
        // Method 1: Using jsPDF + html2canvas (preferred)
        if (window.jsPDF && window.html2canvas) {
            const canvas = await window.html2canvas(fieldElement, {
                backgroundColor: '#eaf4ea',
                scale: 2,
                useCORS: true
            });

            const pdf = new window.jsPDF('landscape', 'mm', 'a4');
            const imgWidth = 280;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add title
            pdf.setFontSize(16);
            pdf.text(formationName, 20, 20);
            pdf.setFontSize(10);
            pdf.text(`Date: ${timestamp} | Players on field: ${players.length}`, 20, 30);

            // Add formation image
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, Math.min(imgHeight, 150));

            // Add player list
            addPlayerListToPDF(pdf, players, 40 + Math.min(imgHeight, 150) + 10);

            pdf.save(`${formationName}_${timestamp.replace(/\//g, '-')}.pdf`);
            return;
        }

        // Method 2: Fallback - export as image instead
        alert('PDF export requires additional libraries. Exporting as image instead.');
        await exportFormationAsImage({ fieldElement, formationName, players, timestamp });

    } catch (error) {
        console.error('PDF export failed:', error);
        throw error;
    }
}

// Fallback method using native Canvas API
async function exportUsingNativeCanvas(fieldElement, formationName, players, timestamp) {
    const rect = fieldElement.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = rect.width * 2; // Higher resolution
    canvas.height = rect.height * 2;

    // Scale context for higher resolution
    ctx.scale(2, 2);

    // Draw field background
    ctx.fillStyle = '#d4f1d6';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw field border
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(5, 5, rect.width - 10, rect.height - 10);

    // Draw center circle
    ctx.beginPath();
    ctx.arc(rect.width / 2, rect.height / 2, 40, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center line
    ctx.beginPath();
    ctx.moveTo(rect.width / 2, 5);
    ctx.lineTo(rect.width / 2, rect.height - 5);
    ctx.stroke();

    // Draw players
    const playerElements = fieldElement.querySelectorAll('.player-dot');
    playerElements.forEach((playerEl) => {
        const playerRect = playerEl.getBoundingClientRect();
        const fieldRect = fieldElement.getBoundingClientRect();

        const x = playerRect.left - fieldRect.left + playerRect.width / 2;
        const y = playerRect.top - fieldRect.top + playerRect.height / 2;

        // Draw player circle
        ctx.fillStyle = getComputedStyle(playerEl).backgroundColor || '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, 2 * Math.PI);
        ctx.fill();

        // Draw player text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        const playerName = playerEl.querySelector('.player-name')?.textContent || '';
        const playerPos = playerEl.querySelector('.player-pos')?.textContent || '';
        ctx.fillText(playerName, x, y - 2);
        ctx.fillText(playerPos, x, y + 8);
    });

    // Add formation overlay
    addFormationOverlay(ctx, rect.width, rect.height, formationName, timestamp, players.length);

    // Download the canvas
    downloadCanvas(canvas, `${formationName}_${timestamp.replace(/\//g, '-')}.png`);
}

// Add formation info overlay to canvas
function addFormationOverlay(ctx, width, height, formationName, timestamp, playerCount) {
    // Semi-transparent background for text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(10, 10, 280, 60);

    // Border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 280, 60);

    // Formation name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formationName, 20, 30);

    // Details
    ctx.font = '12px sans-serif';
    ctx.fillText(`Date: ${timestamp}`, 20, 45);
    ctx.fillText(`Players on field: ${playerCount}`, 20, 60);
}

// Add player list to PDF
function addPlayerListToPDF(pdf, players, startY) {
    pdf.setFontSize(12);
    pdf.text('Starting Lineup:', 20, startY);

    let y = startY + 10;
    players.forEach((player, index) => {
        const playerText = `${index + 1}. ${player.name} (${player.position})${player.shirtNumber ? ` #${player.shirtNumber}` : ''}`;
        pdf.setFontSize(10);
        pdf.text(playerText, 25, y);
        y += 5;

        if (y > 270) { // Near bottom of page
            pdf.addPage();
            y = 20;
        }
    });
}

// Download canvas as image
function downloadCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Function to load required libraries dynamically
export function loadExportLibraries() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas && window.jsPDF) {
            resolve();
            return;
        }

        const scripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        ];

        let loadedCount = 0;

        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scripts.length) {
                    resolve();
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    });
}