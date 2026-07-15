# 🌊 Aporia // Çelişki, Şiir & Yapısöküm Laboratuvarı

> "Her şey akar; aynı nehirde iki kez yıkanamazsın." — Herakleitos

**Aporia**; yazarın kendi kelimeleriyle dövüştüğü, Herakleitos'un yok edici zaman akışını fiziksel bir tehdit olarak ensesinde hissettiği, tavizsiz ve **Çevrimdışı Öncelikli (Offline-First) bir PWA** yazım editörüdür. 

Sıradan editörlerin o steril, konforlu ve yapay olarak korumacı yapısına bir başkaldırıdır. Yazarı otosansürden, ucuz romantizmden ve klişelerin sıcaklığından arındırmak; onu sadece o anki ham duyguyla, kesintisiz ve cesurca yazmaya zorlamak için tasarlanmıştır.

## 🧠 Felsefi Çekirdek ve Kurallar

Aporia, gücünü üç temel felsefi akımın fiziksel kod sınırlarından alır:

1. **Herakleitos ve Zamanın Yok Edici Akışı:** Yazmayı bıraktığın an, ekrandaki kelimeler yavaşça solmaya başlar. **17 saniye** boyunca yeni bir tuşa basmazsan nehir kelimelerini tamamen yutar. Tarayıcıyı yenilemek, kapatıp kaçmak bir kurtuluş değildir; sistem yerel saate bakar ve geçen süreyi mutlak zaman üzerinden cezalandırır.
2. **Oulipo ve Yapısal Kısıtlamalar:** Yaratıcılık sınırsız özgürlükten değil, katı kurallardan doğar. Editör sana rastgele Oulipo kural kısıtlamaları fırlatır (Örn: *Bu paragrafta 'e' harfini kullanmayı bırak*). Ayrıca ucuz anlatımlardan kaçınman için arka arkaya 4'ten fazla nokta (`....`) koymanı engelleyen noktalama sınırları içerir.
3. **Derrida ve Yapısöküm:** Tıkandığın an fırlatılan kışkırtmalar (prompts), dildeki yerleşik klişeleri yıkar. Seni konfor alanından çıkarıp metni kendi soğuk gerçekliğiyle yüzleştirmeye zorlar.

---

## 🛠️ Temel Özellikler

Aporia, edebi bir gardiyan gibi çalışır ve yazarı şu mekaniklerle disipline eder:

* **⏳ 17 Saniyelik Mutlak Zaman Koridoru:** Yazmayı durdurduğun an geri sayım çubuğu erir. Süre dolduğunda metin tamamen silinir. Sayfa yenilendiğinde, fiziksel olarak geçen süre hesaplanır ve nehir kaldığı saniyeden akmaya devam eder.
* **🚫 Tavizsiz Spam Muhafızı:** Sistemi kandırmak için klavyeye rastgele abanan (`asdasd`, `qwerty`, `sssss` vb.) veya Türkçe fonetik yapısına aykırı sessiz harf yığınları yazan hilekarları anında tespit eder ve tek bir piksel bile bırakmadan **tüm ekranı milisaniyeler içinde temizler**.
* **⚓ 33 Kelimelik Güvenli Liman (Auto-Save):** Anlamlı ve dürüst bir akışla yazılan her 33 kelimede bir, o ana kadarki metin `localStorage` üzerine zaman damgasıyla bir "kurtarılmış parça" olarak mühürlenir.
* **🔏 "BİTTİ" Mührü ve Mistik Arşiv:** Eserini tamamladığında, yeni bir satıra büyük harflerle `BİTTİ` yazarak teslimiyetini beyan edersin. Sistem bu kelimeyi otomatik temizler, eseri kalıcı olarak mühürler, yerel arşive kaldırır ve yazım alanını sıfırlar.
* **📁 Çevrimdışı Kurtarılan Eserler Arşivi:** Ekranın altındaki şık panel sayesinde, mühürlediğin tüm eski şiirlere internete ihtiyaç duymadan erişebilir, tarihleriyle görebilir ve tek tıkla panoya kopyalayabilirsin.

---

## 🛠️ Teknik Altyapı (Tech Stack)

Uygulama, hiçbir ağır kütüphane (React, Vue vb.) veya paketleyici kullanılmadan, doğrudan tarayıcının donanım gücünü kullanan modern teknolojilerle inşa edilmiştir:

* **Çekirdek:** Pure Vanilla JS (ES6+), HTML5, CSS3
* **Tasarım Dili:** Gece çekimlerinde gözü yormayan, derin kırmızı ve siyah kontrastlı, monospaced tipografiye sahip özel karanlık tema (Tailwind CSS)
* **Çevrimdışı Muhafızı (PWA):** Ağ tıkanmalarına ve zombi kilitlenmelerine karşı korumalı, Tailwind CDN'ini dahi yerel önbelleğe alan kurşun geçirmez `service-worker.js` ve `manifest.json`.
* **Veri Depolama:** SQL veya bulut sunucusu olmadan çalışan, tamamen cihazına özel, şifreli mantıkta kurgulanmış `HTML5 LocalStorage` entegrasyonu.

---

## 🤖 Yapay Zeka (AI) İş Birliği Bildirisi

Bu proje, geleneksel yazılım süreçlerinin dışına çıkılarak, insan sezgisinin şiirsel açmazları ile Yapay Zeka (Gemini) mühendisliğinin sıfır hata hedefli ortaklığıyla geliştirilmiştir.

* **Fikir ve Felsefe:** Yazılımcının tıp, edebiyat, felsefe ve analog merceklerin o kusurlu karakterine olan tutkusundan; kelimelerin geçiciliğine duyulan saygıdan doğmuştur.
* **Kodlama ve Matematiksel Optimizasyon:** Gelişmiş spam algılama algoritmalarının fonetik analizi, sayfa yenilendiğinde devreye giren mutlak zaman farkı hesabı ve Service Worker'ın kurulması aşamaları, Gemini ile birebir kod inceleme (code-review) seanslarıyla, tek bir satır gereksiz yük barındırmayacak şekilde inşa edilmiştir.

