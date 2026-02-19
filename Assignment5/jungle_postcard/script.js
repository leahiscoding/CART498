/* CONFIGURATION */
const TOTAL_IMAGES = 50; // Total number of images (animal1.png - animal50.png)
const TOTAL_SOUNDS = 4;  // Total number of sounds (1.m4a - 4.m4a)

// The "Weird Text" Data
const phrases = [
  { text: "Zarimba Flun", meaning: "Hidden danger" },
  { text: "Grolith Munda", meaning: "Morning songbird" },
  { text: "Tuvani Drisk", meaning: "Watchful lizard" },
  { text: "Brelto Surn", meaning: "Whispering vines" },
  { text: "Plenku Virda", meaning: "Sudden rainfall" },
  { text: "Farnik Julo", meaning: "Clever monkey" },
  { text: "Mossira Quend", meaning: "Ancient roots" },
  { text: "Jurnak Tillo", meaning: "Night hunter" },
  { text: "Veldra Sumik", meaning: "Sunlit canopy" },
  { text: "Hurnik Plava", meaning: "Muddy riverbank" },
  { text: "Trelga Surn", meaning: "Echoing calls" },
  { text: "Blorvin Tesk", meaning: "Croaking frog" },
  { text: "Drunko Vasti", meaning: "Silent panther" },
  { text: "Krelto Fungi", meaning: "Secret path" },
  { text: "Vurnik Shala", meaning: "Shifting shadows" },
  { text: "Plinka Drovi", meaning: "Dancing fireflies" }
];

// --- RANDOMIZATION LOGIC ---

// 1. Create an array of numbers [1, 2, 3 ... 50]
let imageDeck = Array.from({length: TOTAL_IMAGES}, (_, i) => i + 1);

// 2. Shuffle the "deck" of images (Fisher-Yates Shuffle)
// This ensures you see all 50 random animals before any repeat!
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffleArray(imageDeck);

// 3. Create the Zoo Map
// Each "slide" gets a shuffled image ID + a random phrase + a random sound
const zooMap = [];

for (let i = 0; i < TOTAL_IMAGES; i++) {
    zooMap.push({
        imageID: imageDeck[i], // Picks from our shuffled deck
        phraseIndex: Math.floor(Math.random() * phrases.length),
        soundIndex: Math.floor(Math.random() * TOTAL_SOUNDS) + 1
    });
}

// State variables
let currentIndex = 0;
let isPlaying = false;

// DOM Elements
const beastImage = document.getElementById('beast-image');
const fileNameDisplay = document.getElementById('file-name');
const alienText = document.getElementById('alien-text');
const translation = document.getElementById('translation');
const currentIdxDisplay = document.getElementById('current-idx');
const audioPlayer = document.getElementById('beast-audio');
const playBtn = document.getElementById('play-btn');
const visualizer = document.querySelector('.visualizer-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// --- FUNCTIONS ---

function updateSlide() {
    // 1. Get the random data for this specific slide
    const currentSlideData = zooMap[currentIndex];
    
    const imageNumber = currentSlideData.imageID;
    const phraseData = phrases[currentSlideData.phraseIndex];
    const soundNumber = currentSlideData.soundIndex;

    // 2. Update Index Display (1 - 50)
    currentIdxDisplay.textContent = (currentIndex + 1).toString().padStart(2, '0');

    // 3. Update Text
    alienText.textContent = phraseData.text;
    translation.textContent = `// TRANSLATION: ${phraseData.meaning.toUpperCase()}`;

    // 4. Update Image (Uses the shuffled ID)
    beastImage.src = `images/animal${imageNumber}.png`;
    
    // Fallback if image fails
    beastImage.onerror = function() {
        this.src = 'https://placehold.co/600x400/000/FFF?text=IMG_MISSING';
    };

    fileNameDisplay.textContent = `REF: ANIMAL_${imageNumber}.PNG`;

    // 5. Update Audio
    stopAudio();
    audioPlayer.src = `sounds/${soundNumber}.m4a`;
}

function playAudio() {
    if (audioPlayer.paused) {
        audioPlayer.play()
            .then(() => {
                playBtn.textContent = "◼ STOP SIGNAL";
                visualizer.classList.add('playing');
                isPlaying = true;
            })
            .catch(err => {
                console.error("Audio play failed:", err);
                alert("Error: " + err.message); 
            });
    } else {
        stopAudio();
    }
}

function stopAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playBtn.textContent = "► HEAR SIGNAL";
    visualizer.classList.remove('playing');
    isPlaying = false;
}

// --- EVENT LISTENERS ---

nextBtn.addEventListener('click', () => {
    // Loop back to start after 50
    currentIndex = (currentIndex + 1) % TOTAL_IMAGES;
    updateSlide();
});

prevBtn.addEventListener('click', () => {
    // Loop to end if going back from start
    currentIndex = (currentIndex - 1 + TOTAL_IMAGES) % TOTAL_IMAGES;
    updateSlide();
});

playBtn.addEventListener('click', playAudio);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === ' ') {
        e.preventDefault(); 
        playAudio();
    }
});

// Initialize on load
updateSlide();
