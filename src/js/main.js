/**
 * Neural Echo: Parallel Minds
 * Main Application - Initializes and coordinates all components
 */

class NeuralEchoApp {
    constructor() {
        this.initialized = false;
        this.loadingElement = null;
    }
    
    /**
     * Initialize the application
     */
    async initialize() {
        try {
            // Show loading screen
            this.showLoading();
            
            console.log("Initializing Neural Echo: Parallel Minds...");
            
            // Initialize components in sequence
            await this.initializeDatabase();
            await this.initializeNarrativeEngine();
            await this.initializeKnowledgeGraph();
            await this.initializeTimelineManager();
            await this.initializeUI();
            await this.initializeAudio();
            
            // Set initial game state
            await this.startGame();
            
            // Hide loading screen
            this.hideLoading();
            
            this.initialized = true;
            console.log("Neural Echo: Parallel Minds initialized successfully");
            return true;
        } catch (error) {
            console.error("Failed to initialize Neural Echo:", error);
            this.showErrorScreen(error);
            return false;
        }
    }
    
    /**
     * Initialize the database
     */
    async initializeDatabase() {
        console.log("Initializing database...");
        
        // Check if dbManager exists
        if (!window.dbManager) {
            console.error("Database manager not found on window object");
            // Create it if needed
            window.dbManager = new DatabaseManager();
        }
        
        const success = await window.dbManager.initialize();
        if (!success) throw new Error("Failed to initialize database");
        return success;
    }
    
    /**
     * Initialize the narrative engine
     */
    async initializeNarrativeEngine() {
        console.log("Initializing narrative engine...");
        
        // Check if narrativeEngine exists
        if (!window.narrativeEngine) {
            console.error("Narrative engine not found on window object");
            // Create it if needed
            window.narrativeEngine = new NarrativeEngine();
        }
        
        const success = await window.narrativeEngine.initialize();
        if (!success) throw new Error("Failed to initialize narrative engine");
        return success;
    }
    
    /**
     * Initialize the knowledge graph
     */
    async initializeKnowledgeGraph() {
        console.log("Initializing knowledge graph...");
        
        // Check if knowledgeGraph exists
        if (!window.knowledgeGraph) {
            console.error("Knowledge graph not found on window object");
            // Create it if needed
            window.knowledgeGraph = new KnowledgeGraphManager();
        }
        
        const success = await window.knowledgeGraph.initialize();
        if (!success) throw new Error("Failed to initialize knowledge graph");
        return success;
    }
    
    /**
     * Initialize the timeline manager
     */
    async initializeTimelineManager() {
        console.log("Initializing timeline manager...");
        
        // Check if timelineManager exists
        if (!window.timelineManager) {
            console.error("Timeline manager not found on window object");
            // Create it if needed
            window.timelineManager = new TimelineManager();
        }
        
        const success = await window.timelineManager.initialize();
        if (!success) throw new Error("Failed to initialize timeline manager");
        return success;
    }
    
    /**
     * Initialize the UI controller
     */
    async initializeUI() {
        console.log("Initializing UI...");
        
        // Check if uiController exists
        if (!window.uiController) {
            console.error("UI controller not found on window object");
            // Create it if needed
            window.uiController = new UIController();
        }
        
        const success = await window.uiController.initialize();
        if (!success) throw new Error("Failed to initialize UI");
        return success;
    }
    
    /**
     * Initialize the audio manager
     */
    async initializeAudio() {
        console.log("Initializing audio...");
        
        // Check if audioManager exists
        if (!window.audioManager) {
            console.error("Audio manager not found on window object");
            // Create it if needed
            window.audioManager = new AudioManager();
        }
        
        const success = await window.audioManager.initialize();
        if (!success) throw new Error("Failed to initialize audio");
        return success;
    }
    
