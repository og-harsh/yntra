(function() {
    // ==========================================
    // 1. INJECT ADVANCED CSS (HOLOGRAPHIC STYLE)
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- FOOTER VARIABLES & ANIMATIONS --- */
        :root {
            --yntra-red: #FF3B30;
            --yntra-dark: #050505;
            --yntra-panel: #0a0a0a;
        }

        @keyframes grid-scroll {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
        }

        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        /* --- FOOTER LAYOUT --- */
        #yntra-footer {
            position: relative;
            background-color: var(--yntra-dark);
            color: white;
            overflow: hidden;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-family: 'Space Grotesk', sans-serif;
            z-index: 50;
        }

        /* Animated Grid Background */
        .footer-grid-bg {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            animation: grid-scroll 20s linear infinite;
            z-index: 0;
            pointer-events: none;
        }

        /* Giant Background Text */
        .footer-bg-text {
            position: absolute;
            bottom: -2vw;
            right: -2vw;
            font-family: 'Syncopate', sans-serif;
            font-weight: 700;
            font-size: 18vw;
            line-height: 1;
            color: transparent;
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.02);
            z-index: 0;
            pointer-events: none;
            user-select: none;
        }

        /* Scanline Overlay */
        .scanline-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 51%);
            background-size: 100% 4px;
            pointer-events: none;
            z-index: 1;
        }

        /* --- CONTENT STYLING --- */
        .footer-content {
            position: relative;
            z-index: 10;
            padding: 4rem 1.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }

        /* Brand Section */
        .brand-logo {
            font-family: 'Syncopate', sans-serif;
            font-weight: 700;
            letter-spacing: 0.1em;
            font-size: 2rem;
            margin-bottom: 1rem;
            display: inline-block;
        }
        
        .brand-desc {
            font-size: 0.85rem;
            color: #888;
            line-height: 1.6;
            max-width: 300px;
            margin-bottom: 2rem;
            border-left: 2px solid var(--yntra-red);
            padding-left: 1rem;
        }

        /* Links */
        .footer-heading {
            font-family: 'Syncopate', sans-serif;
            font-size: 0.75rem;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .footer-heading::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            background: var(--yntra-red);
            box-shadow: 0 0 8px var(--yntra-red);
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .footer-links li { margin-bottom: 0.8rem; }
        .footer-link {
            text-decoration: none;
            color: #666;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        .footer-link:hover {
            color: white;
            transform: translateX(10px);
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }
        .footer-link::before {
            content: '>';
            color: var(--yntra-red);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .footer-link:hover::before { opacity: 1; }

        /* MANIFESTO BUTTON (SPECIAL) */
        .manifesto-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 0.8rem 1.2rem;
            background: rgba(255, 59, 48, 0.05);
            border: 1px solid var(--yntra-red);
            color: var(--yntra-red);
            font-family: 'Syncopate', sans-serif;
            font-weight: 700;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-decoration: none;
            transition: all 0.3s ease;
            margin-bottom: 1rem;
            position: relative;
            overflow: hidden;
        }
        .manifesto-btn::after {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 59, 48, 0.4), transparent);
            transition: 0.5s;
        }
        .manifesto-btn:hover {
            background: var(--yntra-red);
            color: black;
            box-shadow: 0 0 20px rgba(255, 59, 48, 0.4);
        }
        .manifesto-btn:hover::after {
            left: 100%;
        }

        /* Tech Stats Box */
        .tech-stats {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            margin-top: 2rem;
            backdrop-filter: blur(5px);
        }
        .stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            font-family: monospace;
            font-size: 0.75rem;
            color: #888;
        }
        .stat-bar-bg {
            width: 100%;
            height: 2px;
            background: #333;
            margin-bottom: 1rem;
            position: relative;
        }
        .stat-bar-fill {
            height: 100%;
            background: var(--yntra-red);
            position: absolute;
            top: 0; left: 0;
            transition: width 0.5s ease;
            box-shadow: 0 0 5px var(--yntra-red);
        }

        /* Newsletter Terminal */
        .terminal-box {
            background: #000;
            border: 1px solid #333;
            padding: 1.5rem;
            position: relative;
        }
        .terminal-box::after {
            content: '';
            position: absolute;
            top: -1px; left: -1px;
            width: 10px; height: 10px;
            border-top: 2px solid var(--yntra-red);
            border-left: 2px solid var(--yntra-red);
        }
        .terminal-input-group {
            display: flex;
            border: 1px solid #333;
            margin-top: 1rem;
        }
        .terminal-input {
            background: transparent;
            border: none;
            color: white;
            font-family: monospace;
            padding: 1rem;
            width: 100%;
            outline: none;
            font-size: 0.8rem;
        }
        .terminal-btn {
            background: white;
            color: black;
            border: none;
            padding: 0 1.5rem;
            font-weight: bold;
            font-family: monospace;
            cursor: pointer;
            transition: all 0.3s;
        }
        .terminal-btn:hover {
            background: var(--yntra-red);
            color: white;
        }

        /* Social Icons */
        .social-link {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255,255,255,0.1);
            color: #888;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        .social-link:hover {
            border-color: var(--yntra-red);
            color: var(--yntra-red);
            background: rgba(255, 59, 48, 0.05);
            box-shadow: 0 0 15px rgba(255, 59, 48, 0.2);
        }

        /* Bottom Bar */
        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 2rem;
            margin-top: 4rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            font-family: monospace;
            font-size: 13px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        
        @media (min-width: 768px) {
            .footer-bottom {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. INJECT HTML STRUCTURE (THE DASHBOARD)
    // ==========================================
    const footerHTML = `
    <footer id="yntra-footer">
        
        <div class="footer-grid-bg"></div>
        <div class="scanline-overlay"></div>
        <div class="footer-bg-text">SYSTEM</div>

        <div class="footer-content">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <div class="lg:col-span-4 flex flex-col justify-between">
                    <div>
                        <div class="brand-logo text-white">YNTRA</div>
                        <p class="brand-desc">
                            Engineering the future of high-performance computing. Built for the digital elite who refuse to compromise on power.
                        </p>
                    </div>

                    <div class="tech-stats">
                        <div class="stat-row">
                            <span>CPU_LOAD</span>
                            <span id="ft-cpu" class="text-yntra-red">34%</span>
                        </div>
                        <div class="stat-bar-bg"><div id="ft-cpu-bar" class="stat-bar-fill" style="width: 34%"></div></div>
                        
                        <div class="stat-row">
                            <span>MEMORY_ALLOC</span>
                            <span id="ft-mem" class="text-white">1.2GB</span>
                        </div>
                        <div class="stat-bar-bg"><div id="ft-mem-bar" class="stat-bar-fill bg-white" style="width: 60%"></div></div>
                        
                        <div class="stat-row mt-2">
                            <span class="text-[10px]">SERVER: <span class="text-green-500">ONLINE</span></span>
                            <span id="ft-ping" class="text-[10px]">24ms</span>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <h4 class="footer-heading">PROTOCOL</h4>
                    <ul class="footer-links">
                        <li>
                            <a href="manifesto.html" class="manifesto-btn">
                                <i class="fa-solid fa-scroll"></i> Manifesto
                            </a>
                        </li>
                        <li><a href="index.html" class="footer-link">Home_Base</a></li>
                        <li><a href="product.html" class="footer-link">Inventory</a></li>
                        <li><a href="#" class="footer-link">Roadmap</a></li>
                    </ul>
                </div>

                <div class="lg:col-span-2">
                    <h4 class="footer-heading">DATA</h4>
                    <ul class="footer-links">
                        <li><a href="#" class="footer-link">Privacy_Log</a></li>
                        <li><a href="#" class="footer-link">Terms_Init</a></li>
                        <li><a href="#" class="footer-link">Support_Tkt</a></li>
                        <li><a href="#" class="footer-link">API_Access</a></li>
                    </ul>
                </div>

                <div class="lg:col-span-4">
                    <div class="terminal-box">
                        <label class="block text-yntra-red font-mono text-xs mb-2 tracking-widest">// SECURE CONNECTION</label>
                        <p class="text-gray-500 text-xs mb-4 leading-relaxed">
                            Subscribe to the encrypted channel. Receive drop alerts and classified hardware intel.
                        </p>
                        <div class="terminal-input-group">
                            <input type="email" placeholder="ENTER_ID::EMAIL" class="terminal-input">
                            <button class="terminal-btn">[EXE]</button>
                        </div>
                    </div>

                    <div class="mt-8 flex flex-wrap gap-4 justify-start lg:justify-end">
                        <a href="https://www.instagram.com/og._harshh/" class="social-link" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/in/harsh-harsh-75a00b34a" class="social-link" title="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="https://github.com/og-harsh" class="social-link" title="GitHub"><i class="fa-brands fa-github"></i></a>
                    </div>
                </div>

            </div>

            <div class="footer-bottom">
                <div class="flex flex-col md:flex-row gap-4 md:gap-8">
                    <span>© 2026 YNTRA SYSTEMS INC.</span>
                    <span>SECURE SERVER NODE [IND-09]</span>
                </div>
                
            </div>
        </div>
    </footer>
    `;

    // 3. Insert into DOM
    const footerContainer = document.createElement('div');
    footerContainer.innerHTML = footerHTML;
    document.body.appendChild(footerContainer);

    // ==========================================
    // 3. ANIMATION LOGIC (MAKE IT ALIVE)
    // ==========================================
    
    // Live Time
    function updateTime() {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].split('.')[0] + " UTC";
        const el = document.getElementById('ft-time');
        if(el) el.innerText = timeString;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Random Tech Stats Animation
    function animateStats() {
        const cpu = Math.floor(Math.random() * (60 - 20) + 20);
        const ping = Math.floor(Math.random() * (50 - 10) + 10);
        
        const cpuEl = document.getElementById('ft-cpu');
        const cpuBar = document.getElementById('ft-cpu-bar');
        const pingEl = document.getElementById('ft-ping');

        if(cpuEl) {
            cpuEl.innerText = cpu + "%";
            cpuBar.style.width = cpu + "%";
        }
        if(pingEl) pingEl.innerText = ping + "ms";
    }
    setInterval(animateStats, 3000);

})();