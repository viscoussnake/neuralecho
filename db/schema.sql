-- Neural Echo: Parallel Minds - Database Schema

-- CORE TABLES

-- Tracks storylines (clinical cases, AI interactions, family scenes)
CREATE TABLE storylines (
    storyline_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Storyline nodes (scenes within each storyline)
CREATE TABLE nodes (
    node_id INTEGER PRIMARY KEY,
    storyline_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_choice_node BOOLEAN DEFAULT FALSE,
    is_ending BOOLEAN DEFAULT FALSE,
    image_path TEXT,
    FOREIGN KEY (storyline_id) REFERENCES storylines(storyline_id)
);

-- Choices available at each choice node
CREATE TABLE choices (
    choice_id INTEGER PRIMARY KEY,
    node_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    next_node_id INTEGER,
    condition TEXT,  -- SQL expression that must evaluate to true for choice to appear
    FOREIGN KEY (node_id) REFERENCES nodes(node_id),
    FOREIGN KEY (next_node_id) REFERENCES nodes(node_id)
);

-- STATE TRACKING

-- Player game state
CREATE TABLE game_state (
    state_id INTEGER PRIMARY KEY,
    player_name TEXT,
    current_node_id INTEGER,
    timeline_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (current_node_id) REFERENCES nodes(node_id)
);

-- Tracks variables that change throughout gameplay
CREATE TABLE state_variables (
    variable_id INTEGER PRIMARY KEY,
    state_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES game_state(state_id)
);

-- TIMELINE MANAGEMENT

-- Tracks different timelines/realities
CREATE TABLE timelines (
    timeline_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    parent_timeline_id INTEGER,
    divergence_point_id INTEGER,  -- node where this timeline diverged from parent
    FOREIGN KEY (parent_timeline_id) REFERENCES timelines(timeline_id),
    FOREIGN KEY (divergence_point_id) REFERENCES nodes(node_id)
);

-- KNOWLEDGE GRAPH

-- Entities (characters, locations, concepts)
CREATE TABLE entities (
    entity_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'character', 'location', 'concept', etc.
    description TEXT NOT NULL
);

-- Relationships between entities
CREATE TABLE relationships (
    relationship_id INTEGER PRIMARY KEY,
    from_entity_id INTEGER NOT NULL,
    to_entity_id INTEGER NOT NULL,
    type TEXT NOT NULL,  -- 'knows', 'created', 'located_at', etc.
    strength REAL DEFAULT 1.0,  -- 0.0 to 1.0
    state_id INTEGER NOT NULL,  -- which game state this relationship exists in
    FOREIGN KEY (from_entity_id) REFERENCES entities(entity_id),
    FOREIGN KEY (to_entity_id) REFERENCES entities(entity_id),
    FOREIGN KEY (state_id) REFERENCES game_state(state_id)
);

-- NARRATIVE TRIGGERS

-- Events that can be triggered based on game state
CREATE TABLE triggers (
    trigger_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    condition TEXT NOT NULL,  -- SQL expression that must evaluate to true
    action TEXT NOT NULL,     -- Action to perform when triggered
    has_fired BOOLEAN DEFAULT FALSE
);

-- PLAYER HISTORY

-- Tracks player's path through the narrative
CREATE TABLE history (
    history_id INTEGER PRIMARY KEY,
    state_id INTEGER NOT NULL,
    node_id INTEGER NOT NULL,
    choice_id INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES game_state(state_id),
    FOREIGN KEY (node_id) REFERENCES nodes(node_id),
    FOREIGN KEY (choice_id) REFERENCES choices(choice_id)
);

-- Initial seed data
INSERT INTO storylines (name, description) VALUES 
('Clinical', 'Patient cases and medical decisions'),
('AI', 'Interactions with artificial intelligence systems'),
('Family', 'Scenes with your daughter and home life');