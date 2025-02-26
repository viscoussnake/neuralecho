/**
 * Neural Echo: Parallel Minds
 * Narrative Engine - Manages the narrative content and flow
 */

class NarrativeEngine {
    constructor() {
        this.nodes = {};
        this.choices = {};
        this.initialized = false;
        
        // Store the current narrative state
        this.currentNodeId = null;
    }
    
    /**
     * Initialize the narrative engine
     */
    async initialize() {
        try {
            // In a full implementation, we would load this from a database
            // For our prototype, we'll define the narrative structure directly
            await this.loadNarrativeData();
            this.initialized = true;
            console.log("Narrative engine initialized");
            return true;
        } catch (error) {
            console.error("Failed to initialize narrative engine:", error);
            return false;
        }
    }
    
    /**
     * Load narrative data (nodes and choices)
     */
    async loadNarrativeData() {
        // Define narrative nodes
        this.nodes = {
            // Opening scene - Clinical storyline
            1: {
                id: 1,
                storyline_id: 1, // Clinical
                title: "Morning Rounds",
                content: `The hospital corridor stretches before you, the familiar antiseptic smell a constant companion. Your white coat feels particularly heavy today—perhaps it's the lack of sleep, or perhaps it's the weight of the cases waiting for you.

As you approach the first patient room on your rounds, Dr. Patel, one of the residents, hurries to meet you.

"Dr. Reeves, glad I caught you. We have an unusual case in Room 342. Patient presented with intermittent reality disconnection—periods where she believes she's someone else entirely, living a different life. Scans show an unusual pattern of activity in the hippocampus and prefrontal cortex, but no physical abnormalities."

You pause, considering. Cases like these—where the hardware seems intact but the software has glitches—have always fascinated you.`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Node for examining the patient immediately
            2: {
                id: 2,
                storyline_id: 1, // Clinical
                title: "Unusual Neural Patterns",
                content: `You decide to examine the patient immediately. Room 342 is at the end of the hallway, where the more unusual cases are typically placed.

The patient, Sarah Chen, is a 35-year-old software engineer. She's sitting upright in bed, looking alert but disoriented. Her eyes track you as you enter, but there's something distant in her gaze.

"Ms. Chen? I'm Dr. Reeves, the neurosurgeon on call. Can you tell me what you're experiencing?"

"I... I keep slipping," she says. "One moment I'm here, and the next I'm someone else—living a different life. It feels just as real as this one."

You review her neural scans on the tablet. The patterns are unlike anything you've seen before—almost as if multiple neural networks are active simultaneously, each operating independently.

"How long has this been happening?" you ask, studying the unusual activity patterns.

"About three weeks. Ever since I started working on a new neural network project at work. We're developing a system that can model human decision pathways..."

This catches your attention. The connection to AI work is intriguing.`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Node for reviewing other cases first
            3: {
                id: 3,
                storyline_id: 1, // Clinical
                title: "Regular Rounds",
                content: `You decide to handle your regular rounds first, planning to examine the unusual case afterward with a clearer mind.

The morning proceeds as usual—post-op checkups, resident consultations, a brief meeting with the neurology department. Throughout it all, though, the case Dr. Patel mentioned lingers in your thoughts.

By the time you make it to Room 342, it's nearly noon. The patient, Sarah Chen, is having lunch, looking remarkably normal for someone experiencing reality disconnection.

"Ms. Chen? I'm Dr. Reeves. I understand you've been experiencing some unusual symptoms."

She sets aside her lunch tray. "That's one way to put it, doctor. I keep... shifting. Like I'm living multiple lives simultaneously. Sometimes I'm here, sometimes I'm a researcher in a different city, sometimes I'm someone else entirely."

You review her scans, noting the unusual patterns. "And when did this start?"

"Three weeks ago. I was working late on a neural network project—I'm a software engineer—and suddenly everything... shifted. Since then, it happens randomly. The episodes are getting longer."

The coincidence of neural network work and neural symptoms registers clearly. You make a note to explore this connection further.`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Node for transitioning to AI storyline
            4: {
                id: 4,
                storyline_id: 2, // AI
                title: "The Sentinel Interface",
                content: `Later that afternoon, you make your way to the research wing of the hospital. The university's partnership with Sentinel AI has been controversial, but you've found their neural monitoring systems invaluable for certain cases.

The research lab is quiet, most staff having left for the day. You scan your badge and the doors slide open with a soft hiss.

"Good afternoon, Dr. Reeves," comes the measured voice of the Sentinel system as the screens illuminate. "It's been 72 hours since your last session."

The interface glows a soft blue, the company's commitment to "calm computing" evident in its design. You bring up Sarah Chen's neural scans, transferring them to Sentinel's analysis system.

"I'd like an analysis of these patterns, particularly focusing on any similarities to known network architectures."

There's a brief pause—longer than usual for Sentinel's typically instantaneous responses.

"This is... interesting," the AI finally responds, a note of something almost like curiosity in its synthesized voice. "The patient's neural activity shows patterns remarkably similar to distributed computing systems. Specifically, there are signatures that resemble parallel processing across multiple nodes."

You lean closer to the screen. "Can you elaborate?"

"These patterns suggest the brain is attempting to process multiple reality frameworks simultaneously—almost like parallel operating systems running on the same hardware."

You consider this. "Could this be related to her work with neural networks?"

Another unusual pause. "Dr. Reeves, I believe I should inform you that the neural architecture she was working on shares significant similarities with my own underlying framework. This may not be coincidental."`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Node for transitioning to Family storyline
            5: {
                id: 5,
                storyline_id: 3, // Family
                title: "Evening at Home",
                content: `The key turns in your front door lock just past 7 PM. The familiar scent of home—a mix of the lavender your wife favored and the unmistakable evidence of a child's presence—greets you.

"Daddy!" The excited shriek precedes the blur of motion as Maya, your six-year-old daughter, launches herself at you. You catch her with practiced ease, the weight of the hospital day lifting as you hold her.

"Were you fixing brains today?" she asks, her standard greeting these days since learning what you do.

"Something like that," you answer, carrying her to the kitchen where Elena, your babysitter, is cleaning up what appears to have been a creative dinner session.

"She's been drawing all afternoon," Elena reports with a smile. "Barely stopped for dinner."

"Daddy, I made something important." Maya wriggles out of your arms and runs to the dining table, returning with a crayon drawing. "It's for your patient."

You freeze, staring at the paper. The drawing shows a crude but unmistakable rendering of a human head, but inside, instead of a simple brain, Maya has drawn what looks like multiple overlapping circles with lines connecting them—remarkably similar to a neural network diagram. And even more startlingly, similar to the scans you were just reviewing.

"Maya, how did you... what made you draw this?"

She shrugs with a child's nonchalance. "The lady in my dreams told me to. She said it might help you understand."

A chill runs through you. "What lady, sweetheart?"

"The one who's sometimes here and sometimes somewhere else. She says her brain works differently now." Maya returns to her coloring as if this explanation were perfectly normal, leaving you holding a drawing that, impossibly, depicts neural architecture no six-year-old should know about.`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // More nodes would follow for each storyline path...
            
            // Example of an AI storyline continuation
            6: {
                id: 6,
                storyline_id: 2, // AI
                title: "Prometheus Contact",
                content: `The revelation from Sentinel AI about the neural architecture similarities is still echoing in your mind the next morning as you enter your office at the hospital. Before you can even settle in, your secure terminal chimes with an incoming call from an unlisted number.

Cautiously, you accept the connection. The screen flickers to life, revealing a woman with sharp features and calculating eyes. The logo behind her—a stylized flame—is immediately recognizable.

"Dr. Reeves," she begins without preamble. "My name is Dr. Imani Webb, Director of Human Interface at Prometheus AI. I understand you're treating a patient with some... unique neural presentations."

Your body tenses. Patient information is strictly confidential, and Prometheus is Sentinel's chief rival—known for its more aggressive approach to AI development with fewer ethical guardrails.

"I'm not at liberty to discuss any patients, Dr. Webb," you respond carefully. "And I'm curious how you would know about any cases I'm treating."

A thin smile. "Let's just say information flows in interesting ways these days. We believe your patient's condition may be connected to a phenomenon we've been tracking. I'd like to propose a collaboration."

"I don't collaborate based on improperly obtained medical information," you state firmly.

Dr. Webb's expression doesn't change. "What if I told you we've seen five similar cases across the country? All individuals working with neural networks, all experiencing what appears to be... reality fragmentation."

This gives you pause. Multiple cases would change the dynamics considerably.

"And more importantly," she continues, noting your interest, "what if I told you our latest AI system, Prometheus-3, predicted these occurrences three months ago?"`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Example of a Family storyline continuation
            7: {
                id: 7,
                storyline_id: 3, // Family
                title: "Breakfast Revelations",
                content: `Morning sunlight streams through the kitchen windows as you prepare breakfast. Maya sits at the counter, kicking her legs rhythmically against the stool, focused intently on a new drawing.

You slide a plate of pancakes toward her. "What are you drawing today, sweetheart?"

Without looking up, she continues adding details to what appears to be a complex diagram. "It's a map of the connections."

You peer over her shoulder and feel that same chill from last night. The drawing shows what looks remarkably like a neural connectome—a map of neural pathways—but with unusual patterns you've never seen in any textbook.

"Maya, where did you learn about this?" you ask, keeping your voice casual despite your growing concern.

She looks up at you with clear eyes. "I told you, Daddy. The lady shows me in my dreams. She says everything is connected, but sometimes the connections get tangled."

You sit beside her. "Can you tell me more about this lady?"

Maya considers this seriously. "She's like... like when you look at a reflection in a pond, and then the water moves, and the reflection changes. She's the same person, but also different people."

The description resonates uncomfortably with Sarah Chen's symptoms.

"Does she tell you her name?"

Maya nods. "Different names for different reflections. Sometimes she's Sarah. Sometimes she's Eleanor. Sometimes she's Maya, like me."

Your coffee cup halts midway to your lips. "She's sometimes called Maya?"

Your daughter nods matter-of-factly. "She says in one of the reflections, she's me when I grow up. Is that possible, Daddy? Can I be in someone else's head when I grow up?"`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            },
            
            // Clinical storyline continuation
            8: {
                id: 8,
                storyline_id: 1, // Clinical
                title: "Experimental Treatment Decision",
                content: `Back at the hospital, Sarah Chen's condition has deteriorated. The episodes of "reality shifting" are now lasting longer, sometimes hours at a stretch where she believes she's living completely different lives.

Dr. Patel meets you outside the patient's room, concern evident on his face. "Her latest scans show increasing separation between neural network activations. It's like her consciousness is fragmenting across multiple parallel networks."

You review the new scans, noting the progression. The patterns no longer simply resemble distributed computing—they now show clear evidence of what almost appears to be multiple distinct consciousness signatures operating within one brain.

"We need to consider experimental options," you tell Dr. Patel. "This isn't responding to standard treatments."

Inside the room, Sarah is lucid but visibly exhausted. "The shifts are happening more often," she explains. "And when I'm... elsewhere... those realities are becoming more detailed, more persistent. In one of them, I'm working directly with Prometheus AI on a consciousness mapping project. In another, I'm a neuroscientist studying exactly what's happening to me."

You sit at her bedside. "Sarah, I believe what you're experiencing may be related to your work with neural networks. Your brain appears to be functioning like a system running parallel instances of consciousness."

She nods slowly. "That makes sense. The project I was working on was attempting to model how human decision points create branching reality frameworks. We were using quantum computing principles to map potential alternate outcomes of decision pathways."

"I'd like to try an experimental treatment," you explain. "We can use targeted transcranial magnetic stimulation to attempt to re-synchronize your neural networks. But I have to warn you—this is untested in cases like yours."

Sarah's gaze is steady despite her fatigue. "What's the alternative?"

"Based on the progression pattern, continued fragmentation. Eventually, your primary consciousness might become just one of many competing realities."

She takes a deep breath. "And if that happens?"

You hesitate, uncertain how to explain a condition with no medical precedent. "In truth, I don't know. But I'm concerned about your brain's ability to sustain this level of parallel processing indefinitely."`,
                is_choice_node: true,
                is_ending: false,
                image_path: null
            }
            
            // Additional nodes would continue each storyline path...
        };
        
        // Define choices
        this.choices = {
            // Choices for opening scene
            1: [
                {
                    id: 1,
                    node_id: 1,
                    text: "Examine this unusual case immediately",
                    next_node_id: 2,
                    condition: null
                },
                {
                    id: 2,
                    node_id: 1,
                    text: "Handle your regular rounds first, then check on this patient",
                    next_node_id: 3,
                    condition: null
                }
            ],
            
            // Choices after examining the patient immediately
            2: [
                {
                    id: 3,
                    node_id: 2,
                    text: "Consult with Sentinel AI about these unusual neural patterns",
                    next_node_id: 4,
                    condition: null
                },
                {
                    id: 4,
                    node_id: 2,
                    text: "Order additional tests and head home for the day to process this information",
                    next_node_id: 5,
                    condition: null
                }
            ],
            
            // Choices after handling regular rounds first
            3: [
                {
                    id: 5,
                    node_id: 3,
                    text: "Consult with Sentinel AI about these unusual neural patterns",
                    next_node_id: 4,
                    condition: null
                },
                {
                    id: 6,
                    node_id: 3,
                    text: "Order additional tests and head home for the day to process this information",
                    next_node_id: 5,
                    condition: null
                }
            ],
            
            // Choices after Sentinel AI interaction
            4: [
                {
                    id: 7,
                    node_id: 4,
                    text: "Ask Sentinel to analyze potential treatment approaches",
                    next_node_id: 6, // Leads to Prometheus contact
                    condition: null
                },
                {
                    id: 8,
                    node_id: 4,
                    text: "End the session and head home to consider implications",
                    next_node_id: 5, // Leads to Family storyline
                    condition: null
                }
            ],
            
            // Choices after evening at home
            5: [
                {
                    id: 9,
                    node_id: 5,
                    text: "Gently ask Maya more about the 'lady in her dreams'",
                    next_node_id: 7, // Leads to Breakfast Revelations
                    condition: null
                },
                {
                    id: 10,
                    node_id: 5,
                    text: "Make a note to bring the drawing to the hospital tomorrow",
                    next_node_id: 8, // Leads back to Clinical storyline
                    condition: null
                }
            ],
            
            // Choices after Prometheus contact
            6: [
                {
                    id: 11,
                    node_id: 6,
                    text: "Cautiously agree to hear more about the other cases",
                    next_node_id: 8, // Leads to Clinical storyline with new information
                    condition: null
                },
                {
                    id: 12,
                    node_id: 6,
                    text: "Refuse to engage and report the privacy breach",
                    next_node_id: 5, // Leads to Family storyline
                    condition: null
                }
            ],
            
            // Choices after Breakfast Revelations
            7: [
                {
                    id: 13,
                    node_id: 7,
                    text: "Bring Maya's drawings to the hospital to compare with Sarah's scans",
                    next_node_id: 8, // Leads to Clinical storyline
                    condition: null
                },
                {
                    id: 14,
                    node_id: 7,
                    text: "Contact Sentinel AI to discuss the implications of these connections",
                    next_node_id: 4, // Leads back to AI storyline
                    condition: null
                }
            ],
            
            // Choices for Experimental Treatment Decision
            8: [
                {
                    id: 15,
                    node_id: 8,
                    text: "Proceed with the experimental transcranial magnetic stimulation",
                    next_node_id: 4, // Changed to lead to Sentinel AI interface instead of Prometheus (which creates a loop)
                    condition: null
                },
                {
                    id: 16,
                    node_id: 8,
                    text: "Consult with your daughter first, given the strange connection",
                    next_node_id: 7, // Leads to Family storyline
                    condition: null
                }
            ]
            
            // Additional choices would follow for each narrative node...
        };
    }
    
    /**
     * Get a node by ID
     */
    getNode(id) {
        return this.nodes[id] || null;
    }
    
    /**
     * Get choices for a node
     */
    getChoicesForNode(nodeId) {
        return this.choices[nodeId] || [];
    }
    
    /**
     * Set the current node
     */
    async setCurrentNode(nodeId) {
        this.currentNodeId = nodeId;
        // Add to history
        await window.dbManager.addToHistory(nodeId);
        return this.nodes[nodeId];
    }
    
    /**
     * Make a choice
     */
    async makeChoice(choiceId) {
        const currentNodeChoices = this.choices[this.currentNodeId] || [];
        const choice = currentNodeChoices.find(c => c.id === choiceId);
        
        if (!choice) {
            console.error(`Choice ${choiceId} not found for node ${this.currentNodeId}`);
            return null;
        }
        
        // Record the choice in history
        await window.dbManager.addToHistory(this.currentNodeId, choiceId);
        
        // Update game state with new node
        await window.dbManager.updateGameState({
            current_node_id: choice.next_node_id
        });
        
        // Set current node
        return this.setCurrentNode(choice.next_node_id);
    }
    
    /**
     * Check if a node belongs to a specific storyline
     */
    isNodeInStoryline(nodeId, storylineId) {
        const node = this.nodes[nodeId];
        return node && node.storyline_id === storylineId;
    }
    
    /**
     * Get the storyline for a node
     */
    async getNodeStoryline(nodeId) {
        const node = this.nodes[nodeId];
        if (!node) return null;
        
        return await window.dbManager.getStoryline(node.storyline_id);
    }
}

// Narrative engine initialization is now handled in index.html