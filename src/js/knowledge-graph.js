/**
 * Neural Echo: Parallel Minds
 * Knowledge Graph Manager - Handles entity relationships and visualization
 */

class KnowledgeGraphManager {
    constructor() {
        this.entities = [];
        this.relationships = [];
        this.initialized = false;
        this.graphSvg = null;
    }
    
    /**
     * Initialize the knowledge graph
     */
    async initialize() {
        try {
            // Load entities and relationships from the database
            this.entities = await window.dbManager.getEntities();
            this.relationships = await window.dbManager.getRelationships();
            
            this.initialized = true;
            console.log("Knowledge graph initialized");
            
            // Initialize visualization
            this.initVisualization();
            
            return true;
        } catch (error) {
            console.error("Failed to initialize knowledge graph:", error);
            return false;
        }
    }
    
    /**
     * Initialize the graph visualization
     */
    initVisualization() {
        const graphContainer = document.getElementById('relationship-graph');
        
        // Clear any existing content
        graphContainer.innerHTML = '';
        
        // Create SVG element for the graph
        this.graphSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.graphSvg.setAttribute('width', '100%');
        this.graphSvg.setAttribute('height', '100%');
        this.graphSvg.style.overflow = 'visible';
        
        graphContainer.appendChild(this.graphSvg);
        
        // Draw the initial graph
        this.updateVisualization();
    }
    
    /**
     * Update the graph visualization based on current state
     */
    async updateVisualization() {
        if (!this.graphSvg) return;
        
        // Clear existing visualization
        this.graphSvg.innerHTML = '';
        
        // Reload entities and relationships from database
        this.entities = await window.dbManager.getEntities();
        this.relationships = await window.dbManager.getRelationships();
        
        // Simple force-directed graph layout
        // In a real implementation, we'd use a library like D3.js
        // For this prototype, we'll do a simple circular layout
        
        const centerX = this.graphSvg.clientWidth / 2;
        const centerY = this.graphSvg.clientHeight / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        // Position entities in a circle
        const entityPositions = {};
        
        this.entities.forEach((entity, index) => {
            const angle = (index / this.entities.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            entityPositions[entity.id] = { x, y };
            
            // Create entity node
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 10);
            
            // Coloring based on entity type
            let color;
            switch(entity.type) {
                case 'character':
                    color = '#6c5ce7';
                    break;
                case 'location':
                    color = '#00b894';
                    break;
                case 'ai':
                    color = '#0984e3';
                    break;
                default:
                    color = '#636e72';
            }
            
            circle.setAttribute('fill', color);
            circle.setAttribute('stroke', '#dfe6e9');
            circle.setAttribute('stroke-width', '2');
            
            // Add tooltip functionality
            circle.setAttribute('data-tooltip', entity.name);
            circle.classList.add('entity-node');
            
            // Add text label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x);
            text.setAttribute('y', y + 25);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#dfe6e9');
            text.setAttribute('font-size', '8px');
            text.textContent = entity.name;
            
            this.graphSvg.appendChild(circle);
            this.graphSvg.appendChild(text);
        });
        
        // Draw relationships as lines
        this.relationships.forEach(relationship => {
            const sourcePos = entityPositions[relationship.from_entity_id];
            const targetPos = entityPositions[relationship.to_entity_id];
            
            if (!sourcePos || !targetPos) return;
            
            // Create relationship line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourcePos.x);
            line.setAttribute('y1', sourcePos.y);
            line.setAttribute('x2', targetPos.x);
            line.setAttribute('y2', targetPos.y);
            line.setAttribute('stroke', 'rgba(255, 255, 255, ' + relationship.strength + ')');
            line.setAttribute('stroke-width', 2 * relationship.strength);
            
            // Add the line to the SVG before the nodes to ensure it's drawn underneath
            this.graphSvg.insertBefore(line, this.graphSvg.firstChild);
            
            // Add small label for relationship type
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;
            
            const relationshipLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            relationshipLabel.setAttribute('x', midX);
            relationshipLabel.setAttribute('y', midY);
            relationshipLabel.setAttribute('text-anchor', 'middle');
            relationshipLabel.setAttribute('fill', '#dfe6e9');
            relationshipLabel.setAttribute('font-size', '6px');
            relationshipLabel.textContent = relationship.type;
            
            this.graphSvg.appendChild(relationshipLabel);
        });
    }
    
    /**
     * Update a relationship between entities
     */
    async updateRelationship(fromId, toId, type, strength) {
        const relationship = await window.dbManager.updateRelationship(fromId, toId, type, strength);
        await this.updateVisualization();
        return relationship;
    }
    
    /**
     * Get entity by ID
     */
    getEntity(id) {
        return this.entities.find(entity => entity.id === id);
    }
    
    /**
     * Get relationships for an entity
     */
    getRelationshipsForEntity(entityId) {
        return this.relationships.filter(
            rel => rel.from_entity_id === entityId || rel.to_entity_id === entityId
        );
    }
    
    /**
     * Create a narrative summary of the current knowledge graph
     */
    generateNarrativeSummary() {
        // This would generate a textual summary of the key relationships
        // In a full implementation, this might be used to provide the player with insights
        
        const player = this.getEntity(1); // Assuming player character is always ID 1
        
        if (!player) return "Knowledge graph not fully initialized.";
        
        const playerRelationships = this.getRelationshipsForEntity(player.id);
        
        let summary = `Dr. ${player.name} is at the center of an increasingly complex web of connections.`;
        
        // Describe key relationships
        playerRelationships.forEach(rel => {
            const otherEntity = rel.from_entity_id === player.id 
                ? this.getEntity(rel.to_entity_id)
                : this.getEntity(rel.from_entity_id);
            
            if (!otherEntity) return;
            
            let relationshipDescription;
            
            if (rel.from_entity_id === player.id) {
                // Player -> Other relationship
                switch(rel.type) {
                    case 'parent_of':
                        relationshipDescription = `is the parent of ${otherEntity.name}`;
                        break;
                    case 'works_at':
                        relationshipDescription = `works at ${otherEntity.name}`;
                        break;
                    case 'interacts_with':
                        relationshipDescription = `interacts with ${otherEntity.name}`;
                        break;
                    default:
                        relationshipDescription = `${rel.type} ${otherEntity.name}`;
                }
            } else {
                // Other -> Player relationship
                switch(rel.type) {
                    case 'trusts':
                        relationshipDescription = `is trusted by ${otherEntity.name}`;
                        break;
                    case 'suspicious_of':
                        relationshipDescription = `is viewed with suspicion by ${otherEntity.name}`;
                        break;
                    default:
                        relationshipDescription = `is ${rel.type} by ${otherEntity.name}`;
                }
            }
            
            // Add strength qualifier
            let strengthQualifier = "";
            if (rel.strength > 0.8) {
                strengthQualifier = "strongly";
            } else if (rel.strength < 0.3) {
                strengthQualifier = "weakly";
            }
            
            summary += ` ${player.name} ${strengthQualifier} ${relationshipDescription}.`;
        });
        
        return summary;
    }
}

// Knowledge graph initialization is now handled in index.html