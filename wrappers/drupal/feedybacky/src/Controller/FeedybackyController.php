<?php
/**
 * @file
 * Contains \Drupal\feedybacky\Controller\FeedybackyController.
 */
namespace Drupal\feedybacky\Controller;

class FeedybackyController {
  
	public function content() {
		return [
			'#type' => 'markup',
			'#markup' => t(''),
		];
	}
}