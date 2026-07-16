import { SpamGuard } from './SpamGuard.js';
import { Storage } from './Storage.js';

export class Engine {
    constructor(prompts) {
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
        this.opacity = 1.0;
        this.lastSavedThreshold = 0; 
        this.lastText = ""; 
        this.currentPrompt = "Yazmaya başla. 7 saniye durursan nehir her şeyi yutacak.";
    }

    start() {
        this.editor.addEventListener('input', () => this.onInput(false));
        this.restoreDraft();
        this.interval = setInterval(() => this.tick(), 100);
    }

    restoreDraft() {
        const draft = Storage.getDraft();
        if (draft.text && draft.lastActive > 0) {
            const elapsedSeconds = (Date.now() - draft.lastActive) / 1000;
            if (elapsedSeconds >= this.maxIdle) {
                this.wipeEntirely("Sen yokken nehir yatağı değişti ve kelimelerin sulara gömüldü.");
            } else {
                this.editor.value = draft.text;
                this.lastText = draft.text; 
                this.idleTime = elapsedSeconds;
                this.onInput(true); 
            }
        }
    }

    onInput(isRestore = false) {
        this.enforcePunctuationRules();
        const text = this.editor.value;

        // Metin fiziksel olarak değişmediyse (örn: 4. nokta engellendiyse) direkt çık. 
        // Süre sayacı işlemeye devam eder.
        if (text === this.lastText) return; 

        if (SpamGuard.isSpam(text)) {
            this.wipeEntirely("Spam algılandı! Nehir sahte kelimeleri anında yuttu.");
            return;
        }

        if (this.promptBox.innerText !== this.currentPrompt) {
            this.promptBox.innerText = this.currentPrompt;
        }

        let isTimerReset = false; // Nehrin akışı durduruldu mu?

        if (!isRestore) {
            const getMeaningfulLength = (str) => str.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9]/g, '').length;
            const currentMeaningful = getMeaningfulLength(text);
            const lastMeaningful = getMeaningfulLength(this.lastText);

            // Sadece anlamlı bir harf eklendiyse veya harf silindiyse sayacı sıfırla.
            // Enter veya boşluk tuşları süreyi donduramaz.
            if (currentMeaningful > lastMeaningful || text.length < this.lastText.length) {
                this.idleTime = 0; 
                isTimerReset = true;
            }
        } else {
            isTimerReset = true;
        }
        
        this.lastText = text;

        // ARAYÜZ YALAN SÖYLEMESİN: 
        // Kırmızı barı ve uyarıyı SADECE zaman gerçekten sıfırlandıysa yenile.
        // Enter'a boş boş basıyorsan, o bar erimeye devam edecek.
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
        this.editor.value = "";
        this.lastText = ""; 
        this.idleTime = 0;
        this.resetVisuals();
        Storage.clearDraft();
        this.updateStats();
        
        this.promptBox.innerText = reason;
        this.timerLabel.innerText = "Hile kabul edilmez.";
        this.timerLabel.style.color = "#ff3333";
    }

    resetVisuals() {
        this.opacity = 1.0;
        this.editor.style.opacity = 1.0;
        this.fadeBar.style.width = "100%";
        this.timerLabel.innerText = "Akış güvende.";
        this.timerLabel.style.color = "#662222";
    }

    enforcePunctuationRules() {
        let val = this.editor.value;
        if (/\.{4,}/.test(val)) {
            // İmleç sapmalarını engellemek için farkı hesaba katarak metni kırpıyoruz.
            const start = this.editor.selectionStart;
            const diff = val.length - val.replace(/\.{4,}/g, '...').length;
            this.editor.value = val.replace(/\.{4,}/g, '...');
            this.editor.setSelectionRange(start - diff, start - diff);
        }
    }

    tick() {
        if (this.editor.value.trim() === "") return;

        this.idleTime += 0.1;

        if (this.idleTime >= this.maxIdle) {
            const fadeProgress = (this.idleTime - this.maxIdle) * 2;
            this.opacity = Math.max(0, 1.0 - fadeProgress);
            this.editor.style.opacity = this.opacity;
            this.fadeBar.style.width = `${this.opacity * 100}%`;
            
            this.timerLabel.innerText = "Akıntı kelimeleri yutuyor!";
            this.timerLabel.style.color = "#ff3333";

            if (this.opacity <= 0) {
                this.wipeEntirely("Nehir kelimelerini yuttu. Temiz bir zihinle, durmadan yeniden başla.");
            }
        } else {
            const barWidth = Math.max(0, ((this.maxIdle - this.idleTime) / this.maxIdle) * 100);
            this.fadeBar.style.width = `${barWidth}%`;
        }
    }

    updateStats() {
        const text = this.editor.value.trim();
        const currentWordCount = text === "" ? 0 : text.split(/\s+/).length;
        
        this.charCount.innerText = text.length;
        this.wordCount.innerText = currentWordCount;

        if (currentWordCount > 0 && currentWordCount % 50 === 0 && currentWordCount !== this.lastSavedThreshold) {
            Storage.saveFragment(text, currentWordCount);
            this.lastSavedThreshold = currentWordCount;
            this.timerLabel.innerText = `[${currentWordCount}. Kelime Mühürlendi. Nehir bu parçaya dokunamaz.]`;
            this.timerLabel.style.color = "#00ff66";
            this.idleTime = -1; 
        }
    }

    sealWork(text) {
        Storage.sealWork(text);
        this.editor.value = "";
        this.lastText = "";
        this.idleTime = 0;
        this.resetVisuals();
        this.updateStats();

        this.promptBox.innerText = "MÜHÜR BASILDI. Eser akıntıdan kurtarıldı ve lokal belleğe kilitlendi.";
        this.timerLabel.innerText = "Eser Yerel Güvende.";
        this.timerLabel.style.color = "#00ff66";
    }

    provoke() {
        const randomIndex = Math.floor(Math.random() * this.prompts.length);
        this.currentPrompt = this.prompts[randomIndex];
        this.promptBox.innerText = this.currentPrompt;
        this.editor.focus();
    }
}