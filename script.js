document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const wordLayer = $("#love-word-layer");
  const messageBox = $("#message");
  const nextButton = $("#nextButton");
  const heartButton = $("#heartButton");
  const headline = $("#headline");
  const subtitle = $("#subtitle");
  const signature = $("#signature");
  const celebration = $("#celebration");
  const replayButton = $("#replayButton");
  const closeButton = $("#closeButton");
  const music = $("#background-music");
  const musicToggle = $("#music-toggle");
  const canvas = $("#universe");

  let paragraphIndex = 0;
  let musicPlaying = false;
  let resizeTimer;
  let fallingTimer;
  let celebrationOpen = false;

  // =====================================
  // 1. CAHAYA LATAR BELAKANG
  // =====================================

  if (!document.querySelector(".ambient-light")) {
    const ambient = document.createElement("div");
    ambient.className = "ambient-light";
    document.body.prepend(ambient);
  }

  // =====================================
  // 2. ISI SURAT
  // =====================================

  const paragraphs = [
    "Ada hal-hal yang terkadang sulit aku ungkapkan secara langsung. Bukan karena aku tidak ingin bercerita, tetapi terkadang hati membutuhkan waktu untuk menemukan kata-kata yang tepat.",

    "Aku tahu, dalam perjalanan kita, mungkin ada kata-kata yang menyakitkan, sikap yang mengecewakan, dan hal-hal yang tanpa sadar membuat hati kita terluka. Untuk semua itu, aku minta maaf.",

    "Maaf jika terkadang aku belum bisa memahami perasaanmu. Maaf jika sikapku membuatmu merasa sendirian, padahal seharusnya aku menjadi tempat ternyaman untukmu pulang.",

    "Aku tidak bisa menjanjikan bahwa semuanya akan selalu mudah. Namun, aku ingin belajar menjadi seseorang yang lebih baik untukmu. Seseorang yang bukan hanya hadir ketika semuanya menyenangkan, tetapi juga tetap berusaha memahami ketika keadaan terasa berat.",

    "Jika suatu hari kamu merindukan aku, ingatlah bahwa di sini ada hati yang juga merindukanmu. Mungkin tidak setiap rindu mampu disampaikan, dan tidak setiap maaf bisa langsung menyembuhkan luka, tetapi ketulusanku ingin selalu menemukan jalan untuk sampai kepadamu.",

    "Aku tidak meminta kita menjadi sempurna. Aku hanya berharap kita masih mau saling mendengarkan, saling memaafkan, dan memperbaiki hal-hal yang memang masih bisa kita perbaiki.",

    "Terima kasih karena pernah dan masih menjadi bagian dari hari-hariku. Jika ada kesempatan untuk memperbaiki semuanya, aku ingin menjalaninya dengan lebih dewasa, lebih sabar, dan lebih menghargai perasaanmu.",

    "Pada akhirnya, di antara rindu yang belum selesai dan maaf yang ingin kusampaikan, ada satu hal yang ingin kamu tahu: kamu berarti bagiku. ❤️"
  ];

  const words = [
    "RINDU",
    "MAAF",
    "AKU MERINDUKANMU",
    "ANDAI KAU TAHU",
    "KENANGAN",
    "PULANGLAH",
    "KAMU",
    "AKU & KAMU",
    "I MISS YOU",
    "MAAFKAN AKU",
    "MASIH DI SINI",
    "SEBUAH HARAPAN",
    "SAYANG",
    "JANGAN LUPA",
    "HATI",
    "KITA",
    "♡",
    "SEANDAINYA",
    "PELUK JAUH",
    "SELALU ADA"
  ];

  // =====================================
  // 3. TULISAN MEMBENTUK HATI
  // =====================================

  function heartPoint(t) {
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y:
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
    };
  }

  function createHeartOutline() {
    if (!wordLayer) return;

    wordLayer.replaceChildren();

    const mobile = window.innerWidth < 520;
    const count = mobile ? 42 : 70;

    for (let i = 0; i < count; i++) {
      const point = heartPoint((Math.PI * 2 * i) / count);
      const word = document.createElement("span");

      word.className = "love-word";
      word.textContent = words[i % words.length];

      word.style.left =
        `${50 + (point.x / 17) * (mobile ? 41 : 44)}%`;

      word.style.top =
        `${49 - (point.y / 17) * (mobile ? 39 : 42)}%`;

      word.style.setProperty(
        "--pulse",
        `${3 + Math.random() * 3}s`
      );

      word.style.setProperty(
        "--fade",
        `${3 + Math.random() * 4}s`
      );

      word.style.setProperty(
        "--drift",
        `${5 + Math.random() * 6}s`
      );

      word.style.setProperty(
        "--delay",
        `${-Math.random() * 7}s`
      );

      wordLayer.appendChild(word);
    }
  }

  createHeartOutline();

  // =====================================
  // 4. BINTANG BERKELIP
  // =====================================

  const ctx = canvas ? canvas.getContext("2d") : null;

  let stars = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrame = null;

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.floor(canvasWidth * dpr);
    canvas.height = Math.floor(canvasHeight * dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
      130,
      Math.floor((canvasWidth * canvasHeight) / 7000)
    );

    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: 0.4 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.6,
      speed: 0.001 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2
    }));
  }

  function drawStars(time = 0) {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const star of stars) {
      const twinkle = Math.sin(
        time * star.speed + star.phase
      ) * 0.3;

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(255, 211, 231, ${
        Math.max(0.08, star.alpha + twinkle)
      })`;

      ctx.fill();
    }

    animationFrame = window.requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  drawStars();

  // =====================================
  // 5. BUNGA SAKURA DAN HATI BERGUGURAN
  // =====================================

  const fallingItems = [
    { symbol: "🌸", type: "sakura" },
    { symbol: "🌸", type: "sakura" },
    { symbol: "🌸", type: "sakura" },
    { symbol: "🌷", type: "sakura" },
    { symbol: "✿", type: "sakura" },
    { symbol: "♡", type: "heart" },
    { symbol: "♥", type: "heart" },
    { symbol: "💗", type: "heart" }
  ];

  function createFallingPetal() {
    if (document.hidden) return;

    const item = fallingItems[
      Math.floor(Math.random() * fallingItems.length)
    ];

    const petal = document.createElement("span");

    petal.className = "falling-petal";

    if (item.type === "heart") {
      petal.classList.add("is-heart");
    }

    petal.textContent = item.symbol;

    const duration = 9 + Math.random() * 8;
    const startX = Math.random() * 100;
    const size = item.type === "heart"
      ? 13 + Math.random() * 17
      : 15 + Math.random() * 19;

    petal.style.setProperty("--start-x", `${startX}vw`);
    petal.style.setProperty("--petal-size", `${size}px`);
    petal.style.setProperty("--fall-duration", `${duration}s`);

    petal.style.setProperty(
      "--petal-opacity",
      `${0.55 + Math.random() * 0.4}`
    );

    document.body.appendChild(petal);

    window.setTimeout(() => petal.remove(), duration * 1000 + 500);
  }

  function startFallingAnimation() {
    if (fallingTimer) {
      clearInterval(fallingTimer);
    }

    // Bunga langsung muncul ketika halaman dibuka.
    for (let i = 0; i < 12; i++) {
      window.setTimeout(createFallingPetal, i * 180);
    }

    // Bunga terus turun dengan posisi dan kecepatan acak.
    fallingTimer = window.setInterval(() => {
      createFallingPetal();

      if (Math.random() > 0.45) {
        window.setTimeout(createFallingPetal, 250);
      }
    }, 550);
  }

  startFallingAnimation();

  // =====================================
  // 6. HATI TERBANG SAAT DIKLIK
  // =====================================

  function burstHearts(x, y, count = 12, large = false) {
    const symbols = ["♥", "♡", "❤", "💗"];

    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");

      heart.className = "heart-particle";

      heart.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      const angle = Math.random() * Math.PI * 2;

      const distance = large
        ? 100 + Math.random() * 220
        : 35 + Math.random() * 100;

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;

      heart.style.fontSize =
        `${(large ? 13 : 9) + Math.random() * (large ? 22 : 13)}px`;

      heart.style.setProperty(
        "--x",
        `${Math.cos(angle) * distance}px`
      );

      heart.style.setProperty(
        "--y",
        `${Math.sin(angle) * distance}px`
      );

      heart.style.setProperty(
        "--scale",
        `${0.4 + Math.random() * 1.2}`
      );

      heart.style.setProperty(
        "--rotation",
        `${-180 + Math.random() * 360}deg`
      );

      heart.style.setProperty(
        "--duration",
        `${1.5 + Math.random() * 1.5}s`
      );

      document.body.appendChild(heart);

      window.setTimeout(() => heart.remove(), 3300);
    }
  }

  function createGlowBurst(x, y) {
    const glow = document.createElement("span");

    glow.className = "glow-burst";
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;

    document.body.appendChild(glow);

    window.setTimeout(() => glow.remove(), 1600);
  }

  // Klik area kosong akan memunculkan hati kecil.
  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    if (target.closest("button, a, #celebration, #music-card")) {
      return;
    }

    burstHearts(event.clientX, event.clientY, 5);
  });

  // =====================================
  // 7. SURAT DIBACA BERTAHAP
  // =====================================

  function showNextParagraph() {
    if (!messageBox || paragraphIndex >= paragraphs.length) {
      return;
    }

    const paragraph = document.createElement("p");

    paragraph.className = "message-paragraph";
    paragraph.textContent = paragraphs[paragraphIndex];

    messageBox.appendChild(paragraph);

    paragraphIndex++;

    const rect = paragraph.getBoundingClientRect();

    burstHearts(
      rect.left + rect.width / 2,
      Math.min(rect.top + 25, window.innerHeight - 35),
      8
    );

    if (paragraphIndex < paragraphs.length) {
      nextButton.textContent = "Lanjut membaca ♡";
    } else {
      nextButton.hidden = true;
      heartButton.hidden = false;

      signature.textContent = "Dengan tulus, untukmu. ❤️";
      subtitle.textContent =
        "Masih ada satu hal yang ingin kusampaikan...";
    }

    paragraph.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function resetLetter() {
    paragraphIndex = 0;

    messageBox.replaceChildren();

    const intro = document.createElement("p");
    intro.className = "intro-message";
    intro.textContent =
      "Ada sesuatu yang ingin kusampaikan dari hati. Luangkan sedikit waktumu, ya. ❤️";

    messageBox.appendChild(intro);

    headline.textContent = "Hai, Sayang!";
    subtitle.textContent = "Aku punya sesuatu untuk kamu...";
    signature.textContent = "";

    nextButton.hidden = false;
    nextButton.textContent = "Baca pesanku ♡";
    heartButton.hidden = true;

    celebration.classList.remove("active");
    celebration.setAttribute("aria-hidden", "true");

    celebrationOpen = false;
  }

  nextButton.addEventListener("click", async () => {
    // Mencoba memulai musik jika browser sebelumnya memblokir autoplay.
    if (music && music.paused) {
      await playMusic();
    }

    if (paragraphIndex === 0) {
      messageBox.replaceChildren();

      headline.textContent = "Dari hatiku, untukmu";
      subtitle.textContent =
        "Bacalah perlahan, ya. Ada banyak hal yang ingin kusampaikan...";
    }

    showNextParagraph();
  });

  // =====================================
  // 8. LAYAR KEJUTAN
  // =====================================

  function celebrate() {
    if (celebrationOpen) return;

    celebrationOpen = true;

    celebration.classList.add("active");
    celebration.setAttribute("aria-hidden", "false");

    createGlowBurst(
      window.innerWidth / 2,
      window.innerHeight / 2
    );

    burstHearts(
      window.innerWidth / 2,
      window.innerHeight / 2,
      75,
      true
    );
  }

  function closeCelebration() {
    celebration.classList.remove("active");
    celebration.setAttribute("aria-hidden", "true");

    celebrationOpen = false;
  }

  heartButton.addEventListener("click", celebrate);
  closeButton.addEventListener("click", closeCelebration);

  replayButton.addEventListener("click", () => {
    closeCelebration();
    resetLetter();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  celebration.addEventListener("click", (event) => {
    if (event.target === celebration) {
      closeCelebration();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && celebrationOpen) {
      closeCelebration();
    }
  });

  // =====================================
  // 9. MUSIK LOVE.MP3
  // =====================================

  async function playMusic() {
    if (!music) return false;

    try {
      await music.play();

      musicPlaying = true;
      musicToggle.textContent = "♫ Jeda musik ♡";

      return true;
    } catch (error) {
      musicPlaying = false;
      musicToggle.textContent = "♫ Putar musik ❤️";

      return false;
    }
  }

  function pauseMusic() {
    if (!music) return;

    music.pause();
    musicPlaying = false;
    musicToggle.textContent = "♫ Putar musik ❤️";
  }

  if (music) {
    music.loop = true;
    music.volume = 0.35;
    music.preload = "auto";

    // Coba autoplay. Browser mungkin meminta interaksi pengguna.
    playMusic();

    music.addEventListener("play", () => {
      musicPlaying = true;
      musicToggle.textContent = "♫ Jeda musik ♡";
    });

    music.addEventListener("pause", () => {
      musicPlaying = false;
      musicToggle.textContent = "♫ Putar musik ❤️";
    });

    music.addEventListener("error", () => {
      musicToggle.textContent = "Musik tidak tersedia";
      console.error(
        "File love.mp3 tidak ditemukan atau formatnya tidak didukung."
      );
    });
  }

  musicToggle.addEventListener("click", async () => {
    if (musicPlaying && !music.paused) {
      pauseMusic();
    } else {
      await playMusic();
    }
  });

  // =====================================
  // 10. RESPONSIF DAN TAB AKTIF
  // =====================================

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      createHeartOutline();
      resizeCanvas();
    }, 200);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      createFallingPetal();

      if (!animationFrame) {
        drawStars();
      }
    }
  });

  // Tampilkan kondisi awal.
  resetLetter();
});
