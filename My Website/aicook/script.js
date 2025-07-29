class AICookApp {
    constructor() {
        this.apiKey = localStorage.getItem('geminiApiKey') || '';
        this.initializeElements();
        this.bindEvents();
        this.loadApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyButton = document.getElementById('saveApiKey');

        this.ingredientsInout = document.getElementById('ingredients');
        this.dietarySelect = document.getElementById('dietary');
        this.cuisineSelect = document.getElementById('cuisine')

        this.generateButton = document.getElementById('generateRecipe')
        this.loading = document.getElementById('loading')
        this.recipeSection = document.getElementById('recipeSection')
        this.recipeContent = document.getElementById('recipeContent')

    }

    bindEvents() {
        this.saveApiKeyButton.addEventListener('click', () => this.saveApiKey());
        this.generateButton.addEventListener('click', () => this.generateRecipe());

        this.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key == "Enter") this.saveApiKey
        });

        this.ingredientsInout.addEventListener('keypress', (e) => {
            if ((e.key == "Enter" || e.key == "\n") && e.ctrlKey)
                this.generateRecipe
        });

    }

    loadApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.updateApiKeyStatus(true);

        }
    }

    updateApiKeyStatus(isValid) {
        const Button = this.saveApiKeyButton
        if (isValid) {
            Button.textContent = "Saved ✅";
            Button.style.backgrond = "green"
        }
        else {
            Button.textContent = "Save";
            Button.style.backgrond = "red"
        }
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showError('Please enter yoru Gemini API key correctly')
            return;
        }
        this.apiKey = apiKey;
        localStorage.setItem('geminiApiKey', apiKey);
        this.updateApiKeyStatus(true);

    }

    async generateRecipe() {
        if (!this.apiKey) {
            this.showError("Please save your Gemini API key first")
            return;
        }
        const ingredients = this.ingredientsInout.value.trim();
        if (!ingredients) {
            this.showError("Please enter ingredients")
            return;
        }

        this.showLoading(true)
        this.hideRecipe();

        try {
            const recipe = await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe);

        } catch (error) {
            console.log("Error generating recipe", error)
            this.showError("Failed to generate recipe. Please check your API and try again")
        } finally {
            this.showLoading(false);
        }

    }

    async callGeminiAPI(ingredients) {
        const dietary = this.dietarySelect.value;
        const cuisine = this.cuisineSelect.value;
        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}.`;
        if (dietary) {
            prompt += `Make it ${dietary}.`;
        }
        if (cuisine) {
            prompt += `The cuisine stye should be  ${cuisine}.`;
        }

        prompt += `
        Please format your response as follows:
        - recipe name
        - prep time
        - cook time
        - ingredients (with quantity and serving sizes)
        - instructions (with nunber of steps)
        - any cooking tips, notes or "warnings"
        - THIS IS IMPORTANT!!!! please format it nicely in a bulleted list. Remember what you generate is going to be in <p><p> tags in a html document. You may generate anything that would fit and format like it should.
        - Make sure the recipe is practical and delicious!
        - REMOVE any unncessary backticks especially
        `;

        // Put this later above ^
        // - THIS IS IMPORTANT!!!! please format it nicely in a bulleted list. Remember what you generate is going to be in <p><p> tags in a html document. You may generate anything that would fit and format like it should.

        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }

            })
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error.message || 'Unknown error'}`);
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    displayRecipe(recipe) {
    // let formatedRecipe = this.formatRecipe(recipe); // Remove possibly later
        this.recipeContent.innerHTML = recipe;
        this.showRecipe();
    }
    
    // formatRecipe(recipe) { // Remove function possibly later
    //     //  recipe = recipe.replace(//gm, "")
    //     recipe = recipe.replace(/(^| ) + /gm, "$1")
    //     recipe = recipe.replace(/^- */gm, "")
    //     recipe = recipe.replace(/\*\*(.+?)\*\*/gm, "<strong>$1</strong>")
    //     recipe = recipe.replace(/^(.+)/g, "<h3 class=`recipe-title`>$1</h3>")
    //     recipe = recipe.replace(/^\*/gm, "•")
    //     recipe = recipe.replace(/^(.+)/gm, "<p>$1</p>")
    //     return recipe
    // }

    showError(message) {
        alert(message);
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.style.display = 'block';
            this.generateButton.disabled = true;
            this.generateButton.textContent = "Generating...";
        }
        else {
            this.loading.classList.remove('show')
            this.generateButton.dispabled = false;
            this.generateButton.textContent = "Generate Recipe";
        }

    }

    showRecipe() {
        this.recipeSection.classList.add('show');
        this.recipeSection.scrollIntoView({ behavior: 'smooth' });
    }

    hideRecipe() {
        this.recipeSection.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AICookApp();
});