# Görev Yöneticisi

Web Geliştirme / Javascript eğitim projesi. React + Vite + Tailwind CSS ile CRUD (Ekle, Listele, Güncelle, Sil) uygulaması. Veriler tarayıcı **LocalStorage** içinde saklanır.

## Teknolojiler

- **ReactJS** (Vite)
- **Tailwind CSS**
- **LocalStorage**
- Klasör yapısı: `Components`, `Pages`, `Interfaces`

## CRUD işlemleri

| İşlem | Nasıl |
| --- | --- |
| Ekle | Formdan başlık (zorunlu) + açıklama + durum ile yeni görev oluşturma |
| Listele | Ana sayfada görev kartlarının listelenmesi |
| Güncelle | “Düzenle” ile formu doldurup kaydetme |
| Sil | “Sil” ile onay sonrası görev silme |

## Ekran görüntüsü

![Görev Yöneticisi uygulama ekranı](./screenshots/app.png)

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda: `http://localhost:5173`

## Production build

```bash
npm run build
npm run preview
```

## GitHub’a yükleme

```bash
git add .
git commit -m "feat: React Görev Yöneticisi CRUD projesi"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

## Netlify ile yayına alma

1. [Netlify](https://www.netlify.com/) hesabına giriş yap.
2. **Add new site → Import an existing project** ile GitHub reposunu bağla.
3. Build ayarları (`netlify.toml` ile otomatik):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy sonrası canlı URL’yi proje teslim formuna ekle.

Manuel sürükle-bırak için: `npm run build` sonrası `dist` klasörünü Netlify Drop’a yükle.

## Proje teslim checklist

- [x] Modern JS kütüphanesi (React)
- [x] Tailwind CSS
- [x] Components / Pages / Interfaces klasörleri
- [x] Ekle / Listele / Güncelle / Sil
- [x] LocalStorage
- [x] En az 1 ekran görüntüsü
- [ ] Public GitHub reposu
- [ ] Netlify (veya muadili) canlı link

## Lisans

Eğitim amaçlı örnek proje.