    /**
     * Start the game
     */
    async startGame() {
        console.log("Starting game...");
        
        try {
            // Get initial game state
            const gameState = await window.dbManager.getGameState();
            if (!gameState) {
                throw new Error("Failed to get initial game state");
            }
            
            const startingNodeId = gameState.current_node_id;
            console.log(`Starting with node ID: ${startingNodeId}`);
            
            // Set the current node in the narrative engine
            const startingNode = await window.narrativeEngine.setCurrentNode(startingNodeId);
            if (!startingNode) {
                throw new Error(`Failed to set starting node with ID ${startingNodeId}`);
            }
            
            // Display the starting node in the UI
            await window.uiController.displayNode(startingNode);
            
            // Update UI elements
            const timeline = await window.timelineManager.getCurrentTimeline();
            if (timeline) {
                const timelineIndicator = document.getElementById('timeline-indicator');
                if (timelineIndicator) {
                    timelineIndicator.textContent = `Timeline: ${timeline.name}`;
                }
            }
            
            console.log("Game started successfully");
            return true;
        } catch (error) {
            console.error("Failed to start game:", error);
            this.showErrorScreen(error);
            return false;
        }
    }
    
    /**
     * Show loading screen
     */
    showLoading() {
        this.loadingElement = document.createElement('div');
        this.loadingElement.classList.add('loading-screen');
        
        this.loadingElement.innerHTML = `
            <div class="loading-content">
                <h1>Neural Echo: Parallel Minds</h1>
                <div class="loading-spinner"></div>
                <p>Initializing neural pathways...</p>
            </div>
        `;
        
        document.body.appendChild(this.loadingElement);
    }
    
    /**
     * Hide loading screen
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(this.loadingElement);
                this.loadingElement = null;
            }, 500);
        }
    }
    
    /**
     * Show error screen
     */
    showErrorScreen(error) {
        if (this.loadingElement) {
            document.body.removeChild(this.loadingElement);
            this.loadingElement = null;
        }
        
        const errorElement = document.createElement('div');
        errorElement.classList.add('error-screen');
        
        errorElement.innerHTML = `
            <div class="error-content">
                <h1>Initialization Error</h1>
                <p>Neural Echo could not be initialized due to an error:</p>
                <pre>${error.message}</pre>
                <button id="retry-button">Retry</button>
            </div>
        `;
        
        document.body.appendChild(errorElement);
        
        // Add retry button handler
        document.getElementById('retry-button').addEventListener('click', () => {
            document.body.removeChild(errorElement);
            this.initialize();
        });
    }
}

// Add CSS for loading and error screens
(function() {
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
.loading-screen, .error-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(10, 11, 17, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    transition: opacity 0.5s ease;
}

.loading-screen.fade-out {
    opacity: 0;
}

.loading-content, .error-content {
    text-align: center;
    color: #f5f6fa;
}

.loading-content h1, .error-content h1 {
    font-family: 'Space Mono', monospace;
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #38ada9;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(255, 255, 255, 0.1);
    border-top: 5px solid #38ada9;
    border-radius: 50%;
    margin: 0 auto 1rem auto;
    animation: spin 1s linear infinite;
}

.error-content pre {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    text-align: left;
    max-width: 80%;
    margin: 1rem auto;
}

#retry-button {
    background-color: #38ada9;
    color: white;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    font-family: 'Work Sans', sans-serif;
    cursor: pointer;
    margin-top: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
    document.head.appendChild(loadingStyle);
})();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure all UI elements are properly initialized before starting the application
    setTimeout(() => {
        // Make sure all DOM elements are accessible
        const initElements = () => {
            // Check for required DOM elements
            const requiredElements = [
                'narrative-text',
                'choice-container',
                'scene-image',
                'current-storyline',
                'timeline-indicator',
                'timeline-visualization',
                'relationship-graph'
            ];
            
            const missingElements = requiredElements.filter(id => !document.getElementById(id));
            
            if (missingElements.length > 0) {
                console.error('Missing required DOM elements:', missingElements);
                return false;
            }
            
            return true;
        };
        
        // Initialize the application if elements are available
        if (initElements()) {
            console.log('All required DOM elements found, initializing application...');
            window.neuralEchoApp = new NeuralEchoApp();
            window.neuralEchoApp.initialize().catch(error => {
                console.error('Application initialization failed:', error);
            });
        } else {
            console.error('Application initialization aborted due to missing DOM elements');
        }
    }, 100); // Short delay to ensure DOM is fully available
});