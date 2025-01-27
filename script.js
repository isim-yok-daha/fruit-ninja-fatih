const cups = document.querySelectorAll('.cup');
const startButton = document.getElementById('start-button');
const openPopupButton = document.getElementById('open-popup');
const closeModalButton = document.getElementById('close-modal');
const modal = document.getElementById('game-modal');

let correctCup = null;
// Elementleri seç


// Başlat butonuna tıklanınca bardakları hareket ettir
startButton.addEventListener('click', () => {
  // Bardaklara hareket animasyonu uygula
  cups.forEach((cup) => {
    cup.classList.add('moving');
  });

  // İsteğe bağlı: Bir süre sonra hareketi durdur
  setTimeout(() => {
    cups.forEach((cup) => {
      cup.classList.remove('moving');
    });
  }, 5000); // 5 saniye sonra durur
});

// Rastgele doğru bardağı seç
function setCorrectCup() {
  correctCup = Math.floor(Math.random() * 3) + 1; // 1, 2 veya 3
  console.log('Doğru bardak:', correctCup); // Test için, daha sonra kaldır
}

// Bardakları karıştır
function shuffleCups() {
  return new Promise((resolve) => {
    const shuffleCount = 5;
    let count = 0;

    const interval = setInterval(() => {
      const [first, second] = getTwoRandomCups();
      animateSwap(first, second);

      count++;
      if (count === shuffleCount) {
        clearInterval(interval);
        resolve();
      }
    }, 600); // 0.6 saniyede bir karıştır
  });
}

// İki rastgele bardak seç
function getTwoRandomCups() {
  const cupIndices = [0, 1, 2];
  const first = cupIndices.splice(Math.floor(Math.random() * cupIndices.length), 1)[0];
  const second = cupIndices[Math.floor(Math.random() * cupIndices.length)];
  return [cups[first], cups[second]];
}

// Bardakların pozisyonlarını değiştir ve animasyonu uygula
function animateSwap(first, second) {
  first.classList.add('shuffling');
  second.classList.add('shuffling');

  const firstOrder = first.style.order || getComputedStyle(first).order;
  const secondOrder = second.style.order || getComputedStyle(second).order;

  setTimeout(() => {
    first.style.order = secondOrder;
    second.style.order = firstOrder;

    first.classList.remove('shuffling');
    second.classList.remove('shuffling');
  }, 500); // Animasyon süresi ile uyumlu
}

// Kullanıcı etkileşimi
function handleCupClick(event) {
  const selectedCup = parseInt(event.target.dataset.cup);

  if (selectedCup === correctCup) {
    revealBall(event.target); // Doğru bardakta topu göster
    alert('Tebrikler, doğru tahmin!');
  } else {
    alert('Yanlış tahmin, tekrar deneyin.');
  }
}

// Doğru bardakta topu göster
function revealBall(cup) {
  cup.classList.add('open'); // Bardak yukarı açılır
}

// Modal açma
openPopupButton.addEventListener('click', () => {
  modal.classList.remove('hidden'); // Modal görünür hale gelir
});

// Modal kapatma
closeModalButton.addEventListener('click', () => {
  modal.classList.add('hidden'); // Modal gizlenir
});

// Başlat düğmesi
startButton.addEventListener('click', async () => {
  // Tüm bardakları kapalı hale getir
  cups.forEach((cup) => {
    cup.classList.remove('open');
    cup.removeEventListener('click', handleCupClick); // Önceki eventleri kaldır
  });

  setCorrectCup();
  await shuffleCups();
  cups.forEach((cup) => cup.addEventListener('click', handleCupClick));
});
