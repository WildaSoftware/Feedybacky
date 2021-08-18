<?php

namespace Drupal\feedybacky\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

class FeedybackyForm extends ConfigFormBase {

	/**
	* {@inheritdoc}
	*/
	public function getFormId() {
		return 'feedybacky_form';
	}

	/**
	* {@inheritdoc}
	*/
	public function buildForm(array $form, FormStateInterface $form_state) {
		$form = parent::buildForm($form, $form_state);
		
		$config = \Drupal::configFactory()->getEditable('feedybacky.settings');
		//$config = $this->config('feedybacky.settings');
		$form['url'] = [
			'#type' => 'textfield',
			'#title' => $this->t('URL to the address where feedback data is supposed to be sent to:'),
			'#default_value' => $config->get('feedybacky.url'),
		];
		$form['apiKey'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Feedybacky API key:'),
			'#default_value' => $config->get('feedybacky.apiKey'),
		];
		$form['projectSymbol'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Feedybacky project symbol:'),
			'#default_value' => $config->get('feedybacky.projectSymbol'),
		];
		//add Settings to extraInfo later!
		$form['emailField'] = [
			'#type' => 'select',
			'#title' => $this->t('Visible e-mail address field?'),
			'#default_value' => $config->get('feedybacky.emailField'),
			'#options' => [
				'true' => $this
				  ->t('Yes'),
				'false' => $this
				  ->t('No'),
			  ],
		];
		$form['screenshotField'] = [
			'#type' => 'select',
			'#title' => $this->t('Screenshot choice visibility:'),
			'#default_value' => $config->get('feedybacky.screenshotField'),
			'#options' => [
				'visible' => $this
				  ->t('Visible'),
				'autoEnable' => $this
				  ->t('Auto enable'),
				'autoDisable' => $this
				  ->t('Auto disable'),
			  ],
			  			
		];
		$form['metadataField'] = [
			'#type' => 'select',
			'#title' => $this->t('Metadata choice visibility:'),
			'#default_value' => $config->get('feedybacky.metadataField'),
			'#options' => [
				'visible' => $this
				  ->t('Visible'),
				'autoEnable' => $this
				  ->t('Auto enable'),
				'autoDisable' => $this
				  ->t('Auto disable'),
			  ],
		];
		$form['historyField'] = [
			'#type' => 'select',
			'#title' => $this->t('History field choice visibility:'),
			'#default_value' => $config->get('feedybacky.historyField'),
			'#options' => [
				'visible' => $this
				  ->t('Visible'),
				'autoEnable' => $this
				  ->t('Auto enable'),
				'autoDisable' => $this
				  ->t('Auto disable'),
			  ],
		];
		$form['historyLimit'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Number of last event calls on the page which would be added to event history.:'),
			'#default_value' => $config->get('feedybacky.historyLimit'),
		];
		$form['prefix'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Optional prefix for each request:'),
			'#default_value' => $config->get('feedybacky.historyLimit'),
		];
		$form['alertAfterRequest'] = [
			'#type' => 'select',
			'#title' => $this->t('Alert after request?'),
			'#default_value' => $config->get('feedybacky.alertAfterRequest'),
			'#options' => [
				'true' => $this
				  ->t('Yes'),
				'false' => $this
				  ->t('No'),
			  ],
		];
		$form['side'] = [
			'#type' => 'select',
			'#title' => $this->t('Side of the screen to display Feedybacky widget on:'),
			'#default_value' => $config->get('feedybacky.side'),
			'#options' => [
				'left' => $this
				  ->t('Left'),
				'right' => $this
				  ->t('Right'),
			  ],
		];
		$form['order'] = [
			'#type' => 'textfield',
			'#title' => $this->t('Classes:'),
			'#default_value' => $config->get('feedybacky.order'),
		];
		$form['expandMessageLink'] = [
			'#type' => 'select',
			'#title' => $this->t('Expand message link?'),
			'#default_value' => $config->get('feedybacky.expandMessageLink'),
			'#options' => [
				'true' => $this
				  ->t('Yes'),
				'' => $this
				  ->t('No'),
			  ],
		];
		return $form;
	}
	/**
	* {@inheritdoc}
	*/
	public function validateForm(array &$form, FormStateInterface $form_state) {

	}

	/**
	* {@inheritdoc}
	*/
	public function submitForm(array &$form, FormStateInterface $form_state) {
		$config = \Drupal::configFactory()->getEditable('feedybacky.settings')
		->set('feedybacky.url', $form_state->getValue('url'))
		->set('feedybacky.apiKey', $form_state->getValue('apiKey'))
		->set('feedybacky.projectSymbol', $form_state->getValue('projectSymbol'))
		->set('feedybacky.emailField', $form_state->getValue('emailField'))
		->set('feedybacky.screenshotField', $form_state->getValue('screenshotField'))
		->set('feedybacky.metadataField', $form_state->getValue('metadataField'))
		->set('feedybacky.historyLimit', $form_state->getValue('historyLimit'))
		->set('feedybacky.prefix', $form_state->getValue('prefix'))
		->set('feedybacky.alertAfterRequest', $form_state->getValue('alertAfterRequest'))
		->set('feedybacky.side', $form_state->getValue('side'))
		->set('feedybacky.order', $form_state->getValue('order'))
		->set('feedybacky.expandMessageLink', $form_state->getValue('expandMessageLink'))
		->save();
		drupal_flush_all_caches();
		return parent::submitForm($form, $form_state);
	}

	/**
	* {@inheritdoc}
	*/
	protected function getEditableConfigNames() {
		return [
			'feedybacky.settings',
		];
	}

}
