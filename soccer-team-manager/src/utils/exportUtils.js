// Export utilities for saving formations as images
// Note: For better quality, install html2canvas: npm install html2canvas

import pitch from "../assets/pitch.jpg";

export async function exportFormationAsImage({ fieldElement, formationName, players, timestamp }) {
    try {
        // Method 1: Using html2canvas (preferred - install with: npm install html2canvas)
        if (window.html2canvas) {
            const canvas = await window.html2canvas(fieldElement, {
                backgroundColor: '#eaf4ea',
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: false,
                ignoreElements: (element) => {
                    // Skip the grid overlay if it exists
                    return element.classList.contains('grid-overlay');
                }
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

    try {
        // Load and draw the actual field background image
        const fieldImage = new Image();
        await new Promise((resolve, reject) => {
            fieldImage.onload = resolve;
            fieldImage.onerror = reject;
            fieldImage.src = pitch;
        });

        // Draw the field background image
        ctx.drawImage(fieldImage, 0, 0, rect.width, rect.height);

    } catch (error) {
        console.warn('Could not load field image, using fallback background');
        // Fallback: Draw field background
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
    }

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

        // Draw player border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw player text
        ctx.fillStyle = '#0b0f19';
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.fillRect(10, 10, 140, 60);

    // Border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 140, 60);

    // Formation name
    ctx.fillStyle = '#2a3e6dff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(formationName, 20, 30);

    // Details
    ctx.font = '12px sans-serif';
    ctx.fillText(`Date: ${timestamp}`, 20, 45);
    ctx.fillText(`Players on field: ${playerCount}`, 20, 60);
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

// Function to load html2canvas library dynamically
export function loadExportLibraries() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}