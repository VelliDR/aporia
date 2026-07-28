export class Storage {
    static KEYS = {
        DRAFT: 'aporia_draft',
        LAST_ACTIVE: 'aporia_last_active',
        FRAGMENTS: 'aporia_fragments',
        SEALED_WORKS: 'aporia_sealed_works'
    };

    static safeGetJSON(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Storage read error [${key}]:`, error);
            return defaultValue;
        }
    }

    static saveDraft(text) {
        if (!text || text.trim() === "") {
            this.clearDraft();
            return;
        }
        try {
            localStorage.setItem(this.KEYS.DRAFT, text);
            localStorage.setItem(this.KEYS.LAST_ACTIVE, Date.now().toString());
        } catch (error) {
            console.error("Taslak kaydedilemedi:", error);
        }
    }

    static getDraft() {
        try {
            return {
                text: localStorage.getItem(this.KEYS.DRAFT) || "",
                lastActive: parseInt(localStorage.getItem(this.KEYS.LAST_ACTIVE) || '0', 10)
            };
        } catch (error) {
            return { text: "", lastActive: 0 };
        }
    }

    static clearDraft() {
        try {
            localStorage.removeItem(this.KEYS.DRAFT);
            localStorage.removeItem(this.KEYS.LAST_ACTIVE);
        } catch (error) {}
    }

    static saveFragment(text, wordCount) {
        try {
            const saved = this.safeGetJSON(this.KEYS.FRAGMENTS, []);
            saved.push({ id: Date.now(), createdAt: new Date().toISOString(), wordCount, content: text });
            localStorage.setItem(this.KEYS.FRAGMENTS, JSON.stringify(saved));
        } catch (error) {}
    }

    static sealWork(text) {
        try {
            const cleanText = text.replace(/\s*BİTTİ\s*$/, "").trim();
            const wordCount = cleanText === "" ? 0 : cleanText.split(/\s+/).length;
            
            const sealedWorks = this.safeGetJSON(this.KEYS.SEALED_WORKS, []);
            sealedWorks.push({
                id: Date.now(),
                createdAt: new Date().toISOString(),
                charCount: cleanText.length,
                wordCount: wordCount,
                content: cleanText
            });

            localStorage.setItem(this.KEYS.SEALED_WORKS, JSON.stringify(sealedWorks));
            this.clearDraft();
        } catch (error) {
            console.error("Eser mühürleme hatası:", error);
        }
    }

    static getSealedWorks() {
        return this.safeGetJSON(this.KEYS.SEALED_WORKS, []);
    }
}
