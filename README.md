# 🗂️ Flashcard App & Android Widget

Modern, etkileşimli ve kapsamlı bir kelime/bilgi kartı (flashcard) çalışma ekosistemi. Hem **Web** arayüzü hem de **Android Home Screen (Ana Ekran) İnteraktif Widget** desteğine sahip **Mobil** uygulamayı içerir.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Android](https://img.shields.io/badge/Android-APK_Ready-3DDC84?logo=android&logoColor=white)](https://developer.android.com/)

---

## 📑 İçindekiler
- [Genel Bakış](#-genel-bakış)
- [Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
- [Android Home Screen Widget](#-android-home-screen-widget-özellikleri)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Proje Mimarisi](#-proje-mimarisi)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Web Uygulaması](#1-web-uygulaması-kurulumu)
  - [Mobil Uygulama & Android Studio](#2-mobil-uygulama-ve-android-kurulumu)
- [APK Derleme ve Yükleme](#-apk-derleme-ve-telefona-yükleme)
- [Lisans](#-lisans)

---

## 🌟 Genel Bakış

Flashcard App, kullanıcıların yeni diller öğrenirken, sınavlara hazırlanırken veya günlük bilgileri pekiştirirken etkili bir şekilde kart oluşturmalarını, düzenlemelerini ve pratik yapmalarını sağlayan çift platformlu bir projedir:

1. **Web Uygulaması (`/src`):** Zengin ve şık kullanıcı arayüzü, 3D kart çevirme efektleri, deste yönetimi ve çalışma istatistikleri.
2. **Mobil Uygulama (`/mobile`):** Expo ve React Native tabanlı, çevrimdışı çalışma destekli ve ana ekran widget'ı ile entegre bağımsız Android uygulaması.

---

## 🚀 Öne Çıkan Özellikler

### 💻 Web Platformu
- **3D Kart Çevirme Animasyonları:** Akıcı CSS 3D dönüşüm animasyonları ile gerçek kart deneyimi.
- **Deste ve Kart Yönetimi:** Yeni desteler oluşturma, düzenleme, silme ve kart ekleme.
- **İlerleme ve İstatistikler:** Doğru/yanlış cevap takibi, öğrenme oranı grafiği.
- **Arama ve Filtreleme:** Desteler ve kartlar arasında anlık hızlı arama.
- **Yerel Depolama (LocalStorage):** İnternet bağlantısı gerektirmeyen kesintisiz veri saklama.

### 📱 Mobil Platform & Android Entegrasyonu
- **Expo Router:** Modern dosya tabanlı gezinme mimarisi.
- **Çevrimdışı (Offline Standalone) Destek:** Metro dev-server gerektirmeden bağımsız çalışan APK.
- **Reaktif Veri Senkronizasyonu:** AsyncStorage değişikliklerinin anında ana ekran widget'ına yansıması.

---

## 📲 Android Home Screen Widget Özellikleri

Android ana ekranına eklenebilen widget, Jetpack Compose ve Glance altyapısı kullanılarak geliştirilmiştir:

- **Soru & Cevap İnceleme:** Destenizdeki kartları doğrudan telefonunuzun ana ekranından görüntüleyin.
- **Reveal Answer (Cevabı Göster/Gizle):** Butona dokunduğunuzda kartın cevabı anında açılır veya gizlenir.
- **Open App (Uygulamayı Aç):** Widget üzerindeki butona dokunulduğunda uygulama doğrudan başlatılır.
- **Kart Sayacı:** Destede toplam kaç kart olduğunu ve hangi kartta olduğunuzu anlık gösterir.

---

## 🛠 Teknoloji Yığını

| Alan | Teknolojiler |
| :--- | :--- |
| **Web Frontend** | React 18, TypeScript, Vite, Modern CSS (Flexbox/Grid, Glassmorphism, 3D Transforms) |
| **Mobil Uygulama** | React Native, Expo SDK 52, Expo Router, TypeScript |
| **Android Native & Widget** | Jetpack Compose, Android Glance, Expo-Widgets, Gradle, Kotlin |
| **Depolama** | Browser LocalStorage (Web), AsyncStorage & SharedPreferences (Mobil/Widget) |
| **İkon ve Varlıklar** | Lucide React, Expo Vector Icons |

---

## 📂 Proje Mimarisi

```text
card/
├── src/                          # Web Uygulaması Kaynak Kodları
│   ├── components/               # UI Bileşenleri (Flashcard, DeckList, Modal, StudyMode vb.)
│   ├── data/                     # Örnek başlangıç verileri
│   ├── types/                    # Web TypeScript tip tanımları
│   ├── utils/                    # LocalStorage ve yardımcı fonksiyonlar
│   ├── App.tsx                   # Ana Web uygulaması
│   └── main.tsx                  # Web giriş noktası
│
├── mobile/                       # React Native & Expo Mobil Uygulaması
│   ├── android/                  # Android Native Projesi (Gradle, Kotlin, Manifest)
│   │   └── app/src/main/java/.../FlashcardWidgetProvider.kt # Widget Native Altyapısı
│   ├── src/
│   │   ├── app/                  # Expo Router sayfaları (Tabs, Deck Detail, Study)
│   │   ├── components/           # Mobil 3D Kart ve UI bileşenleri
│   │   ├── services/             # Storage ve Widget senkronizasyon servisi
│   │   ├── types/                # Mobil veri modelleri
│   │   └── widgets/              # Cross-Platform Widget Kodları
│   │       ├── FlashcardWidget.android.tsx # Android Glance / Jetpack Compose Widget
│   │       └── FlashcardWidget.ios.tsx     # iOS WidgetKit / SwiftUI Widget
│   └── app.json                  # Expo ve Widget yapılandırmaları
│
├── .gitignore                    # Boyut optimizasyonu yapılmış Git kuralları
├── package.json                  # Web bağımlılıkları ve scriptleri
└── vite.config.ts                # Vite konfigürasyonu
```

---

## 💻 Kurulum ve Çalıştırma

### Gereksinimler
- **Node.js**: v18 veya üzeri
- **npm** veya **yarn**
- **Android Studio** & **JDK 17+** (Mobil APK derlemesi için)

---

### 1. Web Uygulaması Kurulumu

Proje ana dizininde:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresine giderek web arayüzünü kullanabilirsiniz.

---

### 2. Mobil Uygulama ve Android Kurulumu

```bash
# Mobil dizinine geçin
cd mobile

# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda başlatın
npx expo start
```

---

## 📦 APK Derleme ve Telefona Yükleme

Uygulamanın internet gerektirmeden bağımsız çalışan debug APK'sını derlemek için:

```powershell
# Mobil android dizinine gidin
cd mobile/android

# Java yolunu belirleyip APK derleyin
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
.\gradlew.bat assembleDebug
```

Derlenen APK çıktısı:
```text
mobile/android/app/build/outputs/apk/debug/app-debug.apk
```
Bu APK dosyasını Android telefonunuza aktarıp yükleyebilir, ana ekrana uzun basıp **Flashcard Widget**'ı ekleyerek doğrudan kullanabilirsiniz.

---

## 📄 Lisans

Bu proje açık kaynaklıdır ve [MIT Lisansı](LICENSE) kapsamında geliştirilmiştir.
