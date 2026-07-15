const PROMPTS = [
    "Derrida: Son yazdığın romantik sıfatı sil ve yerine mekanik bir nesne koy.",
    "Oulipo Kuralı: Bu paragrafta artık 'e' (veya 'E') harfini kullanmayı bırak.",
    "Herakleitos Akışı: Bir sonraki cümleyi en son kelimesinden geriye doğru inşa et.",
    "Yapısöküm: En çok güvendiğin inancı yerle bir eden sert bir dize ekle.",
    "Sadece somut nesneleri (taş, demir, kül) kullanarak soyut bir acıyı anlat.",
    "Ritim Değişimi: Sonraki üç cümleyi sadece ikişer kelimeden oluştur.",
    "Nietzsche: Maskeni düşür. Az önce yazdığın dizeyi en çok nefret ettiğin karakterin gözünden oku ve yık.",
    "Cioran: Dünyanın tüm ağırlığını tek bir kelimeye sığdırmak zorunda olsan bu ne olurdu? O kelimeyle başla.",
    "Spinoza: Doğanın mekanik tıkırtısını hisset. Duygusal tüm kelimeleri geometrik kavramlarla değiştir.",
    "Camus: Sisyphos gibi yazıyorsun. Şimdi en iyi olduğunu düşündüğün o iki dizeyi sil ve yoluna devam et.",
    "Sessizlik Kanunu: Sonraki cümlede hiçbir noktalama işareti kullanma.",
    "Renk Yasağı: Siyah ve beyaz dahil hiçbir rengi anmadan bir karanlık hissi yarat.",
    "Barthes: Yazar öldü. Şimdi bu metne tamamen yabancı, üçüncü bir şahsın gözünden soğuk bir gözlem ekle.",
    "Zaman Aşımı: Son yazdığın kelimeyi bir sonraki cümlenin de sonuna koymak zorundasın.",
    "Bedensel Odak: Karakterin sadece fiziksel duyularına (soğuk metal, genizdeki toz) odaklan, iç sesini kapat."
];

class AporiaEngine {
    constructor() {
        this.editor = document.getElementById('editor');
        this.fadeBar = document.getElementById('fade-bar');
        this.promptBox = document.getElementById('prompt-box');
        this.provokeBtn = document.getElementById('provoke-btn');
        this.timerLabel = document.getElementById('timer-label');
        this.charCount = document.getElementById('char-count');
        this.wordCount = document.getElementById('word-count');
        
        // Arşiv Elemanları
        this.archiveBtn = document.getElementById('archive-btn');
        this.archiveModal = document.getElementById('archive-modal');
        this.closeArchive = document.getElementById('close-archive');
        this.archiveList = document.getElementById('archive-list');

        this.idleTime = 0; 
        this.maxIdle = 17;  
        this.interval = null;
        this.opacity = 1.0;
        this.lastSavedThreshold = 0; 

        this.init();
    }

    init() {
        this.editor.addEventListener('input', () => this.onInput(false));
        this.provokeBtn.addEventListener('click', () => this.provoke());
        
        // Arşiv Butonları Dinleyicileri
        this.archiveBtn.addEventListener('click', () => this.openArchiveModal());
        this.closeArchive.addEventListener('click', () => this.closeArchiveModal());

        this.restoreDraft();
        this.interval = setInterval(() => this.tick(), 100);
    }

    restoreDraft() {
        const savedDraft = localStorage.getItem('aporia_draft');
        const lastActive = parseInt(localStorage.getItem('aporia_last_active') || '0');

        if (savedDraft && lastActive > 0) {
            const elapsedSeconds = (Date.now() - lastActive) / 1000;

            if (elapsedSeconds >= this.maxIdle) {
                this.wipeEntirely("Sen yokken nehir yatağı değişti ve kelimelerin sulara gömüldü.");
            } else {
                this.editor.value = savedDraft;
                this.idleTime = elapsedSeconds;
                this.onInput(true); 
            }
        }
    }

    onInput(isRestore = false) {
        this.enforcePunctuationRules();

        const text = this.editor.value;
        const isSpamming = this.checkSpam(text);

        if (isSpamming) {
            this.wipeEntirely("Spam algılandı! Nehir sahte kelimeleri anında yuttu.");
            return;
        }

        if (!isRestore) {
            this.idleTime = 0;
        }

        this.opacity = 1.0;
        this.editor.style.opacity = 1.0;
        this.fadeBar.style.width = "100%";
        this.timerLabel.innerText = "Akış güvende.";
        this.timerLabel.style.color = "#662222";

        if (text.trim() !== "") {
            localStorage.setItem('aporia_draft', text);
            localStorage.setItem('aporia_last_active', Date.now().toString());
        } else {
            this.clearDraftData();
        }

        this.updateStats();

        if (/(?:^|\s)BİTTİ\s*$/.test(text)) {
            this.sealWork(text);
        }
    }

    wipeEntirely(reason) {
        this.editor.value = "";
        this.idleTime = 0;
        this.opacity = 1.0;
        this.editor.style.opacity = 1.0;
        this.fadeBar.style.width = "100%";
        this.clearDraftData();
        this.updateStats();
        
        this.promptBox.innerText = reason;
        this.timerLabel.innerText = "Hile kabul edilmez.";
        this.timerLabel.style.color = "#ff3333";
    }

    clearDraftData() {
        localStorage.removeItem('aporia_draft');
        localStorage.removeItem('aporia_last_active');
    }

