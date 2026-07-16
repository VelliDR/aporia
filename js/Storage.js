export class Storage {
    static saveDraft(text) {
        if (text.trim() === "") {
            this.clearDraft();
            return;
        }
        localStorage.setItem('aporia_draft', text);
        localStorage.setItem('aporia_last_active', Date.now().toString());
    }

    static getDraft() {
        return {
            text: localStorage.getItem('aporia_draft') || "",
            lastActive: parseInt(localStorage.getItem('aporia_last_active') || '0')
        };
    }

    static clearDraft() {
        localStorage.removeItem('aporia_draft');
        localStorage.removeItem('aporia_last_active');
    }

    static saveFragment(text, wordCount) {
        let saved = JSON.parse(localStorage.getItem('aporia_fragments')) || [];
        saved.push({ id: Date.now(), date: new Date().toLocaleString('tr-TR'), wordCount, content: text });
        localStorage.setItem('aporia_fragments', JSON.stringify(saved));
    }

    static sealWork(text) {
        const cleanText = text.replace(/\s*BİTTİ\s*$/, "").trim();
        const wordCount = cleanText === "" ? 0 : cleanText.split(/\s+/).length;
        
        let sealedWorks = JSON.parse(localStorage.getItem('aporia_sealed_works')) || [];
        sealedWorks.push({
            id: Date.now(),
            date: new Date().toLocaleString('tr-TR'),
            charCount: cleanText.length,
            wordCount: wordCount,
            content: cleanText
        });
        localStorage.setItem('aporia_sealed_works', JSON.stringify(sealedWorks));
        this.clearDraft();
    }

    static getSealedWorks() {
        return JSON.parse(localStorage.getItem('aporia_sealed_works')) || [];
    }
}