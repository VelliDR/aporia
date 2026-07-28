export class SpamGuard {
    static isSpam(text) {
        if (!text || text.trim() === '') return false;

        try {
            const words = text.trim().split(/\s+/);
            if (words.length === 0) return false;

            const recentWords = words.slice(-10);
            let suspiciousCount = 0;

            for (const word of recentWords) {
                if (!word) continue;

                const isLaughter = /^(ha|he|hi|a|e)+$/i.test(word);

                if (word.length > 35) return true;
                if (!isLaughter && /(.)\1{4,}/.test(word)) return true;
                if (/[bcçdfgğhjklmnprsştvyz]{6,}/i.test(word)) return true;
                if (!isLaughter && /[aeıioöuü]{6,}/i.test(word)) return true;
                if (!isLaughter && /([a-zA-ZğüşıöçĞÜŞİÖÇ]{2,4})\1{2,}/.test(word)) return true;

                if (word.length > 5 && !/[aeıioöuüAEIİOÖUÜ]/i.test(word)) {
                    suspiciousCount++;
                }
            }

            if (recentWords.length >= 3 && (suspiciousCount / recentWords.length) > 0.3) {
                return true;
            }

            return false;
        } catch (error) {
            return false; 
        }
    }
}
