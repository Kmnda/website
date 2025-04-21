// Function to fetch and display server stats
async function fetchIndianRustServers() {
    try {
        const response = await fetch('https://www.battlemetrics.com/servers/search?countries%5Bor%5D=IN&game=rust', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayServerStats(data);
    } catch (error) {
        console.error('Error fetching server stats:', error);
        displayError('Failed to fetch server information. Please try again later.');
    }
}

// Function to display server stats in the popup
function displayServerStats(data) {
    const serverList = document.getElementById('serverList');
    serverList.innerHTML = ''; // Clear loading message

    if (!data || !data.data || data.data.length === 0) {
        displayError('No active Indian servers found.');
        return;
    }

    data.data.forEach(server => {
        const serverItem = document.createElement('div');
        serverItem.className = 'server-item';
        
        const isOnline = server.attributes.status === 'online';
        const playerCount = server.attributes.players || 0;
        const maxPlayers = server.attributes.maxPlayers || 0;
        
        serverItem.innerHTML = `
            <div class="server-info">
                <span class="server-status-indicator ${isOnline ? 'status-online' : 'status-offline'}"></span>
                <span class="server-name">${server.attributes.name}</span>
            </div>
            <div class="server-details">
                <span class="server-game">Rust</span>
                <span class="server-location">India</span>
                <span>${playerCount}/${maxPlayers} Players</span>
                <a href="${server.attributes.connectEndPoints[0]}" class="server-link" target="_blank">Connect</a>
            </div>
        `;
        
        serverList.appendChild(serverItem);
    });
}

// Function to display error messages
function displayError(message) {
    const serverList = document.getElementById('serverList');
    serverList.innerHTML = `<div class="error-message">${message}</div>`;
}

// Initialize server stats when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
    const statsLink = document.querySelector('a[href="#"]');
    if (statsLink) {
        statsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const statsPopup = document.getElementById('statsPopup');
            statsPopup.style.display = 'block';
            fetchIndianRustServers();
        });
    }

    // Close popup when clicking the close button
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popups = document.querySelectorAll('.stats-popup');
            popups.forEach(popup => {
                popup.style.display = 'none';
            });
        });
    });
}); 