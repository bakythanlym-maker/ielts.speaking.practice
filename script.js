// Question Bank
const ieltsQuestions = {
    1: [
        "Do you work or are you a student?",
        "What do you like most about your hometown?",
        "Do you enjoy traveling to other countries?",
        "What kind of music do you like listening to?",
        "How often do you go to the cinema?",
        "Do you prefer living in a house or an apartment?",
        "What's your favorite time of the day?",
        "Do you like to stay up late or get up early?",
        "What kind of books do you enjoy reading?",
        "Do you like to go to museums or art galleries?",
        "Do you like wearing watches?",
        "How do you usually spend your weekends?",
        "Do you prefer to study alone or with others?",
        "What was your favorite subject at school?",
        "Do you use social media often?",
        "What's your favorite color and why?",
        "Do you like spicy food?",
        "How often do you drink water?",
        "Do you prefer texting or calling your friends?",
        "What are your plans for the next few years?",
        "Do you like to take photos?",
        "Is there anything you want to learn in the future?",
        "What is your favorite fruit?",
        "Do you like robots?",
        "Do you like science?",
        "What is your favorite cake or dessert?",
        "Do you prefer to walk or take a bus?",
        "How do you feel about rainy days?",
        "Did you enjoy your childhood?",
        "Are you good at remembering names?",
        "Do you like to help others?",
        "What is your favorite flower?",
        "Do you prefer to buy things online or in shops?",
        "Do you like fish?",
        "Do you use a computer every day?",
        "Do you like to watch the sky?",
        "What's your favorite holiday?",
        "Do you like to try new food?",
        "How do you feel about loud noises?"
    ],
    2: [
        "Describe a place you visited that had a significant impact on you.",
        "Describe a person who has been a great influence in your life.",
        "Describe a piece of technology that you find very useful.",
        "Describe a memorable event from your childhood.",
        "Describe a hobby or activity you enjoy doing in your free time.",
        "Describe a book or movie that you would recommend to others.",
        "Describe a successful small business you know about.",
        "Describe a time you used a map (paper or electronic).",
        "Describe an interesting person you met recently.",
        "Describe a beautiful city you have visited.",
        "Describe a rule at your school or work that you agree or disagree with.",
        "Describe a piece of good news you heard recently.",
        "Describe a daily routine that you enjoy.",
        "Describe a long car journey you went on.",
        "Describe an expensive gift you would like to buy for someone.",
        "Describe a historical building you have visited.",
        "Describe a skill you would like to learn in the future.",
        "Describe a website you visit often.",
        "Describe a time you were very busy.",
        "Describe an advertisement you remember well.",
        "Describe a party you attended recently.",
        "Describe an outdoor activity you did for the first time.",
        "Describe a water sport you would like to try.",
        "Describe an interesting old person you know.",
        "Describe a time when you helped a child.",
        "Describe an invention that changed the world.",
        "Describe a competition you took part in.",
        "Describe a job you would like to do in the future.",
        "Describe a sport that you only watch but don't play.",
        "Describe a time you lost something important."
    ],
    3: [
        "How has technology changed the way people communicate?",
        "Do you think it's important for children to learn a second language?",
        "What are the advantages and disadvantages of living in a large city?",
        "How can the education system be improved for the future?",
        "In your opinion, what are the most pressing environmental issues?",
        "How important is it for people to maintain a healthy work-life balance?",
        "Do you think AI will replace teachers in the future?",
        "Should celebrities use their influence to talk about social issues?",
        "How has the way people shop changed in the last 10 years?",
        "Is it better to work for a large company or a small startup?",
        "What role does international tourism play in a country's economy?",
        "How do you think transportation will change in the next 50 years?",
        "Should the government invest more in space exploration or environmental protection?",
        "Why do some people prefer to keep their personal lives private?",
        "Does advertising really influence what people buy?",
        "How important is it to preserve traditional cultures?",
        "Is it better to make decisions alone or in a group?",
        "How does social media affect the mental health of teenagers?",
        "Why is it important to protect wild animals?",
        "Do you think robots will make people lazy?",
        "Is it better to be a leader or a team member?",
        "How has the role of family changed in modern society?",
        "Should art and music be mandatory subjects in school?",
        "What are the qualities of a good world leader?",
        "How can we encourage more people to use public transport?",
        "Do you think globalization is a positive or negative thing?",
        "What are the effects of fast food on society?",
        "How important is money in determining a person's success?",
        "Do you think life is better now than it was 50 years ago?",
        "What should be done to reduce plastic waste in the oceans?"
    ]
};

