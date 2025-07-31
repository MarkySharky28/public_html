import Model from "./model.js";
import View from "./view.js";

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = Model.getLanguage().lang;

let aiRequestInProgress = false

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = Model.appendLine("Player", userText);

    View.updateStory(updateStory);
    View.toggleLoading(true);
    aiRequestInProgress = true;

    const aiResponse = await Model.generateStory(updateStory + "\nNarrator: ")
    aiRequestInProgress = false;
    View.toggleLoading(false);
    const finalStory = Model.appendLine("Narrator: ", aiResponse)
    View.updateStory(finalStory);
    View.speakText(aiResponse, Model.getLanguage().lang);
}

function handleLanguageChange() {
    const selectOption = View.getLanguageSelect().selectedOptions[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dataset.name;
    Model.setLanguage(newLang, newLangName);
    recognition.lang = newLang;
}

function handleStopSpeaking() {
    View.stopSpeaking();
    if (aiRequestInProgress) {
        View.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = Model.resetStory();
    View.updateStory(resetStory);

    setTimeout(() => {
        View.speakText("Story reset! Help me build a story! Star a sentence and I will continue it.",
            Model.getLanguage().lang)
    }, 500);
}

function handlePauseResume(e) {
    const newState = View.pauseOrResumeSpeaking();
    e.target.textContent = newState === "Pause" ? "⏸️Pause" : "▶️Resume";
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => {};
    const initializeStoryContent = View.getInitialStoryContent();
    Model.initializeStory(initializeStoryContent);
    View.updateStory(Model.getStory());


    setTimeout(() => {
        View.speakText("Story reset! Help me build a story! Start a sentence and I will continue it.",
            Model.getLanguage().lang)
    }, 500);

    View.getSpeakBtn().onclick = () => {
        try {
            recognition.start();
        }
        catch (error) {
            console.error("Speech recognition error: ", error)
        }
    };
    recognition.onresult = handleVoiceInput;
    recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error)
        View.toggleLoading(false);
        aiRequestInProgress = false;
    };

    View.getLanguageSelect().addEventListener("change", handleLanguageChange);

    View.getStopSpeakBtn.onclick = handleStopSpeaking;

    View.getPauseSpeakBtn().onlick = handlePauseResume;
}

init();