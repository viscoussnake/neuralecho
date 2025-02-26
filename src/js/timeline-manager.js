/**
 * Neural Echo: Parallel Minds
 * Timeline Manager - Handles timeline branching and visualization
 */

class TimelineManager {
    constructor() {
        this.timelines = [];
        this.currentTimelineId = null;
        this.initialized = false;
        this.timelineSvg = null;
    }
    
    /**
     * Initialize the timeline manager
     */
    async initialize() {
        try {
            // Set initial timeline from game state
            const gameState = await window.dbManager.getGameState();
            this.currentTimelineId = gameState.timeline_id;
            
            // Get all timelines
            this.timelines = await this.loadTimelines();
            
            this.initialized = true;
            console.log("Timeline manager initialized with current timeline:", this.currentTimelineId);
            
            // Initialize visualization
            this.initVisualization();
            
            return true;
        } catch (error) {
            console.error("Failed to initialize timeline manager:", error);
            return false;
        }
    }
    
    /**
     * Load timelines from the database
     */
    async loadTimelines() {
        // In a full implementation, this would query the database
        // For now, we'll use the timelines loaded in the database manager
        return window.dbManager.timelines;
    }
    
    /**
     * Initialize the timeline visualization
     */
    initVisualization() {
        const timelineContainer = document.getElementById('timeline-visualization');
        
        // Clear any existing content
        timelineContainer.innerHTML = '';
        
        // Create SVG element for the timeline
        this.timelineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.timelineSvg.setAttribute('width', '100%');
        this.timelineSvg.setAttribute('height', '100%');
        this.timelineSvg.style.overflow = 'visible';
        
        timelineContainer.appendChild(this.timelineSvg);
        
        // Draw the initial timeline
        this.updateVisualization();
    }
    
    /**
     * Update the timeline visualization
     */
    async updateVisualization() {
        if (!this.timelineSvg) return;
        
        // Clear existing visualization
        this.timelineSvg.innerHTML = '';
        
        // Reload timelines
        this.timelines = await this.loadTimelines();
        
        // Refresh current timeline ID from game state
        const gameState = await window.dbManager.getGameState();
        this.currentTimelineId = gameState.timeline_id;
        
        // Draw timeline tree
        this.drawTimelineTree();
    }
    
    /**
     * Draw the timeline tree visualization
     */
    drawTimelineTree() {
        // Simple tree layout
        // In a real implementation, we'd use a library like D3.js
        // For this prototype, we'll do a simple vertical tree
        
        const width = this.timelineSvg.clientWidth;
        const height = this.timelineSvg.clientHeight;
        
        // Build timeline hierarchy
        const root = this.timelines.find(t => !t.parent_id);
        if (!root) return;
        
        // Keep track of timeline nodes by ID
        const timelineNodes = {};
        
        // Function to recursively draw timelines
        const drawTimeline = (timeline, x, y, level = 0) => {
            // Calculate child timelines
            const children = this.timelines.filter(t => t.parent_id === timeline.id);
            
            // Create timeline node
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', timeline.id === this.currentTimelineId ? 8 : 5);
            circle.setAttribute('fill', timeline.id === this.currentTimelineId ? '#6c5ce7' : '#636e72');
            circle.setAttribute('stroke', '#dfe6e9');
            circle.setAttribute('stroke-width', '2');
            
            // Store node position
            timelineNodes[timeline.id] = { x, y };
            
            // Add text label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y - 12);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#dfe6e9');
            text.setAttribute('font-size', '8px');
            text.textContent = timeline.name;
            
            this.timelineSvg.appendChild(circle);
            this.timelineSvg.appendChild(text);
            
            // Position and draw children
            if (children.length > 0) {
                const childWidth = width / (children.length + 1);
                
                children.forEach((child, index) => {
                    const childX = childWidth * (index + 1);
                    const childY = y + 60;
                    
                    // Draw line connecting parent to child
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x);
                    line.setAttribute('y1', y);
                    line.setAttribute('x2', childX);
                    line.setAttribute('y2', childY);
                    line.setAttribute('stroke', '#dfe6e9');
                    line.setAttribute('stroke-width', '1');
                    line.setAttribute('stroke-dasharray', '4');
                    
                    this.timelineSvg.appendChild(line);
                    
                    // Recursively draw child timeline
                    drawTimeline(child, childX, childY, level + 1);
                });
            }
        };
        
        // Start drawing from the root timeline
        drawTimeline(root, width / 2, 30);
    }
    
    /**
     * Create a new timeline branch
     */
    async createTimelineBranch(name, description, divergenceNodeId) {
        // Create the new timeline in the database
        const newTimeline = await window.dbManager.createTimelineBranch(
            name,
            description,
            divergenceNodeId
        );
        
        // Update current timeline in game state
        await window.dbManager.updateGameState({ timeline_id: newTimeline.id });
        this.currentTimelineId = newTimeline.id;
        
        // Update the visualization
        await this.updateVisualization();
        
        // Update timeline indicator in UI
        document.getElementById('timeline-indicator').textContent = `Timeline: ${name}`;
        
        return newTimeline;
    }
    
    /**
     * Switch to a different timeline
     */
    async switchTimeline(timelineId) {
        // Find the timeline
        const timeline = this.timelines.find(t => t.id === timelineId);
        
        if (!timeline) {
            console.error(`Timeline ${timelineId} not found`);
            return null;
        }
        
        // Update current timeline in game state
        await window.dbManager.updateGameState({ timeline_id: timelineId });
        this.currentTimelineId = timelineId;
        
        // Update the visualization
        await this.updateVisualization();
        
        // Update timeline indicator in UI
        document.getElementById('timeline-indicator').textContent = `Timeline: ${timeline.name}`;
        
        return timeline;
    }
    
    /**
     * Get the current timeline
     */
    async getCurrentTimeline() {
        return this.timelines.find(t => t.id === this.currentTimelineId);
    }
    
    /**
     * Get a timeline by ID
     */
    getTimeline(id) {
        return this.timelines.find(t => t.id === id);
    }
    
    /**
     * Generate a name for a new timeline
     */
    generateTimelineName() {
        // Generate a Greek letter based on number of existing timelines
        const greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
        return greekLetters[this.timelines.length % greekLetters.length];
    }
}

// Timeline manager initialization is now handled in index.html