// State Variables
let currentPart = 1;
let currentQuestion = "";
let timerInterval;
let seconds = 0;
let mediaRecorder;
let audioChunks = [];
let stream;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const categoryLabel = document.getElementById('category-label');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const generateBtn = document.getElementById('generate-btn');
const recordingsList = document.getElementById('recordings-list');

/**
 * Switch between IELTS Parts
 */
function switchPart(part, element) {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        alert("Please stop recording before switching parts.");
        return;
    }

    currentPart = part;
    
    // Update active button UI
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    
    // Update labels
    const labels = { 1: "Part 1: Introduction", 2: "Part 2: Individual Long Turn", 3: "Part 3: Discussion" };
    categoryLabel.textContent = labels[part];
    
    // Clear question text and reset reel
    const reel = document.getElementById('question-reel');
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    reel.innerHTML = '<h2 id="question-text">Click "Generate Question" to begin your practice session.</h2>';
    
    currentQuestion = "";
    resetTimer();
    
    // Refresh icons
    if (window.lucide) lucide.createIcons();
}

/**
 * Generate a random question with a slot-machine reel effect
 */
function generateQuestion() {
    const questions = ieltsQuestions[currentPart];
    const reel = document.getElementById('question-reel');
    const itemHeight = 120; // Matches CSS .reel-item height
    const spinCount = 15; // Number of items in the spin
    
    generateBtn.disabled = true;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.disabled = true);
    
    // 1. Prepare questions for the reel
    const spinSequence = [];
    for (let i = 0; i < spinCount; i++) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        spinSequence.push(questions[randomIndex]);
    }
    
    // Pick the final question (ensure it's different from current if possible)
    let finalIndex;
    do {
        finalIndex = Math.floor(Math.random() * questions.length);
    } while (questions.length > 1 && questions[finalIndex] === currentQuestion);
    
    currentQuestion = questions[finalIndex];
    spinSequence.push(currentQuestion);
    
    // 2. Populate the reel
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    reel.innerHTML = '';
    
    spinSequence.forEach((text, index) => {
        const div = document.createElement('div');
        const isFinal = index === spinSequence.length - 1;
        div.className = 'reel-item' + (isFinal ? ' final' : '');
        div.textContent = text;
        if (isFinal) div.id = 'question-text';
        reel.appendChild(div);
    });
    
    // 3. Trigger the animation
    // Force reflow
    void reel.offsetWidth;
    
    reel.style.transition = 'transform 2s cubic-bezier(0.1, 0, 0, 1)';
    const targetOffset = -(spinSequence.length - 1) * itemHeight;
    reel.style.transform = `translateY(${targetOffset}px)`;
    
    // 4. Cleanup and UI update after animation
    setTimeout(() => {
        generateBtn.disabled = false;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.disabled = false);
    }, 2050);
    
    resetTimer();
}

/**
 * Timer Logic
 */
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    timerDisplay.classList.add('recording');
    
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerDisplay.classList.remove('recording');
}

function resetTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Recording Logic (MediaRecorder API)
 */
async function startRecording() {
    try {
        if (!currentQuestion) {
            alert("Please generate a question first!");
            return;
        }

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            addRecordingToList(audioUrl);
            
            // Cleanup stream
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        
        // UI Updates
        startBtn.disabled = true;
        stopBtn.disabled = false;
        generateBtn.disabled = true;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.disabled = true);
        
        startBtn.classList.add('pulse');
        startTimer();
        
    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required to record. Please ensure you've granted permission.");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        
        // UI Updates
        startBtn.disabled = false;
        stopBtn.disabled = true;
        generateBtn.disabled = false;
        document.querySelectorAll('.nav-btn').forEach(btn => btn.disabled = false);
        
        startBtn.classList.remove('pulse');
        stopTimer();
    }
}

/**
 * Add recording to the list with enhanced UI and icons
 */
function addRecordingToList(url) {
    const item = document.createElement('div');
    item.className = 'recording-item';
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const duration = timerDisplay.textContent;
    
    item.innerHTML = `
        <div class="recording-item-header">
            <span class="recording-item-title">Part ${currentPart} - ${timestamp} (${duration})</span>
            <div style="display: flex; align-items: center; gap: 4px; color: var(--success); font-size: 0.75rem; font-weight: 600;">
                <i data-lucide="check-circle" style="width: 14px; height: 14px;"></i> Saved
            </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.5; font-weight: 400;">
            "${currentQuestion.substring(0, 100)}${currentQuestion.length > 100 ? '...' : ''}"
        </p>
        <audio controls src="${url}"></audio>
    `;
    
    recordingsList.prepend(item);
    if (window.lucide) lucide.createIcons();
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    if (window.lucide) lucide.createIcons();
});
