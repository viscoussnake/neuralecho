/**
 * Neural Echo: Parallel Minds
 * UI Controller - Manages user interface and interactions
 */

class UIController {
    constructor() {
        // Defer DOM element access until initialization
        this.narrativeText = null;
        this.choiceContainer = null;
        this.sceneImage = null;
        this.currentStoryline = null;
        this.initialized = false;
    }
    
    // Get DOM elements
    getDOMElements() {
        this.narrativeText = document.getElementById('narrative-text');
        this.choiceContainer = document.getElementById('choice-container');
        this.sceneImage = document.getElementById('scene-image');
        this.currentStoryline = document.getElementById('current-storyline');
        
        // Check if all required elements exist
        return this.narrativeText && this.choiceContainer && 
               this.sceneImage && this.currentStoryline;
    }
    
    /**
     * Initialize the UI controller
     */
    async initialize() {
        try {
            // Get DOM elements
            if (!this.getDOMElements()) {
                throw new Error("Failed to get required DOM elements");
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            this.initialized = true;
            console.log("UI controller initialized");
            return true;
        } catch (error) {
            console.error("Failed to initialize UI controller:", error);
            return false;
        }
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Event delegation for choice buttons
        this.choiceContainer.addEventListener('click', async (event) => {
            if (event.target.classList.contains('choice-button')) {
                const choiceId = parseInt(event.target.dataset.choiceId, 10);
                await this.handleChoice(choiceId);
            }
        });
    }
    
    /**
     * Display a narrative node
     */
    async displayNode(node) {
        if (!node) return;
        
        // Update storyline indicator
        const storyline = await window.narrativeEngine.getNodeStoryline(node.id);
        if (storyline) {
            // Update storyline indicator
            this.currentStoryline.textContent = storyline.name;
            this.currentStoryline.className = ''; // Remove all classes
            this.currentStoryline.classList.add(storyline.name.toLowerCase());
            
            // Play appropriate music for the storyline
            if (window.audioManager && window.audioManager.initialized) {
                window.audioManager.playStorylineMusic(storyline.name);
            }
        }
        
        // Display node title and content
        this.narrativeText.innerHTML = `<h2>${node.title}</h2><p>${this.formatNarrativeText(node.content)}</p>`;
        
        // Animate text appearance
        this.narrativeText.querySelectorAll('p').forEach(p => {
            p.classList.add('text-animated');
        });
        
        // Display image if available, or generate procedural visualization based on storyline
        if (node.image_path) {
            this.sceneImage.style.backgroundImage = `url(${node.image_path})`;
            this.sceneImage.style.display = 'block';
            this.sceneImage.innerHTML = '';
        } else {
            // Generate procedural visualization based on storyline
            const storyline = await window.narrativeEngine.getNodeStoryline(node.id);
            
            if (storyline) {
                // Clear background image
                this.sceneImage.style.backgroundImage = 'none';
                
                // Generate SVG visualization based on storyline
                let svgContent;
                
                switch(storyline.name.toLowerCase()) {
                    case 'clinical':
                        // Hospital/medical theme - clean, organized grid pattern
                        svgContent = this.generateClinicalVisualization();
                        break;
                    case 'ai':
                        // AI theme - digital, network pattern
                        svgContent = this.generateAIVisualization();
                        break;
                    case 'family':
                        // Family theme - warm, organic shapes
                        svgContent = this.generateFamilyVisualization();
                        break;
                    default:
                        svgContent = '<div style="opacity: 0.4;">Scene visualization</div>';
                }
                
                this.sceneImage.innerHTML = svgContent;
            } else {
                this.sceneImage.style.backgroundImage = 'none';
                this.sceneImage.innerHTML = '<div style="opacity: 0.4;">Scene visualization</div>';
            }
        }
        
        // If it's a choice node, display choices
        if (node.is_choice_node) {
            await this.displayChoices(node.id);
        } else {
            // If it's not a choice node, display a continue button
            this.displayContinueButton(node.id);
        }
        
        // Scroll narrative container to top
        document.getElementById('narrative-container').scrollTop = 0;
    }
    
    /**
     * Format narrative text with styling
     */
    formatNarrativeText(text) {
        // Convert line breaks to paragraphs
        const paragraphs = text.split('\n\n');
        return paragraphs.map(p => p.trim()).filter(p => p.length > 0).join('</p><p>');
    }
    
    /**
     * Display choices for a node
     */
    async displayChoices(nodeId) {
        const choices = await window.narrativeEngine.getChoicesForNode(nodeId);
        
        // Clear choice container
        this.choiceContainer.innerHTML = '';
        
        // If no choices, return
        if (!choices || choices.length === 0) return;
        
        // Create a button for each choice
        choices.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.classList.add('choice-button');
            
            // Get the storyline of the next node to color-code the choice
            const nextNode = window.narrativeEngine.getNode(choice.next_node_id);
            if (nextNode) {
                const storylineId = nextNode.storyline_id;
                if (storylineId === 1) choiceButton.classList.add('clinical');
                if (storylineId === 2) choiceButton.classList.add('ai');
                if (storylineId === 3) choiceButton.classList.add('family');
            }
            
            choiceButton.textContent = choice.text;
            choiceButton.dataset.choiceId = choice.id;
            
            this.choiceContainer.appendChild(choiceButton);
        });
    }
    
    /**
     * Display a continue button for non-choice nodes
     */
    displayContinueButton(nodeId) {
        // Clear choice container
        this.choiceContainer.innerHTML = '';
        
        // Create continue button
        const continueButton = document.createElement('button');
        continueButton.classList.add('choice-button');
        continueButton.textContent = 'Continue...';
        
        // Set up handler for continue button
        continueButton.addEventListener('click', async () => {
            // For now, just go to the next sequential node
            // In a real implementation, this would follow narrative logic
            const nextNodeId = nodeId + 1;
            const nextNode = window.narrativeEngine.getNode(nextNodeId);
            
            if (nextNode) {
                await window.narrativeEngine.setCurrentNode(nextNodeId);
                await this.displayNode(nextNode);
            } else {
                console.error('No next node found');
            }
        });
        
        this.choiceContainer.appendChild(continueButton);
    }
    
    /**
     * Handle a choice selection
     */
    async handleChoice(choiceId) {
        // Disable all choice buttons while processing
        const choiceButtons = this.choiceContainer.querySelectorAll('.choice-button');
        choiceButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = 0.5;
        });
        
        try {
            // Track the previous node to detect loops
            const prevNodeId = window.narrativeEngine.currentNodeId;
            
            // Process the choice
            const nextNode = await window.narrativeEngine.makeChoice(choiceId);
            
            // Check for a potential loop (same node after choice)
            if (nextNode && nextNode.id === prevNodeId) {
                console.warn("Detected a potential loop in narrative flow", {
                    choiceId,
                    nodeId: prevNodeId
                });
                
                // Add a notification about the loop
                this.showNotification("Strange temporal loop detected...");
            }
            
            // Check if this choice creates a timeline branch
            const currentChoices = await window.narrativeEngine.getChoicesForNode(window.narrativeEngine.currentNodeId);
            const selectedChoice = currentChoices ? currentChoices.find(c => c.id === choiceId) : null;
            
            // If there are multiple choices and we found the selected choice, this is a potential branch point
            if (currentChoices && currentChoices.length > 1 && selectedChoice) {
                // 20% chance of creating a timeline branch when making significant choices
                const shouldBranch = Math.random() < 0.2;
                
                if (shouldBranch) {
                    // Create a new timeline branch
                    const branchName = window.timelineManager.generateTimelineName();
                    const choiceText = selectedChoice.text || "Unknown choice";
                    await window.timelineManager.createTimelineBranch(
                        branchName,
                        `Timeline created by choosing "${choiceText}"`,
                        window.narrativeEngine.currentNodeId
                    );
                    
                    // Show a notification about the branch
                    this.showNotification(`Timeline branch created: ${branchName}`);
                }
            }
            
            // Display the next node
            if (nextNode) {
                await this.displayNode(nextNode);
                
                // Update visualizations
                await window.knowledgeGraph.updateVisualization();
                await window.timelineManager.updateVisualization();
            }
        } catch (error) {
            console.error("Error handling choice:", error);
        }
    }
    
    /**
     * Show a notification to the user
     */
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    /**
     * Update the current storyline indicator
     */
    updateStorylineIndicator(storylineName) {
        this.currentStoryline.textContent = storylineName;
        this.currentStoryline.className = ''; // Remove all classes
        this.currentStoryline.classList.add(storylineName.toLowerCase());
    }
    
    /**
     * Update memory fragments counter
     */
    updateMemoryFragments(count) {
        document.getElementById('memory-fragments').textContent = `Memory Fragments: ${count}`;
    }
    
    /**
     * Generate clinical/hospital visualization
     */
    generateClinicalVisualization() {
        const width = 400;
        const height = 200;
        
        let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="clinical-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1a2a3a" />
                    <stop offset="100%" stop-color="#0e1822" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#clinical-bg)" />`;
        
        // Add grid pattern (hospital floor/ceiling)
        for (let x = 0; x < width; x += 20) {
            svg += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#2a3a4a" stroke-width="1" opacity="0.3" />`;
        }
        
        for (let y = 0; y < height; y += 20) {
            svg += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#2a3a4a" stroke-width="1" opacity="0.3" />`;
        }
        
        // Add EKG-like heartbeat line
        let heartbeatPath = "M 0,100 ";
        for (let x = 20; x < width; x += 40) {
            heartbeatPath += `L ${x-10},100 L ${x},70 L ${x+5},120 L ${x+10},100 `;
        }
        svg += `<path d="${heartbeatPath}" stroke="#e84118" stroke-width="2" fill="none" />`;
        
        // Medical cross symbol
        svg += `
            <circle cx="${width - 50}" cy="50" r="20" fill="none" stroke="#e84118" stroke-width="2" />
            <line x1="${width - 50}" y1="35" x2="${width - 50}" y2="65" stroke="#e84118" stroke-width="4" />
            <line x1="${width - 65}" y1="50" x2="${width - 35}" y2="50" stroke="#e84118" stroke-width="4" />
        `;
        
        svg += `</svg>`;
        
        return svg;
    }
    
    /**
     * Generate AI-themed visualization
     */
    generateAIVisualization() {
        const width = 400;
        const height = 200;
        
        let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="ai-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0a1a2a" />
                    <stop offset="100%" stop-color="#061428" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#ai-bg)" />`;
        
        // Generate nodes for a neural network visualization
        const nodes = [];
        for (let i = 0; i < 20; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: 2 + Math.random() * 4
            });
        }
        
        // Draw connections between nodes
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() < 0.3) {
                    const distance = Math.sqrt(
                        Math.pow(nodes[i].x - nodes[j].x, 2) + 
                        Math.pow(nodes[i].y - nodes[j].y, 2)
                    );
                    
                    if (distance < 100) {
                        const opacity = 1 - (distance / 100);
                        svg += `<line 
                            x1="${nodes[i].x}" y1="${nodes[i].y}" 
                            x2="${nodes[j].x}" y2="${nodes[j].y}" 
                            stroke="#00a8ff" stroke-width="1" opacity="${opacity}" 
                        />`;
                    }
                }
            }
        }
        
        // Draw nodes
        for (const node of nodes) {
            svg += `<circle cx="${node.x}" cy="${node.y}" r="${node.radius}" fill="#00a8ff" />`;
        }
        
        // Draw binary code at the bottom
        let binaryY = height - 20;
        for (let x = 10; x < width; x += 15) {
            const digit = Math.random() < 0.5 ? "0" : "1";
            const opacity = 0.5 + (Math.random() * 0.5);
            svg += `<text x="${x}" y="${binaryY}" fill="#00a8ff" font-family="monospace" font-size="10" opacity="${opacity}">${digit}</text>`;
        }
        
        svg += `</svg>`;
        
        return svg;
    }
    
    /**
     * Generate family-themed visualization
     */
    generateFamilyVisualization() {
        const width = 400;
        const height = 200;
        
        let svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="family-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2c2c54" />
                    <stop offset="100%" stop-color "#1e1e2f" />
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#family-bg)" />`;
        
        // Add sun
        svg += `
            <circle cx="50" cy="50" r="30" fill="#fbc531" opacity="0.8" />
            <circle cx="50" cy="50" r="20" fill="#fbc531" />
        `;
        
        // Add childlike drawing of a house
        svg += `
            <rect x="250" y="100" width="80" height="70" fill="#706fd3" />
            <polygon points="250,100 330,100 290,60" fill="#ff793f" />
            <rect x="280" y="140" width="20" height="30" fill="#33d9b2" />
            <rect x="260" y="110" width="15" height="15" fill="#34ace0" />
            <rect x="305" y="110" width="15" height="15" fill="#34ace0" />
        `;
        
        // Add childlike drawing of figures (stick figures)
        // Adult figure
        svg += `
            <circle cx="200" cy="110" r="10" fill="#ffda79" />
            <line x1="200" y1="120" x2="200" y2="150" stroke="#ffda79" stroke-width="3" />
            <line x1="200" y1="130" x2="180" y2="140" stroke="#ffda79" stroke-width="3" />
            <line x1="200" y1="130" x2="220" y2="140" stroke="#ffda79" stroke-width="3" />
            <line x1="200" y1="150" x2="190" y2="170" stroke="#ffda79" stroke-width="3" />
            <line x1="200" y1="150" x2="210" y2="170" stroke="#ffda79" stroke-width="3" />
        `;
        
        // Child figure
        svg += `
            <circle cx="170" cy="120" r="7" fill="#ffda79" />
            <line x1="170" y1="127" x2="170" y2="150" stroke="#ffda79" stroke-width="2" />
            <line x1="170" y1="135" x2="160" y2="145" stroke="#ffda79" stroke-width="2" />
            <line x1="170" y1="135" x2="180" y2="145" stroke="#ffda79" stroke-width="2" />
            <line x1="170" y1="150" x2="165" y2="165" stroke="#ffda79" stroke-width="2" />
            <line x1="170" y1="150" x2="175" y2="165" stroke="#ffda79" stroke-width="2" />
        `;
        
        // Grass
        for (let x = 0; x < width; x += 20) {
            const grassHeight = 5 + Math.random() * 10;
            svg += `<path d="M ${x},${height} C ${x-5},${height-grassHeight} ${x},${height-grassHeight*1.5} ${x},${height-grassHeight}" stroke="#33d9b2" stroke-width="2" fill="none" />`;
        }
        
        svg += `</svg>`;
        
        return svg;
    }
}

// UI controller initialization is now handled in index.html

// Add CSS for notifications
(function() {
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: rgba(108, 92, 231, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
        animation: notification-in 0.3s ease-out forwards;
    }

    .notification.fade-out {
        animation: notification-out 0.5s ease-in forwards;
    }

    @keyframes notification-in {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    @keyframes notification-out {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-20px); opacity: 0; }
    }
    `;
    document.head.appendChild(notificationStyle);
})();