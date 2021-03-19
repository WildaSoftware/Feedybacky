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
		// Form constructor.
		$form = parent::buildForm($form, $form_state);
		// Default settings.
		$config = $this->config('feedybacky.settings');
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
		$config = $this->config('feedybacky.settings');
		$config->set('feedybacky.url', $form_state->getValue('url'));
		$config->set('feedybacky.apiKey', $form_state->getValue('apiKey'));
		$config->set('feedybacky.projectSymbol', $form_state->getValue('projectSymbol'));
		$config->save();
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