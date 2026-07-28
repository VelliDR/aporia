import { Engine } from './Engine.js';
import { Storage } from './Storage.js';

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
    "Camus: Sisyphos gibi yazıyorsun. Şimdi en iyi olduğunu düşündüğün o iki dizeyi sil ve yoluna devam et."
];

function initApp() {
    const aporia = new Engine(PROMPTS);
    aporia.start();

    const provokeBtn = document.getElementById('provoke-btn');
    const archiveBtn = document.getElementById('archive-btn');
    const closeArchiveBtn = document.getElementById('close-archive');
    const archiveModal = document.getElementById('archive-modal');
    const archiveList = document.getElementById('archive-list');

    if (provokeBtn) {
        provokeBtn.addEventListener('click', () => {
            aporia.provoke();
        });
    }

    const closeModal = () => {
        if (archiveModal) archiveModal.classList.add('hidden');
    };

    if (archiveBtn && archiveModal) {
        archiveBtn.addEventListener('click', () => {
            renderArchive();
            archiveModal.classList.remove('hidden');
        });
    }

    if (closeArchiveBtn) {
        closeArchiveBtn.addEventListener('click', closeModal);
    }

    if (archiveModal) {
        archiveModal.addEventListener('click', (e) => {
            if (e.target === archiveModal) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && archiveModal && !archiveModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderArchive() {
        if (!archiveList) return;

        const works = Storage.getSealedWorks();
        archiveList.innerHTML = "";

        if (!works || works.length === 0) {
            archiveList.innerHTML = `<p class="text-[#441111] italic text-center py-8">Mühürlenmiş hiçbir dize bulunamadı. Cihazında saklanan bir iz yok.</p>`;
            return;
        }

        const sortedWorks = [...works].reverse();

        sortedWorks.forEach(work => {
            const card = document.createElement('div');
            card.className = "border border-[#1a0a0a] bg-[#080404] p-4 rounded-md space-y-3";

            let dateStr = "Bilinmeyen Tarih";
            if (work.createdAt) {
                dateStr = new Date(work.createdAt).toLocaleString('tr-TR');
            } else if (work.date) {
                dateStr = work.date;
            }

            const safeContent = escapeHTML(work.content).replace(/\n/g, '<br>');

            card.innerHTML = `
                <div class="flex justify-between items-center text-xs text-[#552222] border-b border-[#150707] pb-2">
                    <span>🔒 Çevrimdışı Bellek // 📅 ${dateStr}</span>
                    <span>✍️ ${work.wordCount || 0} kelime</span>
                </div>
                <p class="text-[#ece3e3] italic leading-relaxed whitespace-pre-line">${safeContent}</p>
                <div class="flex justify-end gap-3 text-xs pt-2">
                    <button class="copy-btn text-[#883333] hover:text-[#00ff66] transition-colors font-mono">Kopyala</button>
                </div>
            `;

            const copyBtn = card.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', async () => {
                    try {
                        await navigator.clipboard.writeText(work.content);
                        const originalText = copyBtn.innerText;
                        copyBtn.innerText = "Kopyalandı!";
                        copyBtn.classList.add('text-[#00ff66]');
                        
                        setTimeout(() => {
                            copyBtn.innerText = originalText;
                            copyBtn.classList.remove('text-[#00ff66]');
                        }, 2000);
                    } catch (err) {
                        console.error("Panoya kopyalama başarısız:", err);
                    }
                });
            }

            archiveList.appendChild(card);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
