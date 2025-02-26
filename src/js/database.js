/**
 * Neural Echo: Parallel Minds
 * Database Manager - Handles all interactions with SQLite database
 */

class DatabaseManager {
    constructor() {
        this.db = null;
        this.initialized = false;
        
        // Define default data structures
        this.storylines = [];
        this.timelines = [];
        this.gameState = {};
        this.entities = [];
        this.relationships = [];
        this.history = [];
    }

    /**
     * Initialize the database connection
     */
    async initialize() {
        try {
            // In a real implementation, we'd use SQLite.js or a similar library
            // For this prototype, we'll simulate database operations
            console.log("Database initialized");
            this.initialized = true;
            
            // Let's simulate loading the initial data
            await this.loadInitialData();
            
            return true;
        } catch (error) {
            console.error("Failed to initialize database:", error);
            return false;
        }
    }

    /**
     * Load initial data into the database
     */
    async loadInitialData() {
        console.log("Loading initial data...");
        
        // In a real implementation, we'd execute the SQL from schema.sql
        // For now, we'll simulate this with in-memory objects
        
        // Store data in memory for our prototype
        this.storylines = [
            { id: 1, name: 'Clinical', description: 'Patient cases and medical decisions' },
            { id: 2, name: 'AI', description: 'Interactions with artificial intelligence systems' },
            { id: 3, name: 'Family', description: 'Scenes with your daughter and home life' }
        ];
        
        // Initial timeline
        this.timelines = [
            { id: 1, name: 'Alpha', description: 'Primary timeline', parent_id: null, divergence_point_id: null }
        ];
        
        // Initial game state
        this.gameState = {
            id: 1,
            current_node_id: 1,
            timeline_id: 1,
            variables: {}
        };
        
        // Initialize entities for knowledge graph
        this.entities = [
            { id: 1, name: 'Dr. Elias Reeves', type: 'character', description: 'Neurosurgeon protagonist' },
            { id: 2, name: 'Maya', type: 'character', description: 'Six-year-old daughter' },
            { id: 3, name: 'Nexus Hospital', type: 'location', description: 'Where Dr. Reeves works' },
            { id: 4, name: 'Sentinel AI', type: 'ai', description: 'Corporate AI focused on safety' },
            { id: 5, name: 'Prometheus AI', type: 'ai', description: 'Cutting-edge AI with fewer restrictions' }
        ];
        
        // Initialize relationships
        this.relationships = [
            { id: 1, from_entity_id: 1, to_entity_id: 2, type: 'parent_of', strength: 1.0, state_id: 1 },
            { id: 2, from_entity_id: 1, to_entity_id: 3, type: 'works_at', strength: 0.9, state_id: 1 },
            { id: 3, from_entity_id: 1, to_entity_id: 4, type: 'interacts_with', strength: 0.5, state_id: 1 },
            { id: 4, from_entity_id: 1, to_entity_id: 5, type: 'interacts_with', strength: 0.3, state_id: 1 }
        ];
        
        // Set up history tracking
        this.history = [];
    }

    /**
     * Get a storyline by ID
     */
    async getStoryline(id) {
        return this.storylines.find(storyline => storyline.id === id);
    }

    /**
     * Get all storylines
     */
    async getAllStorylines() {
        return this.storylines;
    }

    /**
     * Get a node by ID
     */
    async getNode(id) {
        // In a real implementation, this would be a database query
        // For now, we'll use our sample narrative data
        return window.narrativeEngine.getNode(id);
    }

    /**
     * Get choices for a node
     */
    async getChoicesForNode(nodeId) {
        // In a real implementation, this would be a database query
        return window.narrativeEngine.getChoicesForNode(nodeId);
    }

    /**
     * Update game state
     */
    async updateGameState(newState) {
        this.gameState = { 
            ...this.gameState, 
            ...newState,
            variables: { ...this.gameState.variables, ...newState.variables }
        };
        console.log("Game state updated:", this.gameState);
        return this.gameState;
    }

    /**
     * Get current game state
     */
    async getGameState() {
        return this.gameState;
    }

    /**
     * Add to player history
     */
    async addToHistory(nodeId, choiceId = null) {
        const historyEntry = {
            id: this.history.length + 1,
            state_id: this.gameState.id,
            node_id: nodeId,
            choice_id: choiceId,
            timestamp: new Date().toISOString()
        };
        
        this.history.push(historyEntry);
        return historyEntry;
    }

    /**
     * Get player history
     */
    async getHistory() {
        return this.history;
    }

    /**
     * Get entities
     */
    async getEntities() {
        return this.entities;
    }

    /**
     * Get relationships
     */
    async getRelationships() {
        return this.relationships;
    }

    /**
     * Update or create a relationship
     */
    async updateRelationship(fromId, toId, type, strength) {
        let relationship = this.relationships.find(r => 
            r.from_entity_id === fromId && 
            r.to_entity_id === toId && 
            r.type === type
        );
        
        if (relationship) {
            relationship.strength = strength;
        } else {
            relationship = {
                id: this.relationships.length + 1,
                from_entity_id: fromId,
                to_entity_id: toId,
                type: type,
                strength: strength,
                state_id: this.gameState.id
            };
            this.relationships.push(relationship);
        }
        
        return relationship;
    }

    /**
     * Get current timeline
     */
    async getCurrentTimeline() {
        return this.timelines.find(t => t.id === this.gameState.timeline_id);
    }

    /**
     * Create a new timeline branch
     */
    async createTimelineBranch(name, description, divergenceNodeId) {
        const newTimeline = {
            id: this.timelines.length + 1,
            name,
            description,
            parent_id: this.gameState.timeline_id,
            divergence_point_id: divergenceNodeId
        };
        
        this.timelines.push(newTimeline);
        return newTimeline;
    }
}

// Database initialization is now handled in index.html