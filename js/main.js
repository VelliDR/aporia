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

document.addEventListener('DOMContentLoaded', () => {
    const aporia = new Engine(PROMPTS);
    aporia.start();

    // UI Bağlantıları
    document.getElementById('provoke-btn').addEventListener('click', () => aporia.provoke());
    
    const archiveModal = document.getElementById('archive-modal');
    const archiveList = document.getElementById('archive-list');

    document.getElementById('archive-btn').addEventListener('click', () => {
        renderArchive();
        archiveModal.classList.remove('hidden');
    });

    document.getElementById('close-archive').addEventListener('click', () => {
        archiveModal.classList.add('hidden');
    });

    function renderArchive() {
        const works = Storage.getSealedWorks();
        archiveList.innerHTML = "";

        if (works.length === 0) {
            archiveList.innerHTML = `<p class="text-[#441111] italic text-center py-8">Mühürlenmiş hiçbir dize bulunamadı. Cihazında saklanan bir iz yok.</p>`;
            return;
        }

        works.reverse().forEach(work => {
            const card = document.createElement('div');
            card.className = "border border-[#1a0a0a] bg-[#080404] p-4 rounded-md space-y-3";
            const formattedContent = work.content.replace(/\n/g, '<br>');

            card.innerHTML = `
                <div class="flex justify-between items-center text-xs text-[#552222] border-b border-[#150707] pb-2">
                    <span>🔒 Çevrimdışı Bellek // 📅 ${work.date}</span>
                    <span>✍️ ${work.wordCount} kelime</span>
                </div>
                <p class="text-[#ece3e3] italic leading-relaxed whitespace-pre-line">${formattedContent}</p>
                <div class="flex justify-end gap-3 text-xs pt-2">
                    <button onclick="navigator.clipboard.writeText(\`${work.content.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\`); alert('Eser panoya kopyalandı.')" class="text-[#883333] hover:text-[#00ff66] transition-colors">Kopyala</button>
                </div>
            `;
            archiveList.appendChild(card);
        });
    }
});