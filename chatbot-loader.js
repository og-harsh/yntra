(function() {
    // ==========================================
    // 1. INTELLIGENCE (DATABASE - UPDATED)
    // ==========================================
    const YNTRA_DATA = {
        products: [
            // --- LATEST DROPS (IDs 101-106) ---
            { id: 101, type: 'drop', name: "AeroScout Pro", price: "₹85,000", img: "assets/images/AeroScout Pro.png", keywords: ["drone", "fly", "camera", "surveillance", "aeroscout"] },
            { id: 102, type: 'drop', name: "NovaBook X", price: "₹1,20,000", img: "assets/images/NovaBook X.png", keywords: ["laptop", "computer", "novabook", "computing", "pc"] },
            { id: 103, type: 'drop', name: "Auralis Pro", price: "₹24,999", img: "assets/images/Auralis Pro.png", keywords: ["headphone", "audio", "music", "sound", "headset"] },
            { id: 104, type: 'drop', name: "Spectra One", price: "₹2,50,000", img: "assets/images/Spectra One.png", keywords: ["glass", "vision", "ar", "wearable", "smart"] },
            { id: 105, type: 'drop', name: "MechKey Pro", price: "₹12,500", img: "assets/images/MechKey Pro.png", keywords: ["keyboard", "mechanical", "typing", "rgb"] },
            { id: 106, type: 'drop', name: "FluxPad", price: "₹5,000", img: "assets/images/FluxPad.png", keywords: ["mousepad", "charging", "accessory", "mat"] },
            
            // --- SYSTEM CORE (PS5) ---
            { id: 999, type: 'drop', name: "PlayStation 5 Pro", price: "₹49,990", img: "assets/images/system-core/ps5 (1).png", keywords: ["ps5", "playstation", "console", "gaming", "sony"] },

            // --- PORTAL ITEMS (Arsenal) ---
            { id: "p1", type: 'portal', name: "Alienware M18", price: "₹4,20,000", img: "assets/images/laptops/8.jpg", keywords: ["alienware", "laptop", "gaming", "high performance"] },
            { id: "p2", type: 'portal', name: "MacBook Pro M3", price: "₹3,19,900", img: "assets/images/laptops/1.jpg", keywords: ["macbook", "apple", "mac", "workstation"] },
            { id: "p3", type: 'portal', name: "iPhone 15 Pro Max", price: "₹1,59,900", img: "assets/images/phones/1.jpg", keywords: ["iphone", "mobile", "phone", "apple"] }
        ]
    };

    // ==========================================
    // 2. STYLES (Original Design - NO CHANGES)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* ORIGINAL ANIMATIONS */
        @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-10px); opacity: 1; } }
        .animate-typing { animation: typing 1.4s infinite; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .message-slide { animation: slideIn 0.3s ease forwards; }
        
        /* SCROLLBAR */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF3B30; }
        
        /* BACKGROUND PATTERN */
        .chat-grid-bg {
            background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 30px 30px;
        }

        /* CHAT WINDOW TRANSITION */
        .chat-window { transform: scale(0) translateY(50px); opacity: 0; transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); pointer-events: none; }
        .chat-window.active { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

        /* PRODUCT CARD STYLES INSIDE CHAT */
        .bot-product-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 8px;
            margin-top: 5px;
            display: flex;
            gap: 10px;
            max-width: 100%;
        }
        .bot-product-img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; background: black; }
        .bot-add-btn {
            background: #FF3B30; color: white; border: none; 
            padding: 4px 8px; font-size: 10px; border-radius: 4px; 
            cursor: pointer; margin-top: 4px; font-weight: bold;
        }
        .bot-add-btn:hover { background: white; color: black; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 3. HTML STRUCTURE (Original Design)
    // ==========================================
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'yntra-chatbot-root';
    chatbotContainer.innerHTML = `
        <div onclick="toggleChat()" class="fixed bottom-[30px] right-[30px] w-[70px] h-[70px] bg-gradient-to-br from-[#FF3B30] to-[#C41E3A] rounded-full flex items-center justify-center cursor-pointer shadow-[0_10px_40px_rgba(255,59,48,0.4)] z-[9998] transition-all duration-300 hover:scale-110 animate-pulse">
            <span id="chat-badge" class="absolute -top-[5px] -right-[5px] bg-[#00ff00] text-black w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-[#050505] animate-bounce">1</span>
            <i class="fas fa-comments text-[28px] text-white transition-transform duration-300" id="trigger-icon"></i>
        </div>

        <div id="chatWindow" class="chat-window fixed bottom-[120px] right-[30px] w-[420px] h-[600px] bg-[#0a0a0a] border border-[#FF3B30]/30 rounded-[20px] shadow-[0_20px_80px_rgba(0,0,0,0.9)] z-[9999] flex flex-col origin-bottom-right overflow-hidden max-md:w-[calc(100%-20px)] max-md:h-[calc(100%-120px)] max-md:right-[10px] max-md:bottom-[100px]">
            
            <div class="bg-gradient-to-br from-[#FF3B30] to-[#C41E3A] p-5 flex items-center justify-between border-b-2 border-white/10">
                <div class="flex items-center gap-3">
                    <div class="w-[45px] h-[45px] bg-black rounded-full flex items-center justify-center border-2 border-white/30 text-white"><i class="fas fa-robot"></i></div>
                    <div>
                        <h3 class="text-white font-bold text-[14px] tracking-wider">YNTRA SYSTEM</h3>
                        <p class="text-white/90 text-[11px] flex items-center gap-1.5"><span class="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></span> Online</p>
                    </div>
                </div>
                <button onclick="toggleChat()" class="text-white text-xl hover:rotate-90 transition-transform"><i class="fas fa-times"></i></button>
            </div>

            <div id="chatMessages" class="chat-messages custom-scrollbar chat-grid-bg flex-1 p-5 overflow-y-auto flex flex-col gap-[15px] bg-[#050505] text-white">
                <div class="text-center py-10 px-5 opacity-70">
                    <i class="fas fa-fingerprint text-[60px] text-[#FF3B30] mb-5"></i>
                    <h4 class="font-bold text-[16px] mb-2">SYSTEM INITIALIZED</h4>
                    <p class="text-[13px] font-mono">Inventory Database: CONNECTED<br>How can I assist you today?</p>
                </div>
            </div>

            <div class="flex flex-wrap gap-2 px-5 py-2 bg-[#0a0a0a]">
                <button onclick="sendQuickReply('Check PS5 Stock')" class="bg-[#1a1a1a] border border-[#FF3B30]/30 text-white py-1.5 px-3 rounded-full text-[11px] hover:bg-[#FF3B30] transition-all">🎮 PS5 Stock</button>
                <button onclick="sendQuickReply('Show Drones')" class="bg-[#1a1a1a] border border-[#FF3B30]/30 text-white py-1.5 px-3 rounded-full text-[11px] hover:bg-[#FF3B30] transition-all">🚁 Drones</button>
                <button onclick="sendQuickReply('Payment Options')" class="bg-[#1a1a1a] border border-[#FF3B30]/30 text-white py-1.5 px-3 rounded-full text-[11px] hover:bg-[#FF3B30] transition-all">💳 Payment</button>
            </div>

            <div id="typingIndicator" class="hidden items-center gap-2.5 p-3 px-4 bg-[#1a1a1a] rounded-xl w-fit ml-5 mb-2 border border-white/5">
                <div class="flex gap-1">
                    <span class="w-2 h-2 bg-[#FF3B30] rounded-full animate-typing"></span>
                    <span class="w-2 h-2 bg-[#FF3B30] rounded-full animate-typing [animation-delay:0.2s]"></span>
                    <span class="w-2 h-2 bg-[#FF3B30] rounded-full animate-typing [animation-delay:0.4s]"></span>
                </div>
            </div>

            <div class="p-4 bg-[#0a0a0a] border-t border-white/10 flex gap-2">
                <input type="text" id="chatInput" placeholder="Enter command..." class="flex-1 bg-[#1a1a1a] border border-white/10 text-white py-2.5 px-4 rounded-full text-sm outline-none focus:border-[#FF3B30] font-mono">
                <button onclick="sendMessage()" class="w-10 h-10 bg-[#FF3B30] rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // ==========================================
    // 4. SMART LOGIC (Updated Brain)
    // ==========================================
    let chatOpen = false;
    
    // Helper to handle mixed cart logic
    window.handleBotCart = function(id, name, price, type) {
        if(type === 'drop') {
            if(window.addToCart) window.addToCart(id);
        } else {
            if(window.portalAddToCart) window.portalAddToCart(name, price);
        }
    };

    window.toggleChat = function() {
        chatOpen = !chatOpen;
        const chatWindow = document.getElementById('chatWindow');
        const icon = document.getElementById('trigger-icon');
        const badge = document.getElementById('chat-badge');

        if (chatOpen) {
            chatWindow.classList.add('active');
            icon.classList.add('rotate-90');
            if (badge) badge.style.display = 'none';
        } else {
            chatWindow.classList.remove('active');
            icon.classList.remove('rotate-90');
        }
    };

    window.sendMessage = function() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        // 1. Add User Message
        addUserMessage(msg);
        input.value = '';

        // 2. Show Typing
        document.getElementById('typingIndicator').classList.remove('hidden');
        const messagesDiv = document.getElementById('chatMessages');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        
        // 3. Process AI Response
        setTimeout(() => {
            document.getElementById('typingIndicator').classList.add('hidden');
            const response = processQuery(msg);
            addBotMessage(response.text, response.products);
        }, 800);
    };

    window.sendQuickReply = function(msg) {
        document.getElementById('chatInput').value = msg;
        sendMessage();
    };

    function processQuery(query) {
        const q = query.toLowerCase();

        // Database Search
        const found = YNTRA_DATA.products.filter(p => p.keywords.some(k => q.includes(k)));

        if(found.length > 0) {
            return {
                text: `ACCESS GRANTED: Found ${found.length} matching units in the arsenal. Deploying details...`,
                products: found
            };
        }

        if(q.includes('payment') || q.includes('pay') || q.includes('card')) {
            return { text: "SECURE GATEWAY: We use a proprietary dummy payment protocol. Log in, add items, and click 'Initialize Checkout' to test the encrypted transaction simulation." };
        }
        
        if(q.includes('login') || q.includes('profile') || q.includes('account')) {
            return { text: "IDENTITY PROTOCOL: Click the User Icon in the top right to access your Agent Profile or create a new identity." };
        }

        if(q.includes('hello') || q.includes('hi') || q.includes('status')) {
            return { text: "SYSTEM ONLINE. YNTRA Core v2.026 ready for commands. Awaiting input..." };
        }

        return { text: "UNKNOWN COMMAND: Query not recognized in the database. Try searching for specific hardware like 'Drones', 'PS5', 'Laptops', or 'Keyboards'." };
    }

    function addUserMessage(text) {
        const msgDiv = document.getElementById('chatMessages');
        msgDiv.innerHTML += `
            <div class="flex flex-row-reverse gap-2 message-slide">
                <div class="bg-gradient-to-br from-[#FF3B30] to-[#C41E3A] p-3 rounded-xl rounded-tr-none text-sm max-w-[80%] font-mono shadow-lg">${text}</div>
            </div>
        `;
        msgDiv.scrollTop = msgDiv.scrollHeight;
    }

    function addBotMessage(text, products = null) {
        const msgDiv = document.getElementById('chatMessages');
        
        let productHtml = '';
        if(products) {
            products.forEach(p => {
                // Determine if ID is number or string for function call
                const idParam = typeof p.id === 'string' ? `'${p.id}'` : p.id;
                
                productHtml += `
                    <div class="bot-product-card">
                        <img src="${p.img}" class="bot-product-img" onerror="this.src='https://via.placeholder.com/40'">
                        <div class="flex-1">
                            <div class="text-[11px] font-bold text-white">${p.name}</div>
                            <div class="text-[10px] text-[#FF3B30]">${p.price}</div>
                            <button onclick="window.handleBotCart(${idParam}, '${p.name}', '${p.price}', '${p.type}'); this.innerText='ADDED'" class="bot-add-btn">ADD TO ARSENAL</button>
                        </div>
                    </div>
                `;
            });
        }

        msgDiv.innerHTML += `
            <div class="flex gap-2 message-slide">
                <div class="w-8 h-8 rounded-full bg-[#111] border border-white/20 flex items-center justify-center shrink-0 text-xs"><i class="fas fa-terminal text-gray-400"></i></div>
                <div class="bg-[#1a1a1a] p-3 rounded-xl rounded-tl-none text-sm max-w-[85%] border border-white/5 shadow-lg">
                    <p class="text-gray-300 font-mono text-xs mb-1">${text}</p>
                    ${productHtml}
                </div>
            </div>
        `;
        msgDiv.scrollTop = msgDiv.scrollHeight;
    }

    // Enter Key
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && document.activeElement.id === 'chatInput') sendMessage();
    });

})();