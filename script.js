const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");
let xValue = 0,
yValue = 0;

let rotateDegree = 0;

function update(cursorPosition) {
  parallax_el.forEach((el)=> {
    let speedx = el.dataset.speedx;
    let speedy = el.dataset.speedy;
    let speedz = el.dataset.speedz;
    let rotateSpeed = el.dataset.rotation;
 
    let isInLeft = 
    parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
     let zValue = 
     (cursorPosition - parseFloat( getComputedStyle(el).left)) * isInLeft * 0.05;
    
 
     el.style.transform = `perspective(2300px) translateZ(${
       zValue * speedz
     }px) rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${
       -xValue * speedx * 0.5
     }px)) translateY(calc(-50% + ${yValue * speedy * 0.5}px))`;
  });
}
update(0)

window.addEventListener("mousemove", (e)=> {
 if(timeline.isActive()) return;

 xValue = (e.clientX - window.innerWidth / 2) * 0.5;
 yValue = (e.clientY - window.innerHeight / 2) * 0.5;

 rotateDegree = (xValue / (window.innerWidth / 2)) * 10;

 update(e.clientX);
});

if (window.innerWidth >= 725){
  main.style.maxHeight = `${window.innerwidth * 0.6}px`;
} else{
  main.style.maxHeight = `${window.innerwidth * 1.6}px`;
}

/* GSAP */
let timeline = gsap.timeline();

 Array.from(parallax_el)
 .filter((el) => !el.classList.contains("text"))
 .forEach(el => {
  timeline.from(el, 
    {
    top: `${-el.offsetHeight/ 2 - +el.dataset.distance}px `,
    duration: 3.5,
    ease: "power3.out"
  },
  "1"
  );
 });
 timeline.from(".text h2",{
  y:
  window.innerHeight - document.querySelector(".text h2").getBoundingClientRect().top + 200,
  duration:2,
 }, "1.5")

 .from(".hide", {
  opacity: 0,
  duration: 1.5,
 }, "3");

/*cursor */
const cursorRounded = document.querySelector('.rounded');
const cursorPointed = document.querySelector('.pointed');


const moveCursor = (e)=> {
  const mouseY = e.clientY;
  const mouseX = e.clientX;
   
  cursorRounded.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  
  cursorPointed.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
 
}

window.addEventListener('mousemove', moveCursor)

// Click popup animation
const clickPopup = document.getElementById('click-popup');

document.addEventListener('click', (e) => {
    // Position the popup at click coordinates
    clickPopup.style.left = (e.clientX - 25) + 'px';
    clickPopup.style.top = (e.clientY - 25) + 'px';
    
    // Add active class to show animation
    clickPopup.classList.add('active');
    
    // Remove active class after animation completes
    setTimeout(() => {
        clickPopup.classList.remove('active');
    }, 300);
});

// Stats Popup Functionality
const statsLink = document.querySelector('header ul li:first-child a');
const statsPopup = document.getElementById('statsPopup');
const closePopup = document.querySelector('.close-popup');
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijc5MTY5ODMwYWNmYTZhM2IiLCJpYXQiOjE3NDUxNjU0NjMsIm5iZiI6MTc0NTE2NTQ2MywiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxMDIxOTYzIn0.zjImf-a2hWdHwJy7v6xUBNiKYCVCF7SlXP0InvppOBU
// Server Status Functionality
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6Ijc5MTY5ODMwYWNmYTZhM2IiLCJpYXQiOjE3NDUxNjU0NjMsIm5iZiI6MTc0NTE2NTQ2MywiaXNzIjoiaHR0cHM6Ly93d3cuYmF0dGxlbWV0cmljcy5jb20iLCJzdWIiOiJ1cm46dXNlcjoxMDIxOTYzIn0.zjImf-a2hWdHwJy7v6xUBNiKYCVCF7SlXP0InvppOBU";

// Function to validate the access token
async function validateAccessToken() {
    try {
        // Make a simple API call to check if the token is valid
        const response = await fetch('https://api.battlemetrics.com/servers?filter[game]=rust&limit=1', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            return {
                valid: false,
                message: errorData.message || 'Invalid access token'
            };
        }
        
        return { valid: true };
    } catch (error) {
        return {
            valid: false,
            message: 'Failed to validate access token: ' + error.message
        };
    }
}

