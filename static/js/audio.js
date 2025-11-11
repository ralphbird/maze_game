const AudioManager = {
    audioContext: null,

    init() {
        if (typeof AudioContext !== 'undefined') {
            this.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new webkitAudioContext();
        }
    },

    playSuccessSound() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1568.0, 2093.0];
        const noteDuration = 0.15;

        notes.forEach((frequency, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(frequency, now);

            const startTime = now + (index * noteDuration);
            const duration = index === notes.length - 1 ? noteDuration * 3 : noteDuration;

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    },

    playErrorSound() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const duration = 0.8;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';

        oscillator1.frequency.setValueAtTime(400, now);
        oscillator1.frequency.exponentialRampToValueAtTime(100, now + duration);

        oscillator2.frequency.setValueAtTime(200, now);
        oscillator2.frequency.exponentialRampToValueAtTime(50, now + duration);

        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator1.start(now);
        oscillator2.start(now);
        oscillator1.stop(now + duration);
        oscillator2.stop(now + duration);
    },

    playMoveSound() {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }
};
