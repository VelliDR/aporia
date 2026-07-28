import { SpamGuard } from './SpamGuard.js';
import { Storage } from './Storage.js';

export class Engine {
    constructor(prompts = []) {
        this.prompts = prompts;
        this.editor = document.getElementById('editor');
        this.fadeBar = document.getElementById('fade-bar');
        this.promptBox = document.getElementById('prompt-box');
        this.timerLabel = document.getElementById('timer-label');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');

        this.idleTime = 0; 
        this.maxIdle = 7; 
        this.interval = null;
        this.lastTickTime = null;
        this.opacity = 1.0;
        this.lastSavedThreshold = 0; 
        this.lastText = ""; 
        this.currentPrompt = "Yazmaya başla. 7 saniye durursan nehir her şeyi yutacak.";
    }

    start() {
        if (this.interval) clearInterval(this.interval);

        if (this.editor) {
            this.editor.addEventListener('input', () => this.onInput(false));
        }
        
        this.restoreDraft();

        this.lastTickTime = Date.now();
        this.interval = setInterval(() => this.tick(), 100);
    }

    restoreDraft() {
        const draft = Storage.getDraft();
        if (draft && draft.text && draft.lastActive > 0) {
            const elapsedSeconds = (Date.now() - draft.lastActive) / 1000;
            if (elapsedSeconds >= this.maxIdle) {
                this.wipeEntirely("Sen yokken nehir yatağı değişti ve kelimelerin sulara gömüldü.");
            } else {
                if (this.editor) this.editor.value = draft.text;
                this.lastText = draft.text; 
                this.idleTime = elapsedSeconds;
                this.onInput(true); 
            }
        }
    }

    onInput(isRestore = false) {
        this.enforcePunctuationRules();
        const text = this.editor ? this.editor.value : "";

        if (text === this.lastText) return; 

        if (SpamGuard.isSpam(text)) {
            this.wipeEntirely("Spam algılandı! Nehir sahte kelimeleri anında yuttu.");
            return;
        }

        if (this.promptBox && this.promptBox.innerText !== this.currentPrompt) {
            this.promptBox.innerText = this.currentPrompt;
        }

        let isTimerReset = false;

        if (!isRestore) {
            const getMeaningfulLength = (str) => str.replace(/[^\p{L}\p{N}]/gu, '').length;
            const currentMeaningful = getMeaningfulLength(text);
            const lastMeaningful = getMeaningfulLength(this.lastText);

            if (currentMeaningful > lastMeaningful || text.length < this.lastText.length) {
                this.idleTime = 0; 
                isTimerReset = true;
            }
        } else {
            isTimerReset = true;
        }
        
        this.lastText = text;

        if (isTimerReset) {
            this.resetVisuals();
        }

        Storage.saveDraft(text);
        this.updateStats();

        if (/(?:^|\s)BİTTİ\s*$/.test(text)) {
            this.sealWork(text);
        }
    }

    wipeEntirely(reason) {
        if (this.editor) this.editor.value = "";
        this.lastText = ""; 
        this.idleTime = 0;
        this.resetVisuals();
        Storage.clearDraft();
        this.updateStats();
        
        if (this.promptBox) this.promptBox.innerText = reason;
        if (this.timerLabel) {
            this.timerLabel.innerText = "Hile kabul edilmez.";
            this.timerLabel.style.color = "#ff3333";
        }
    }

    resetVisuals() {
        this.opacity = 1.0;
        if (this.editor) this.editor.style.opacity = 1.0;
        if (this.fadeBar) this.fadeBar.style.width = "100%";
        if (this.timerLabel) {
            this.timerLabel.innerText = "Akış güvende.";
            this.timerLabel.style.color = "#662222";
        }
    }

    enforcePunctuationRules() {
        if (!this.editor) return;
        const val = this.editor.value;
        const cleaned = val.replace(/\.{4,}/g, '...');

        if (val !== cleaned) {
            const start = this.editor.selectionStart;
            const diff = val.length - cleaned.length;
            this.editor.value = cleaned;
            const newPos = Math.max(0, start - diff);
            this.editor.setSelectionRange(newPos, newPos);
        }
    }

    tick() {
        const now = Date.now();
        const delta = (now - (this.lastTickTime || now)) / 1000;
        this.lastTickTime = now;

        const text = this.editor ? this.editor.value : "";
        if (text.trim() === "") {
            this.resetVisuals();
            return;
        }

        this.idleTime += delta;
        const remaining = Math.max(0, this.maxIdle - this.idleTime);

        if (this.idleTime >= this.maxIdle) {
            const fadeProgress = (this.idleTime - this.maxIdle) * 2;
            this.opacity = Math.max(0, 1.0 - fadeProgress);
            if (this.editor) this.editor.style.opacity = this.opacity;
            if (this.fadeBar) this.fadeBar.style.width = `${this.opacity * 100}%`;
            
            if (this.timerLabel) {
                this.timerLabel.innerText = "Akıntı kelimeleri yutuyor!";
                this.timerLabel.style.color = "#ff3333";
            }

            if (this.opacity <= 0) {
                this.wipeEntirely("Nehir kelimelerini yuttu. Temiz bir zihinle, durmadan yeniden başla.");
            }
        } else {
            const rawWidth = (remaining / this.maxIdle) * 100;
            const clampedWidth = Math.min(100, Math.max(0, rawWidth));
            if (this.fadeBar) this.fadeBar.style.width = `${clampedWidth}%`;
            
            if (this.timerLabel) {
                if (remaining <= 3) {
                    this.timerLabel.innerText = `Sular Yükseliyor: ${remaining.toFixed(1)}s`;
                    this.timerLabel.style.color = "#ff6666";
                } else {
                    this.timerLabel.innerText = `Akış Güvende (${remaining.toFixed(1)}s)`;
                    this.timerLabel.style.color = "#662222";
                }
            }
        }
    }

    updateStats() {
        const text = this.editor ? this.editor.value.trim() : "";
        const currentWordCount = text === "" ? 0 : text.split(/\s+/).length;
        
        if (this.charCount) this.charCount.innerText = text.length;
        if (this.wordCount) this.wordCount.innerText = currentWordCount;

        if (currentWordCount > 0 && currentWordCount % 50 === 0 && currentWordCount !== this.lastSavedThreshold) {
            Storage.saveFragment(text, currentWordCount);
            this.lastSavedThreshold = currentWordCount;
            if (this.timerLabel) {
                this.timerLabel.innerText = `[${currentWordCount}. Kelime Mühürlendi. Nehir bu parçaya dokunamaz.]`;
                this.timerLabel.style.color = "#00ff66";
            }
            this.idleTime = -1; 
        }
    }

    sealWork(text) {
        Storage.sealWork(text);
        if (this.editor) this.editor.value = "";
        this.lastText = "";
        this.idleTime = 0;
        this.resetVisuals();
        this.updateStats();

        if (this.promptBox) this.promptBox.innerText = "MÜHÜR BASILDI. Eser akıntıdan kurtarıldı ve lokal belleğe kilitlendi.";
        if (this.timerLabel) {
            this.timerLabel.innerText = "Eser Yerel Güvende.";
            this.timerLabel.style.color = "#00ff66";
        }
    }

    provoke() {
        if (!this.prompts || this.prompts.length === 0) return;
        const randomIndex = Math.floor(Math.random() * this.prompts.length);
        this.currentPrompt = this.prompts[randomIndex];
        if (this.promptBox) this.promptBox.innerText = this.currentPrompt;
        if (this.editor) this.editor.focus();
    }
}
