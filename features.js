/* ===== Global Floating Features Logic ===== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Robust Music Player Logic
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    if (musicBtn && bgMusic) {
        bgMusic.volume = 0.8;
        
        musicBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    musicBtn.classList.add('playing');
                    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }).catch(err => {
                    console.log("Play failed, attempting unmuted/muted toggle...");
                    bgMusic.muted = false;
                    bgMusic.play();
                    musicBtn.classList.add('playing');
                    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                });
            } else {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    // 2. Chatbot Logic
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    if (chatbotBtn && chatWindow) {
        chatbotBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });

        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatWindow.classList.remove('active');
            });
        }

        const handleSend = () => {
            const text = chatInput.value.trim();
            if (text) {
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'msg user';
                userMsg.innerText = text;
                chatMessages.appendChild(userMsg);
                chatInput.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simple bot response placeholder
                setTimeout(() => {
                    const botMsg = document.createElement('div');
                    botMsg.className = 'msg bot';
                    botMsg.innerText = "Thank you for reaching out to Braj Nidhi. How can I assist you with your divine stay or event in Vrindavan?";
                    chatMessages.appendChild(botMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        };

        if (sendMessage) {
            sendMessage.addEventListener('click', handleSend);
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }
    }
});