    enforcePunctuationRules() {
        let val = this.editor.value;
        if (/\.{5,}/.test(val)) {
            const start = this.editor.selectionStart;
            val = val.replace(/\.{5,}/g, '....');
            this.editor.value = val;
            const diff = start - this.editor.selectionStart;
            this.editor.setSelectionRange(start - diff, start - diff);
        }
    }

    checkSpam(text) {
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return false;

        let spamScore = 0;
        const vowels = /[aeıioöuüAEIİOÖUÜ]/;
        const keyboardSmash = /asd|qwe|dfg|ghj|jkl|zxc|bnm|fgh|rty|tyu/i;

        for (const word of words) {
            if (word.length > 4) {
                if (!vowels.test(word)) {
                    spamScore++;
                    continue;
                }
                if (keyboardSmash.test(word)) {
                    spamScore++;
                    continue;
                }
                if (/(.)\1{3,}/.test(word)) {
                    spamScore++;
                    continue;
                }
                if (/[bcçdfgğhjklmnprsştvyzBCÇDFGĞHJKLMNPRSŞTVYZ]{5,}/.test(word)) {
                    spamScore++;
                    continue;
                }
            }
        }
        return (spamScore / words.length) > 0.3;
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
                this.editor.value = "";
                this.clearDraftData();
                this.onInput();
                this.promptBox.innerText = "Nehir kelimelerini yuttu. Temiz bir zihinle, durmadan yeniden başla.";
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

        if (currentWordCount > 0 && currentWordCount % 33 === 0 && currentWordCount !== this.lastSavedThreshold) {
            this.saveFragment(text, currentWordCount);
            this.lastSavedThreshold = currentWordCount;
        }
    }

    saveFragment(text, count) {
        let saved = JSON.parse(localStorage.getItem('aporia_fragments')) || [];
        const newFragment = {
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            wordCount: count,
            content: text
        };
        saved.push(newFragment);
        localStorage.setItem('aporia_fragments', JSON.stringify(saved));

        this.timerLabel.innerText = `[${count}. Kelime Mühürlendi. Nehir bu parçaya dokunamaz.]`;
        this.timerLabel.style.color = "#00ff66";
        
        this.idleTime = -1; 
    }

    sealWork(text) {
        const cleanText = text.replace(/\s*BİTTİ\s*$/, "");
        const wordCount = cleanText.trim() === "" ? 0 : cleanText.trim().split(/\s+/).length;

        let sealedWorks = JSON.parse(localStorage.getItem('aporia_sealed_works')) || [];
        const newSeal = {
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            charCount: cleanText.length,
            wordCount: wordCount,
            content: cleanText
        };
        sealedWorks.push(newSeal);
        localStorage.setItem('aporia_sealed_works', JSON.stringify(sealedWorks));

        this.editor.value = "";
        this.clearDraftData();
        this.idleTime = 0;
        this.opacity = 1.0;
        this.editor.style.opacity = 1.0;
        this.fadeBar.style.width = "100%";
        this.updateStats();

        this.promptBox.innerText = "MÜHÜR BASILDI. Eser akıntıdan kurtarıldı ve sonsuzluğa teslim edildi.";
        this.timerLabel.innerText = "Eser Güvende.";
        this.timerLabel.style.color = "#00ff66";
    }

    // ARŞİV MODAL YÖNETİMİ
    openArchiveModal() {
        this.renderArchive();
        this.archiveModal.classList.remove('hidden');
    }

    closeArchiveModal() {
        this.archiveModal.classList.add('hidden');
    }

    renderArchive() {
        const sealedWorks = JSON.parse(localStorage.getItem('aporia_sealed_works')) || [];
        this.archiveList.innerHTML = "";

        if (sealedWorks.length === 0) {
            this.archiveList.innerHTML = `<p class="text-[#441111] italic text-center py-8">Mühürlenmiş hiçbir dize bulunamadı. Nehir her şeye el koymuş.</p>`;
            return;
        }

        // En yeni mühürlenen eseri en üstte göster
        sealedWorks.reverse().forEach(work => {
            const card = document.createElement('div');
            card.className = "border border-[#1a0a0a] bg-[#080404] p-4 rounded-md space-y-3";
            
            // Satır sonlarını (<br>) koruyarak şiiri ekranda düzgün gösterelim
            const formattedContent = work.content.replace(/\n/g, '<br>');

            card.innerHTML = `
                <div class="flex justify-between items-center text-xs text-[#552222] border-b border-[#150707] pb-2">
                    <span>📅 ${work.date}</span>
                    <span>✍️ ${work.wordCount} kelime // ${work.charCount} karakter</span>
                </div>
                <p class="text-[#ece3e3] italic leading-relaxed whitespace-pre-line">${formattedContent}</p>
                <div class="flex justify-end gap-3 text-xs pt-2">
                    <button onclick="navigator.clipboard.writeText(\`${work.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`); alert('Eser panoya kopyalandı.')" class="text-[#883333] hover:text-[#00ff66] transition-colors">Panoya Kopyala</button>
                </div>
            `;
            this.archiveList.appendChild(card);
        });
    }

    provoke() {
        const randomIndex = Math.floor(Math.random() * PROMPTS.length);
        this.promptBox.innerText = PROMPTS[randomIndex];
        this.editor.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AporiaEngine();
    // Service Worker Kayıt Kodları (PWA için)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then((reg) => console.log('Aporia Çevrimdışı Muhafızı devrede.', reg.scope))
            .catch((err) => console.log('Muhafız uyandırılamadı:', err));
    });
}
});