async function fetchIndianServers() {
    const serverList = document.getElementById('serverList');
    serverList.innerHTML = '<div class="loading">Loading Rust servers from India...</div>';

    try {
        // First validate the access token
        const tokenValidation = await validateAccessToken();
        if (!tokenValidation.valid) {
            serverList.innerHTML = `
                <div class="error-message">
                    Access token validation failed: ${tokenValidation.message}
                    <br>
                    Please contact the administrator to fix this issue.
                </div>
            `;
            return;
        }
        
        // Using the correct endpoint for Rust servers in India
        const response = await fetch('https://api.battlemetrics.com/servers?filter[game]=rust&filter[search]=india&include=game', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch servers');
        }

        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            serverList.innerHTML = '<div class="error-message">No active Rust servers found in India</div>';
            return;
        }

        // Sort servers by player count
        const sortedServers = data.data.sort((a, b) => 
            (b.attributes.players || 0) - (a.attributes.players || 0)
        );

        // Display servers
        serverList.innerHTML = sortedServers.map(server => `
            <div class="server-item">
                <div class="server-info">
                    <span class="server-status-indicator ${server.attributes.status === 'online' ? 'status-online' : 'status-offline'}"></span>
                    <span class="server-name">${server.attributes.name}</span>
                </div>
                <div class="server-details">
                    <span>Players: ${server.attributes.players || 0}/${server.attributes.maxPlayers || 0}</span>
                    <span class="server-game">Rust</span>
                    <span class="server-location">${server.attributes.location || 'India'}</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching servers:', error);
        serverList.innerHTML = `
            <div class="error-message">
                Failed to load Rust servers. Error: ${error.message}
                <br>
                Please check your internet connection and try again.
            </div>
        `;
    }
}

// Update the stats link click handler to fetch servers
statsLink.addEventListener('click', async (e) => {
    e.preventDefault();
    statsPopup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Show loading state
    const serverList = document.getElementById('serverList');
    serverList.innerHTML = '<div class="loading">Validating access token...</div>';
    
    // Validate token first
    const tokenValidation = await validateAccessToken();
    if (!tokenValidation.valid) {
        serverList.innerHTML = `
            <div class="error-message">
                Access token validation failed: ${tokenValidation.message}
                <br>
                Please contact the administrator to fix this issue.
            </div>
        `;
        return;
    }
    
    // If token is valid, fetch servers
    fetchIndianServers();
});

closePopup.addEventListener('click', () => {
    statsPopup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close popup when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === statsPopup) {
        statsPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Golden Players Popup Functionality
const goldenPlayersLink = document.querySelector('header ul li:nth-child(2) a');
const goldenPlayersPopup = document.getElementById('goldenPlayersPopup');
const closeGoldenPlayersPopup = goldenPlayersPopup.querySelector('.close-popup');

// Steam Profile Data
const STEAM_PROFILE = {
    id: '76561199079667777',
    name: 'Shire Akio',
    avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    status: 'Online',
    rustStats: {
        hoursPlayed: '1,250',
        kdRatio: '2.5',
        headshotPercentage: '35%',
        survivalTime: '4.2 hours'
    },
    battleMetrics: {
        serverRank: '#1',
        lastSeen: '2 hours ago'
    }
};

async function fetchBattleMetricsData() {
    try {
        // Fetch player data
        const playerResponse = await fetch(`https://api.battlemetrics.com/players/search?steamId=${STEAM_PROFILE.id}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!playerResponse.ok) {
            throw new Error('Failed to fetch BattleMetrics data');
        }

        const playerData = await playerResponse.json();
        
        if (playerData.data && playerData.data.length > 0) {
            const player = playerData.data[0];
            
            // Fetch server history for Rust
            const serverHistoryResponse = await fetch(`https://api.battlemetrics.com/players/${player.id}/servers?filter[game]=rust`, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Accept': 'application/json'
                }
            });

            if (serverHistoryResponse.ok) {
                const serverHistory = await serverHistoryResponse.json();
                
                // Get most played server
                let mostPlayedServer = 'N/A';
                let lastPlayedRust = 'N/A';
                
                if (serverHistory.data && serverHistory.data.length > 0) {
                    // Sort by playtime to get most played server
                    const sortedServers = serverHistory.data.sort((a, b) => 
                        (b.attributes.playtime || 0) - (a.attributes.playtime || 0)
                    );
                    
                    mostPlayedServer = sortedServers[0].attributes.name;
                    
                    // Get last played time
                    const lastPlayed = new Date(sortedServers[0].attributes.lastSeen);
                    lastPlayedRust = lastPlayed.toLocaleString();
                }

                STEAM_PROFILE.battleMetrics = {
                    serverRank: player.attributes.rank || 'N/A',
                    lastSeen: new Date(player.attributes.lastSeen).toLocaleString(),
                    mostPlayedServer: mostPlayedServer,
                    lastPlayedRust: lastPlayedRust
                };
            }
        }
    } catch (error) {
        console.error('Error fetching BattleMetrics data:', error);
    }
}

