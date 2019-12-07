const feedybackyScriptName = 'feedybacky.min.js';
class Feedybacky {

    constructor(id, params) {
    	this.params = params;
        this.basePath = null;
        this.consoleErrors = [];
        this.importDependencies();
        this.container = document.getElementById(id);		
		this.extraInfoFunction = params.extraInfo || null;
    	
    	this.loadMessages().then(() => {
            this.initMinifiedContainer();
            this.initExtendedContainer();
            this.initAlertContainer();

            document.getElementById('feedybacky-container-hide-button').addEventListener('click', e => {
                this.showMinimalContainer();
            });
    
            if(this.params.onSubmit) {
                document.getElementById('feedybacky-form').addEventListener('submit', this.params.onSubmit);
            }
            if(this.params.onSubmitUrl) {
                document.getElementById('feedybacky-form').addEventListener('submit', e => {
                    e.preventDefault();
                    
                    this.clearErrors();
                    if(this.validateForm()) {
                    	this.prepareAndSendRequest();
                    	this.showMinimalContainer();
                    }
                });
            }
    
            document.getElementById('feedybacky-form-description').addEventListener('keydown', e => {
                if(e.ctrlKey && e.keyCode === 13) {
                    e.preventDefault();
                    document.getElementById('feedybacky-form-submit-button').click();
                }
            });
    
            document.getElementById('feedybacky-alert-container').addEventListener('click', e => {
                document.getElementById(e.srcElement.id).style.display = 'none';
            });
    
            window.onerror = (err, url, line) => {
                this.consoleErrors.push(`${err} ${url} ${line}`);
                return false;
            };
        });
    }
    
    async loadMessages() {
    	this.defaultVars = {
        	language: 'en',
        	texts: {}
        };
        
        this.params.language = this.params.language || this.defaultVars.language;

        this.defaultVars.texts = await (async () => {
            let json = null;
            if(this.basePath) {
                await this.loadJsonFile(`${this.basePath}/i18n/${this.params.language}.json`, (data) => {
                    json = data;
                }, async (err) => {
                    console.warn(`Feedybacky cannot load default language pack for ${this.params.language}. The default language pack will be loaded.`);
                    await this.loadJsonFile(`${this.basePath}/i18n/${this.defaultVars.language}.json`, data => {
                        json = data;
                    });
                });

            } 
			else {
                try {
                    json = require(`../i18n/${this.params.language}.json`);
                } catch (_) {
                    console.warn(`Feedybacky cannot load default language pack for ${this.params.language}. The default language pack will be loaded.`);
                    json = require(`../i18n/${this.defaultVars.language}.json`);
                }
            }
        	
        	return json;
        })();
        this.params.texts = this.params.texts || {};
        this.params.texts.powered = this.params.texts.hasOwnProperty('powered') 
    		? this.params.texts.powered 
    		: `${this.defaultVars.texts.powered} <a href="http://wildasoftware.pl/" target="_blank">Wilda Software</a>`;
        
        for(const [key, value] of Object.entries(this.defaultVars.texts)) {
        	this.params.texts[key] = this.params.texts[key] || value;
        }
    }
    
    initMinifiedContainer() {
    	this.minifiedContainer = document.createElement('div');
        this.minifiedContainer.id = 'feedybacky-container-minified';
        this.minifiedContainer.title = this.params.texts.tooltip;
        this.minifiedContainer.innerHTML = '<div></div>';
        this.minifiedContainer.setAttribute('data-html2canvas-ignore', true);
        this.container.appendChild(this.minifiedContainer);
        
        this.minifiedContainer.addEventListener('click', e => {
            this.showExtendedContainer();
        });
    }
    
    initExtendedContainer() {
    	this.extendedContainer = document.createElement('div');
        this.extendedContainer.id = 'feedybacky-container-extended';
        this.extendedContainer.setAttribute('data-html2canvas-ignore', true);
        this.container.appendChild(this.extendedContainer);

        const html = `
			<div id="feedybacky-container-title">${this.params.texts.title}</div>
			<div id="feedybacky-container-hide-button" aria-label="Zamknij">
				<span aria-hidden="true">&times;</span>
			</div>
			<div id="feedybacky-description">
				${this.params.texts.description}
			</div>
			<form id="feedybacky-form">
				<textarea maxlength="1000" id="feedybacky-form-description" form="feedybacky-form" name="description" maxlength="" aria-required="true"></textarea>
				<div id="feedybacky-form-description-error-message" class="feedybacky-error-message"></div>
				<div id="feedybacky-container-additional-description">${this.params.texts.additionalDataInformation}</div>
				<label class="feedybacky-container-checkbox"><input type="checkbox" id="feedybacky-form-screenshot-allowed" checked="true"/>${this.params.texts.screenshot}</label>
				<label class="feedybacky-container-checkbox"><input type="checkbox" id="feedybacky-form-metadata-allowed" checked="true"/>${this.params.texts.metadata}</label>
				<button id="feedybacky-form-submit-button" type="submit">${this.params.texts.send}</button>
			</form>
			<div id="feedybacky-container-powered">
				${this.params.texts.powered}
			</div>
		`;

        this.extendedContainer.innerHTML = html;
    }
    
