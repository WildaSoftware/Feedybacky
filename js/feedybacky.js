const feedybackyScriptName = 'feedybacky.min.js';
const feedybackyPortalEndpoint = 'https://api.feedybacky.com/issue';

const checkboxVisibleOption = 'visible';
const checkboxAutoEnableOption = 'autoEnable';
const checkboxAutoDisableOption = 'autoDisable';
const checkboxOptions = [checkboxVisibleOption, checkboxAutoEnableOption, checkboxAutoDisableOption];

const orderDescriptionPart = 'description';
const orderMessagePart = 'message';
const orderEmailPart = 'email';
const orderExplanationPart = 'explanation';
const orderScreenshotCheckboxPart = 'screenshot';
const orderMetadataCheckboxPart = 'metadata';
const orderHistoryCheckboxPart = 'history';
const orderTermsAcceptedCheckboxPart = 'termsAccepted';
const orderPersonalDataAcceptedCheckboxPart = 'personalDataAccepted';
const orderNotePart = 'note';
const orderParts = [orderDescriptionPart, orderMessagePart, orderEmailPart, orderExplanationPart, orderScreenshotCheckboxPart, orderMetadataCheckboxPart, orderHistoryCheckboxPart, orderTermsAcceptedCheckboxPart, orderPersonalDataAcceptedCheckboxPart, orderNotePart];

const orderTitlePart = 'title';
const orderSendPart = 'send';
const orderPoweredPart = 'powered';
const containerParts = [orderDescriptionPart, orderMessagePart, orderEmailPart, orderExplanationPart, orderScreenshotCheckboxPart, orderMetadataCheckboxPart, orderHistoryCheckboxPart, orderNotePart, orderTitlePart, orderSendPart, orderPoweredPart, orderTermsAcceptedCheckboxPart, orderPersonalDataAcceptedCheckboxPart];

const alertTypeSuccess = 'success';
const alertTypeFailure = 'error';
const alertTypePending = 'pending';

const termsAcceptedStorageItem = 'feedybacky_termsDataAccepted';
const personalDataAcceptedStorageItem = 'feedybacky_personalDataAccepted';
const visitedUrlsStorageItem = 'feedybacky_visitedUrls';

const defaultTheme = 'default';
const darkTheme = 'dark';
const standardThemes = [defaultTheme, darkTheme];

class FeedybackyPayload {
	
	add(key, value) {
		this[key] = value;
	}
}

class Feedybacky {

