/**
 * Neural Echo: Parallel Minds
 * Audio Manager - Handles background music using Web Audio API for direct synthesis
 */

class AudioManager {
    constructor() {
        this.initialized = false;
        this.audioContext = null;
        this.currentTrack = null;
        this.isMuted = false;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNodes = [];
        
        // Define musical patterns for different storylines
        this.tracks = {
            clinical: {
                notes: [
                    { pitch: 60, duration: 2.0, delay: 0 },    // C4
                    { pitch: 64, duration: 2.0, delay: 2.0 },  // E4
                    { pitch: 67, duration: 2.0, delay: 4.0 },  // G4
                    { pitch: 72, duration: 2.0, delay: 6.0 }   // C5
                ],
                tempo: 60,
                name: 'Clinical Theme - Ambient Hospital'
            },
            ai: {
                notes: [
                    { pitch: 60, duration: 0.5, delay: 0 },    // C4
                    { pitch: 67, duration: 0.5, delay: 0.5 },  // G4
                    { pitch: 72, duration: 0.5, delay: 1.0 },  // C5
                    { pitch: 76, duration: 0.5, delay: 1.5 },  // E5
                    { pitch: 79, duration: 0.5, delay: 2.0 },  // G5
                    { pitch: 84, duration: 0.5, delay: 2.5 }   // C6
                ],
                tempo: 120,
                name: 'AI Theme - Digital Consciousness'
            },
            family: {
                notes: [
                    { pitch: 72, duration: 1.0, delay: 0 },    // C5
                    { pitch: 74, duration: 1.0, delay: 1.0 },  // D5
                    { pitch: 76, duration: 1.0, delay: 2.0 },  // E5
                    { pitch: 79, duration: 1.0, delay: 3.0 },  // G5
                    { pitch: 81, duration: 1.0, delay: 4.0 }   // A5
                ],
                tempo: 90,
                name: 'Family Theme - Childhood Wonder'
            }
        };
        
        // Keep track of volume levels
        this.volume = 0.7;
        
        // Track active notes
        this.activeNotes = [];
    }
    