    initAlertContainer() {
    	this.alertContainer = document.createElement('div');
        this.alertContainer.id = 'feedybacky-alert-container';
        this.alertContainer.setAttribute('data-html2canvas-ignore', true);
        this.container.appendChild(this.alertContainer);
    }
	
	clearErrors() {
    	let errorMessageContainers = document.getElementsByClassName('feedybacky-error-message');
    	
    	for(let i = 0; i < errorMessageContainers.length; ++i) {
    		errorMessageContainers[i].innerText = '';
    	}
    }
    
    validateForm() {
    	let descriptionInput = document.getElementById('feedybacky-form-description');
    	let isValidated = true;
    	
    	if(!descriptionInput.value) {
    		document.getElementById('feedybacky-form-description-error-message').innerText = this.params.texts.descriptionErrorEmpty;
    		isValidated = false;
    	}
    	
    	return isValidated;
    }
    
    prepareAndSendRequest() {
    	let descriptionInput = document.getElementById('feedybacky-form-description');
    	
        let payload = {
            message: descriptionInput.value,
            timestamp: new Date(),
            url: window.location.href,
            errors: this.consoleErrors
        };

        if(document.getElementById('feedybacky-form-metadata-allowed').checked) {
            payload['agent'] = navigator.userAgent;
            payload['cookies'] = document.cookie;
            payload['platform'] = navigator.platform;
            payload['screenSize'] = `${screen.width}x${screen.height}`;
            payload['availableScreenSize'] = `${screen.availWidth}x${screen.availHeight}`;
            payload['innerSize'] = `${window.innerWidth}x${window.innerHeight}`;
            payload['colorDepth'] = screen.colorDepth;
            
            if(screen.orientation) {
            	payload['orientation'] = screen.orientation.type;
        	}
        }
		
		if(this.extraInfoFunction) {
			payload = Object.assign(payload, this.extraInfoFunction());
		}

        if(document.getElementById('feedybacky-form-screenshot-allowed').checked) {
            html2canvas(document.body, {
				onrendered: canvas => {
					payload['image'] = canvas.toDataURL('image/png');
					this.sendPostRequest(this.params.onSubmitUrl, payload);
				}
            });
        }
        else {
            this.sendPostRequest(this.params.onSubmitUrl, payload);
        }
        
        descriptionInput.value = '';
    }

    sendPostRequest(url, payload) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(data => {
            if(data.status == 200 || data.status == 201) {
                this.showAlertContainer(true);
            }
            else {
                this.showAlertContainer(false);
            }
        }).catch(e => {
            this.showAlertContainer(false, e);
        })
    }

    showMinimalContainer() {
        this.extendedContainer.style.display = 'none';
        this.minifiedContainer.style.display = 'block';
    }

    showExtendedContainer() {
        this.minifiedContainer.style.display = 'none';
        this.extendedContainer.style.display = 'block';
        document.getElementById('feedybacky-form-description').focus();
    }

    showAlertContainer(isSuccess, status) {
    	this.alertContainer.classList = '';
    	
        if(isSuccess) {
            this.alertContainer.innerHTML = this.params.texts.requestSuccess;
            this.alertContainer.classList = 'feedybacky-alert-container-success';
        } 
        else {
            this.alertContainer.innerHTML = this.params.texts.requestFail;
            this.alertContainer.innerHTML += ' ' + (this.defaultVars.texts['error' + status] || 'error ' + status);
            this.alertContainer.classList = 'feedybacky-alert-container-failure';
        }
        this.alertContainer.style.display = 'inline-block';
        
        setTimeout(() => {
            this.alertContainer.style.display = 'none';
        }, 3000);
    }

    importDependencies() {
        const scripts = document.getElementsByTagName('script');

        for(let i = scripts.length - 1; i >= 0; --i) {
            let src = scripts[i].src;
            let length = src.length;

            let parts = src.split('/');

            if(parts[parts.length - 1].includes(feedybackyScriptName)) {
                this.basePath = parts.slice(0, -2).join('/');
                break;
            }
        }
        if(this.basePath) {
            this.importCssFile(`${this.basePath}/css/feedybacky.min.css`);

            this.importJsFile(`${this.basePath}/dependencies/html2canvas/html2canvas.min.js`);
        }
    }

    importCssFile(url) {
        const head = document.getElementsByTagName('head')[0];
        let stylesheet = document.createElement('link');

        stylesheet.href = url;
        stylesheet.type = 'text/css';
        stylesheet.rel = 'stylesheet';
        head.append(stylesheet);
    }

    importJsFile(url) {
        const body = document.getElementsByTagName('body')[0];

        let script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        body.append(script);
    }
    
    async loadJsonFile(filePath, success, error) {
        try {
            const res = await (await fetch(filePath)).json();
            success(res);
        } 
        catch (e) {
            if(error) {
                error(e);
            }
        }
    }
}

if(typeof module !== 'undefined') {
	module.exports.Feedybacky = Feedybacky;
}