function updateSteamProfile() {
    document.getElementById('steamAvatar').src = STEAM_PROFILE.avatar;
    document.getElementById('steamName').textContent = STEAM_PROFILE.name;
    document.getElementById('steamStatus').textContent = STEAM_PROFILE.status;
    
    // Update Rust stats
    document.getElementById('rustHours').textContent = STEAM_PROFILE.rustStats.hoursPlayed;
    document.getElementById('rustKD').textContent = STEAM_PROFILE.rustStats.kdRatio;
    document.getElementById('rustHeadshot').textContent = STEAM_PROFILE.rustStats.headshotPercentage;
    document.getElementById('rustSurvival').textContent = STEAM_PROFILE.rustStats.survivalTime;
    
    // Update BattleMetrics stats
    document.getElementById('serverRank').textContent = STEAM_PROFILE.battleMetrics.serverRank;
    document.getElementById('lastSeen').textContent = STEAM_PROFILE.battleMetrics.lastSeen;
    document.getElementById('mostPlayedServer').textContent = STEAM_PROFILE.battleMetrics.mostPlayedServer;
    document.getElementById('lastPlayedRust').textContent = STEAM_PROFILE.battleMetrics.lastPlayedRust;
}

goldenPlayersLink.addEventListener('click', async (e) => {
    e.preventDefault();
    goldenPlayersPopup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    await fetchBattleMetricsData();
    updateSteamProfile();
});

closeGoldenPlayersPopup.addEventListener('click', () => {
    goldenPlayersPopup.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close Golden Players popup when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === goldenPlayersPopup) {
        goldenPlayersPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const clickSound = document.getElementById("clickSound");
    clickSound.volume = 0.5; // Set volume to 50% (reduced from 70%)
    
    // Add click event listener to the entire document
    document.addEventListener("click", (e) => {
      // Don't play sound if clicking on audio element itself
      if (e.target.id !== 'clickSound') {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
          console.log("Audio playback failed:", error);
        });
      }
    });
});

// Login Popup Functionality
const loginButton = document.getElementById('loginButton');
const loginPopup = document.getElementById('loginPopup');
const closeLoginPopup = loginPopup.querySelector('.close-popup');
const steamLoginButton = document.getElementById('steamLogin');

// Steam OpenID configuration
const STEAM_API_KEY = 'YOUR_STEAM_API_KEY'; // Replace with your Steam API key
const STEAM_RETURN_URL = window.location.origin + '/auth/steam/callback';
const STEAM_REALM = window.location.origin;

// Show login popup
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    loginPopup.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close login popup
closeLoginPopup.addEventListener('click', () => {
    loginPopup.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close login popup when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginPopup) {
        loginPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Handle Steam login
steamLoginButton.addEventListener('click', () => {
    // Construct Steam OpenID URL
    const steamLoginUrl = `https://steamcommunity.com/openid/login?` +
        `openid.ns=http://specs.openid.net/auth/2.0&` +
        `openid.mode=checkid_setup&` +
        `openid.return_to=${encodeURIComponent(STEAM_RETURN_URL)}&` +
        `openid.realm=${encodeURIComponent(STEAM_REALM)}&` +
        `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
        `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

    // Redirect to Steam login
    window.location.href = steamLoginUrl;
});

// Handle regular login form submission
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Here you would typically make an API call to your backend
        // For now, we'll just show a success message
        alert('Login functionality will be implemented with your backend API');
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});