    /**
     * Initialize the audio system
     */
    async initialize() {
        try {
            console.log("Initializing audio manager...");
            
            // Create audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Create master volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volume;
            this.masterGain.connect(this.audioContext.destination);
            
            console.log(`AudioContext state: ${this.audioContext.state}`);
            
            this.initialized = true;
            console.log("Audio manager initialized successfully");
            
            // Setup click handler for audio permission
            document.addEventListener('click', () => {
                // Resume AudioContext if suspended
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log("AudioContext resumed on user interaction");
                        
                        // If we have a current track, play it
                        if (this.currentTrack && !this.isPlaying && !this.isMuted) {
                            this.playPattern(this.currentTrack);
                        }
                    });
                }
            }, { once: true });
            
            return true;
        } catch (error) {
            console.error("Failed to initialize audio manager:", error);
            return false;
        }
    }
    
    /**
     * Convert MIDI note number to frequency
     */
    midiToFrequency(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }
    
    /**
     * Play a single note
     */
    playNote(pitch, duration, startTime = 0, volume = 0.2) {
        // Convert MIDI note to frequency
        const frequency = this.midiToFrequency(pitch);
        
        // Create oscillator
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Create gain node for volume/envelope
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0;
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Calculate timing
        const now = this.audioContext.currentTime;
        const startAt = now + startTime;
        const stopAt = startAt + duration;
        
        // Create envelope
        gainNode.gain.setValueAtTime(0, startAt);
        gainNode.gain.linearRampToValueAtTime(volume, startAt + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, stopAt - 0.1);
        
        // Schedule oscillator
        oscillator.start(startAt);
        oscillator.stop(stopAt);
        
        // Store active notes for cleanup
        this.oscillators.push(oscillator);
        this.gainNodes.push(gainNode);
        
        // Clean up after note finishes
        setTimeout(() => {
            const index = this.oscillators.indexOf(oscillator);
            if (index > -1) {
                this.oscillators.splice(index, 1);
                this.gainNodes.splice(index, 1);
            }
        }, (stopAt - now) * 1000);
        
        return { oscillator, gainNode };
    }
    
    /**
     * Play a musical pattern
     */
    playPattern(trackInfo) {
        // Don't start a new pattern if already playing this one
        if (this.isPlaying && this.currentTrack === trackInfo) {
            return;
        }
        
        // Stop any current playback
        this.stopAllNotes();
        
        // Set as current track
        this.currentTrack = trackInfo;
        this.isPlaying = true;
        
        // Show notification
        this.showMusicNotification(trackInfo.name);
        
        // Function to play pattern with looping
        const playLoop = () => {
            // Calculate total pattern duration
            const patternDuration = trackInfo.notes.reduce((max, note) => 
                Math.max(max, note.delay + note.duration), 0);
            
            // Play each note in the pattern
            trackInfo.notes.forEach(note => {
                this.playNote(note.pitch, note.duration, note.delay, 0.1);
            });
            
            // Schedule next loop if still playing this track
            if (this.isPlaying && this.currentTrack === trackInfo && !this.isMuted) {
                this.loopTimeout = setTimeout(playLoop, patternDuration * 1000);
            }
        };
        
        // Start the pattern
        playLoop();
    }
    
    /**
     * Stop all currently playing notes
     */
    stopAllNotes() {
        // Clear any pending loop
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }
        
        // Stop all oscillators
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        
        // Disconnect all gain nodes
        this.gainNodes.forEach(gain => {
            try {
                gain.disconnect();
            } catch (e) {
                // Gain might already be disconnected
            }
        });
        
        // Clear arrays
        this.oscillators = [];
        this.gainNodes = [];
        this.isPlaying = false;
    }
    
    /**
     * Play music for a specific storyline
     */
    playStorylineMusic(storyline) {
        // Default to clinical if storyline not found
        const trackInfo = this.tracks[storyline.toLowerCase()] || this.tracks.clinical;
        
        // Don't reload the same track
        if (this.currentTrack === trackInfo) {
            return;
        }
        
        console.log(`Now playing: ${trackInfo.name}`);
        
        // Don't play if audio is muted
        if (this.isMuted) {
            this.currentTrack = trackInfo;
            return;
        }
        
        // Play the pattern if AudioContext is running
        if (this.audioContext.state === 'running') {
            this.playPattern(trackInfo);
        } else {
            // Just store the track for now, it will play when context resumes
            this.currentTrack = trackInfo;
        }
    }
    
    /**
     * Show a notification about the current music
     */
    showMusicNotification(trackName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('music-notification');
        
        // Add music icon
        notification.innerHTML = `
            <div class="music-icon">♪</div>
            <div class="track-info">
                <div class="track-name">${trackName}</div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    }
    
    /**
     * Toggle mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Stop all playing notes immediately
            this.stopAllNotes();
        } else {
            // Resume playback if we have a current track
            if (this.currentTrack && this.audioContext.state === 'running') {
                this.playPattern(this.currentTrack);
            }
        }
        
        return this.isMuted;
    }
    
    /**
     * Set volume level (0.0 to 1.0)
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        
        // Update master gain if available
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }
}

// Add CSS for music notifications
(function() {
    const musicStyle = document.createElement('style');
    musicStyle.textContent = `
    .music-notification {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: rgba(30, 55, 153, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        z-index: 1000;
        animation: music-in 0.3s ease-out forwards;
    }
    
    .music-notification.fade-out {
        animation: music-out 0.5s ease-in forwards;
    }
    
    .music-icon {
        font-size: 24px;
        margin-right: 10px;
        animation: pulse 1s infinite alternate;
    }
    
    .track-info {
        display: flex;
        flex-direction: column;
    }
    
    .track-name {
        font-weight: bold;
        font-size: 14px;
    }
    
    @keyframes music-in {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes music-out {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(20px); opacity: 0; }
    }
    
    @keyframes pulse {
        from { transform: scale(1); }
        to { transform: scale(1.1); }
    }
    `;
    document.head.appendChild(musicStyle);
})();