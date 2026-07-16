export class SpamGuard {
    static isSpam(text) {
        try {
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            if (words.length === 0) return false;

            let suspiciousCount = 0;

            for (const word of words) {
                // 1. Aşırı Uzun Kelime (Masa yumruklama/Kopyala-Yapıştır)
                if (word.length > 25) return true;

                // 2. Aynı Harfin Tekrarı (hhhhh, aaaaa)
                if (/(.)\1{3,}/.test(word)) return true;

                // 3. Sessiz Harf Yığını (qwrtypsd)
                if (/[bcçdfgğhjklmnprsştvyzBCÇDFGĞHJKLMNPRSŞTVYZ]{6,}/i.test(word)) return true;

                // 4. Sesli Harf Yığını (oooouuuu)
                if (/[aeıioöuüAEIİOÖUÜ]{5,}/i.test(word)) return true;

                // 5. Hece/Örüntü Tekrarı (asdasd, qweqwe, ahahah)
                if (/([a-zA-ZğüşıöçĞÜŞİÖÇ]{2,4})\1{2,}/.test(word)) return true;

                // Oransal Kontrol için: 4 harften uzun ve hiç sesli harf içermeyenler
                if (word.length > 4 && !/[aeıioöuüAEIİOÖUÜ]/i.test(word)) {
                    suspiciousCount++;
                }
            }

            // Metnin %25'i şüpheli sessiz harf yığınlarından oluşuyorsa
            if (words.length > 2 && (suspiciousCount / words.length) > 0.25) {
                return true;
            }

            return false;
        } catch (error) {
            // Eğer hilebaz zihin Regex motorunu çökertecek bir kombinasyon bulursa, 
            // sistem sessizce durmak yerine güvenliği seçip metni yutacaktır.
            console.error("SpamGuard sarsıntı geçirdi. Metin imha ediliyor.", error);
            return true; 
        }
    }
}