    constructor(id, params) {
    	this.params = params;
        this.basePath = null;
        this.consoleErrors = [];
        this.importDependencies();
        this.container = document.getElementById(id);		
		this.extraInfoFunction = params.extraInfo || null;
		this.beforeSubmitFunction = params.beforeSubmit || null;
		this.prefix = params.prefix || null;
		this.onSubmitUrlSuccess = params.onSubmitUrlSuccess || null;
		this.onSubmitUrlError = params.onSubmitUrlError || null;
		
		this.theme = params.theme || defaultTheme;
		this.allowedThemes = params.allowedThemes || standardThemes;
		
		if(!this.allowedThemes.includes(this.theme)) {
			this.theme = defaultTheme;
		}
		
		this.eventHistory = [];
		this.historyLimit = params.historyLimit || null;
		
		this.params.urlTracking = this.params.urlTracking;
		if(this.params.urlTracking === undefined) {
			this.params.urlTracking = true;
		}
		else if(this.params.urlTracking === 'false') {
			this.params.urlTracking = false;
		}
		
		if(this.params.urlTracking) {
			this.urlTrackingLimit = params.urlTrackingLimit || 15;		
			this.initUrlTracking();
		}
		
		this.params.classes = this.params.classes || {};
		for(let i = 0; i < containerParts.length; ++i) {
			this.params.classes[containerParts[i]] = this.params.classes[containerParts[i]] || '';
		}
		
		if(!this.params.screenshotField || !checkboxOptions.includes(this.params.screenshotField)) {
        	this.params.screenshotField = checkboxVisibleOption;
        }
        
        if(!this.params.metadataField || !checkboxOptions.includes(this.params.metadataField)) {
        	this.params.metadataField = checkboxVisibleOption;
        }
		
		if(!this.params.historyField || !checkboxOptions.includes(this.params.historyField)) {
			this.params.historyField = checkboxVisibleOption;
		}
		
		if(!this.params.side || !['left', 'right'].includes(this.params.side)) {
			this.params.side = 'right';
		}
		
		if(this.params.order) {
			const orderSplit = this.params.order.replace(/\s/g, '').split(',');
			const newOrderSplit = [];
			const orderPartsToLowerCase = orderParts.map(function(o) { return o.toLowerCase(); });
			for(let i = 0; i < orderSplit.length; ++i) {
				if(orderPartsToLowerCase.includes(orderSplit[i].toLowerCase())) {
					newOrderSplit.push(orderSplit[i]);
				}
			}
			this.params.order = newOrderSplit.join(',');
		}
		else {
			this.params.order = 'description,message,email,explanation,screenshot,metadata,history,termsAccepted,personalDataAccepted,note';
		}
		
		if(typeof this.params.alertAfterRequest !== 'boolean') {
			this.params.alertAfterRequest = true;
		}
		
		this.params.emailField = this.params.emailField || false;
		this.params.expandMessageLink = this.params.expandMessageLink || false;
		
		if(this.params.emailField !== true) {
			this.params.emailField = false;
		}
		if(this.params.expandMessageLink !== true) {
			this.params.expandMessageLink = false;
		}
		
		if(typeof this.params.adBlockDetected === 'undefined') {
			let adBlockBait = document.createElement('div');
			adBlockBait.innerHTML = '&nbsp;';
			adBlockBait.className = 'adsbox';
			document.body.appendChild(adBlockBait);
			window.setTimeout(() => {
				if(adBlockBait.offsetHeight === 0) {
					this.params.adBlockDetected = true;
				}
				else {
					this.params.adBlockDetected = false;
				}
				document.body.removeChild(adBlockBait);
			}, 60);
		}
		
		this.params.termsUrl = this.params.termsUrl || '#';
		this.params.privacyPolicyUrl = this.params.privacyPolicyUrl || '#';
    	
    	this.loadMessages().then(() => {
            if(this.params.apiKey && this.params.projectSymbol && !this.params.onSubmitUrl) {
				this.params.onSubmitUrl = feedybackyPortalEndpoint;
			}
			
			this.initMinifiedContainer();
            this.initExtendedContainer();
            this.initAlertContainer();
			this.setTheme(this.theme);

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
			
			if([checkboxVisibleOption, checkboxAutoEnableOption].includes(this.params.historyField)) {
				this.initEventHistoryGathering();
			}
			
			const descriptionExpandLink = document.getElementById('feedybacky-form-description-expand');
			if(descriptionExpandLink) {
				descriptionExpandLink.addEventListener('click', e => {
					e.preventDefault();
					document.getElementById('feedybacky-container-extended').className += ' expanded';
					e.target.parentNode.removeChild(e.target);
				});
			}
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
	
	open() {
		this.showExtendedContainer();
	}
	
	close() {
		this.showMinimalContainer();
	}
	
	setTheme(themeSymbol) {
		if(!this.allowedThemes.includes(themeSymbol)) {
			return;
		}
		
		let oldClass = 'feedybacky-container-theme-' + this.theme;
		let newClass = 'feedybacky-container-theme-' + themeSymbol;
		
		this.theme = themeSymbol;		
		this.minifiedContainer.classList.remove(oldClass);
		this.extendedContainer.classList.remove(oldClass);
		this.minifiedContainer.classList.add(newClass);
		this.extendedContainer.classList.add(newClass);
	}
    
    initMinifiedContainer() {
    	this.minifiedContainer = document.createElement('div');
        this.minifiedContainer.id = 'feedybacky-container-minified';
		this.minifiedContainer.classList = 'feedybacky-container-' + this.params.side;
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
		this.extendedContainer.classList = 'feedybacky-container-' + this.params.side;
        this.extendedContainer.setAttribute('data-html2canvas-ignore', true);
        this.container.appendChild(this.extendedContainer);
		
		let descriptionHtml = `
			<div id="feedybacky-description" class="${this.params.classes.description}">
				${this.params.texts.description}
			</div>
		`;
		
		let messageHtml = `
			<textarea maxlength="1000" id="feedybacky-form-description" form="feedybacky-form" name="description" aria-required="true" class="${this.params.classes.message}"></textarea>
			<div id="feedybacky-form-description-error-message" class="feedybacky-error-message ${this.params.classes.message}"></div>
		`;
		
		if(this.params.expandMessageLink) {
			messageHtml += `<a href="#" id="feedybacky-form-description-expand" class="${this.params.classes.message}">${this.params.texts.expand}</a>`;
		}
		
		let emailInputHtml = '';
        if(this.params.emailField) {
        	emailInputHtml = `
        		<div id="feedybacky-container-email-description" class="${this.params.classes.email}">${this.params.texts.email}</div>
        		<input id="feedybacky-form-email" form="feedybacky-form" name="email" aria-required="true" class="${this.params.classes.email}"/>
        		<div id="feedybacky-form-email-error-message" class="feedybacky-error-message ${this.params.classes.email}" ></div>
        	`;
        }
		
		let screenshotCheckboxHtml = '';
        if(this.params.screenshotField == checkboxVisibleOption) {
        	screenshotCheckboxHtml = `<label><input type="checkbox" id="feedybacky-form-screenshot-allowed" checked="true" class="${this.params.classes.screenshot}"/>${this.params.texts.screenshot}</label>`;
        }
        
        let metadataCheckboxHtml = '';
        if(this.params.metadataField == checkboxVisibleOption) {
        	metadataCheckboxHtml = `<label><input type="checkbox" id="feedybacky-form-metadata-allowed" checked="true" class="${this.params.classes.metadata}"/>${this.params.texts.metadata}</label>`;
        }
		
		let historyCheckboxHtml = '';
		if(this.params.historyField == checkboxVisibleOption) {
			historyCheckboxHtml = `<label><input type="checkbox" id="feedybacky-form-history-allowed" checked="true" class="${this.params.classes.history}"/>${this.params.texts.history}</label>`;
		}
        
        let additionalDataInformationHtml = '';
        if(screenshotCheckboxHtml || metadataCheckboxHtml || historyCheckboxHtml) {
        	additionalDataInformationHtml = `<div id="feedybacky-container-additional-description" class="${this.params.classes.explanation}">${this.params.texts.additionalDataInformation}</div>`;
        }
		
		const loweredOnSubmitUrl = this.params.onSubmitUrl ? this.params.onSubmitUrl.toLowerCase() : '';
		const loweredFeedybackyPortalEndpoint = feedybackyPortalEndpoint.toLowerCase();
		let termsAgreementHtml = '';
		let personalDataAgreementHtml = '';
		if(loweredOnSubmitUrl.includes(loweredFeedybackyPortalEndpoint) && loweredFeedybackyPortalEndpoint.includes(loweredOnSubmitUrl)) {
			const termsCheckedPart = localStorage.getItem(termsAcceptedStorageItem) > 0 ? 'checked="true"' : '';
			const termsAcceptedText = this.params.texts.termsAccepted.replace('{termsUrl}', this.params.termsUrl);
			
			termsAgreementHtml = `
				<label><input type="checkbox" id="feedybacky-form-terms-accepted" ${termsCheckedPart} class="${this.params.classes.termsAccepted}"/>${termsAcceptedText}</label>
				<div id="feedybacky-form-terms-accepted-error-message" class="feedybacky-error-message ${this.params.classes.termsAccepted}" ></div>
			`;
			
			const personalDataCheckedPart = localStorage.getItem(personalDataAcceptedStorageItem) > 0 ? 'checked="true"' : '';
			const personalDataAcceptedText = this.params.texts.personalDataAccepted.replace('{privacyPolicyUrl}', this.params.privacyPolicyUrl);
			
			personalDataAgreementHtml = `
				<label><input type="checkbox" id="feedybacky-form-personal-data-accepted" ${personalDataCheckedPart} class="${this.params.classes.personalDataAccepted}"/>${personalDataAcceptedText}</label>
				<div id="feedybacky-form-personal-data-accepted-error-message" class="feedybacky-error-message ${this.params.classes.personalDataAccepted}" ></div>
			`;
		}
		
		let noteHtml = '';
		if(this.params.texts.note) {
			noteHtml = `<div id="feedybacky-container-note" class="${this.params.classes.note}">${this.params.texts.note}</div>`;
		}
		
		const extendedParts = {};
		extendedParts[orderDescriptionPart] = `${descriptionHtml}`;
		extendedParts[orderMessagePart] = `${messageHtml}`;
		extendedParts[orderExplanationPart] = `${additionalDataInformationHtml}`;
		extendedParts[orderEmailPart] = `${emailInputHtml}`;
		extendedParts[orderScreenshotCheckboxPart] = `${screenshotCheckboxHtml}`;
		extendedParts[orderMetadataCheckboxPart] = `${metadataCheckboxHtml}`;
		extendedParts[orderHistoryCheckboxPart] = `${historyCheckboxHtml}`;
		extendedParts[orderTermsAcceptedCheckboxPart] = `${termsAgreementHtml}`;
		extendedParts[orderPersonalDataAcceptedCheckboxPart] = `${personalDataAgreementHtml}`;
		extendedParts[orderNotePart] = `${noteHtml}`;
		
		let variablesInRequiredOrder = '';
		const orderSplit = this.params.order.split(',');
		for(let i = 0; i < orderSplit.length; ++i) {
			variablesInRequiredOrder += `${extendedParts[orderSplit[i]]}`;
		}

        const html = `
			<div id="feedybacky-container-title" class="${this.params.classes.title}">${this.params.texts.title}</div>
			<div id="feedybacky-container-hide-button" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</div>
			<form id="feedybacky-form">
				${variablesInRequiredOrder}
				<button id="feedybacky-form-submit-button" type="submit" class="${this.params.classes.send}">${this.params.texts.send}</button>
			</form>
			<div id="feedybacky-container-powered" class="${this.params.classes.powered}">
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
		let emailInput = document.getElementById('feedybacky-form-email');
		let termsAcceptedInput = document.getElementById('feedybacky-form-terms-accepted');
		let personalDataAcceptedInput = document.getElementById('feedybacky-form-personal-data-accepted');
		
    	let isValidated = true;
    	
    	if(!descriptionInput.value) {
    		document.getElementById('feedybacky-form-description-error-message').innerText = this.params.texts.descriptionErrorEmpty;
    		isValidated = false;
    	}
		
		if(emailInput && !emailInput.value) {
    		document.getElementById('feedybacky-form-email-error-message').innerText = this.params.texts.emailErrorEmpty;
    		isValidated = false;
    	}
		
		if(termsAcceptedInput && !termsAcceptedInput.checked) {
			document.getElementById('feedybacky-form-terms-accepted-error-message').innerText = this.params.texts.termsAcceptedErrorNotChecked;
			isValidated = false;
		}
		
		if(personalDataAcceptedInput && !personalDataAcceptedInput.checked) {
			document.getElementById('feedybacky-form-personal-data-accepted-error-message').innerText = this.params.texts.personalDataAcceptedErrorNotChecked;
			isValidated = false;
		}
    	
    	return isValidated;
    }
    
    prepareAndSendRequest() {
    	let descriptionInput = document.getElementById('feedybacky-form-description');
		let emailInput = document.getElementById('feedybacky-form-email');
    	
		let payload = new FeedybackyPayload();
		payload.message = descriptionInput.value;
		payload.timestamp = new Date();
		payload.url = window.location.href;
		payload.errors = this.consoleErrors;
		
		if(emailInput) {
        	payload.email = emailInput.value;
        }
		
		if(this.prefix) {
			payload.prefix = this.prefix;
		}
		
		if(this.params.apiKey) {
			payload.apiKey = this.params.apiKey;
		}
		
		if(this.params.projectSymbol) {
			payload.projectSymbol = this.params.projectSymbol;
		}
		
		let screenshotAllowedInput = document.getElementById('feedybacky-form-screenshot-allowed');
        let metadataAllowedInput = document.getElementById('feedybacky-form-metadata-allowed');
		let historyAllowedInput = document.getElementById('feedybacky-form-history-allowed');
		let termsAcceptedInput = document.getElementById('feedybacky-form-terms-accepted');
		let personalDataAcceptedInput = document.getElementById('feedybacky-form-personal-data-accepted');
        
        const screenshotAllowed = screenshotAllowedInput ? screenshotAllowedInput.checked : (this.params.screenshotField == checkboxAutoEnableOption);
        const metadataAllowed = metadataAllowedInput ? metadataAllowedInput.checked : (this.params.metadataField == checkboxAutoEnableOption);
		const historyAllowed = historyAllowedInput ? historyAllowedInput.checked : (this.params.historyField == checkboxAutoEnableOption);
		payload.termsAccepted = termsAcceptedInput ? termsAcceptedInput.checked : false;
		payload.personalDataAccepted = personalDataAcceptedInput ? personalDataAcceptedInput.checked : false;
		
		if(payload.termsAccepted) {
			localStorage.setItem(termsAcceptedStorageItem, 1);
		}
		if(payload.personalDataAccepted) {
			localStorage.setItem(personalDataAcceptedStorageItem, 1);
		}

        if(metadataAllowed) {
            payload.agent = navigator.userAgent;
            payload.cookies = document.cookie;
            payload.platform = navigator.platform;
			payload.adBlock = !!this.params.adBlockDetected;
            payload.screenSize = `${screen.width}x${screen.height}`;
            payload.availableScreenSize = `${screen.availWidth}x${screen.availHeight}`;
            payload.innerSize = `${window.innerWidth}x${window.innerHeight}`;
            payload.colorDepth = screen.colorDepth;
            
            if(screen.orientation) {
            	payload.orientation = screen.orientation.type;
        	}
			
			payload.cookieEnabled = navigator.cookieEnabled;
			payload.browserLanguage = navigator.language;
			payload.referrer = document.referrer;
			payload.pixelRatio = window.devicePixelRatio;
			payload.offsetX = window.pageXOffset;
			payload.offsetY = window.pageYOffset;
        }
		
		if(historyAllowed) {
			if(this.historyLimit) {
				this.eventHistory = this.eventHistory.slice(Math.max(this.eventHistory.length - this.historyLimit, 0));
			}
			
			payload.history = this.eventHistory;
		}
		
		if(this.params.urlTracking) {
			payload.visitedUrls = this.visitedUrls;
		}
		
		if(this.extraInfoFunction) {
			payload.extraInfo = this.extraInfoFunction();
		}
		
		this.showAlertContainer(alertTypePending);
		
		if(screenshotAllowed) {
			let currentScrollPos = window.pageYOffset;
			
            html2canvas(document.body, {
				onrendered: canvas => {
					window.scrollTo(0, currentScrollPos);
					payload.image = canvas.toDataURL('image/png');
					this.handleBeforeSubmitCallback(payload);
					this.sendPostRequest(this.params.onSubmitUrl, payload);
				}
            });
        }
        else {
			this.handleBeforeSubmitCallback(payload);
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
        }).then(response => {
			if(response.status == 200 || response.status == 201) {
				this.showAlertContainer(alertTypeSuccess);
				
				if(this.onSubmitUrlSuccess) {
					response.text().then(res => {
						this.onSubmitUrlSuccess(response.status, res);
					});
				}
            }
            else {
				this.showAlertContainer(alertTypeFailure);
				
				if(this.onSubmitUrlError) {
					response.text().then(res => {
						this.onSubmitUrlError(response.status, res);
					});
				}
            }
        }).catch(e => {
            this.showAlertContainer(alertTypeFailure, e);
        })
    }
	
	initEventHistoryGathering() {
		let eventsToListen = ['change', 'click', 'focus', 'reset', 'submit'];
		
		for(let i = 0; i < eventsToListen.length; ++i) {
			document.addEventListener(eventsToListen[i], (e) => {
				if(e.target.id && !(/^feedybacky/.test(e.target.id))) {				
					let historyEntry = {
						eventType: e.type,
						tagName: e.target.tagName.toLowerCase()
					};
					
					if(e.target.id) {
						historyEntry['id'] = e.target.id;
					}
					
					if(e.target.className) {
						historyEntry['className'] = e.target.className;
					}
					
					if(e.target.getAttribute('name')) {
						historyEntry['name'] = e.target.getAttribute('name');
					}
					
					if(e.target.value) {
						historyEntry['value'] = e.target.value;
					}
					
					this.eventHistory.push(historyEntry);
				}
			});
		}
	}
	
	initUrlTracking() {
		this.visitedUrls = localStorage.getItem(visitedUrlsStorageItem) || '[]';
		this.visitedUrls = JSON.parse(this.visitedUrls);
		this.saveVisitedUrl();
		
		((history) => {
			const pushState = history.pushState;
			history.pushState = (state, ...args) => {
				if(typeof history.onpushstate == "function") {
					history.onpushstate({state: state});
				}
				
				const result = pushState.call(history, state, ...args);
				this.saveVisitedUrl();
				return result;
			}
		})(window.history);
		
		window.addEventListener('popstate', (e) => {
			this.saveVisitedUrl();
		});
		
		window.addEventListener('hashchange', (e) => {
			this.saveVisitedUrl();
		});
	}
	
	saveVisitedUrl() {
		const url = window.location.href;
		this.visitedUrls.push({ timestamp: Date.now(), url });
		this.visitedUrls = this.visitedUrls.slice(Math.max(this.visitedUrls.length - this.urlTrackingLimit, 0));
		localStorage.setItem(visitedUrlsStorageItem, JSON.stringify(this.visitedUrls));
	}
	
	handleBeforeSubmitCallback(payload) {
		if(this.beforeSubmitFunction) {
			this.beforeSubmitFunction(payload);
		}
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

    showAlertContainer(alertType, status) {
		if(!this.params.alertAfterRequest) {
			return;
		}
		
    	this.alertContainer.classList = '';
    	
        if(alertType === alertTypeSuccess) {
            this.alertContainer.innerHTML = this.params.texts.requestSuccess;
            this.alertContainer.classList = 'feedybacky-alert-container-success feedybacky-alert-container-animated';
        } 
        else if(alertType === alertTypeFailure) {
            this.alertContainer.innerHTML = this.params.texts.requestFail;
            this.alertContainer.innerHTML += ' ' + (this.defaultVars.texts['error' + status] || 'error ' + status);
            this.alertContainer.classList = 'feedybacky-alert-container-failure feedybacky-alert-container-animated';
        }
		else if(alertType === alertTypePending) {
			this.alertContainer.innerHTML = this.params.texts.requestPending;
            this.alertContainer.classList = 'feedybacky-alert-container-pending';
		}
		
        this.alertContainer.style.display = 'inline-block';
        
		if(alertType !== alertTypePending) {
			setTimeout(() => {
				this.alertContainer.style.display = 'none';
			}, 3000);
		}
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
	module.exports.FeedybackyPayload = FeedybackyPayload;
	module.exports.Feedybacky = Feedybacky;
}