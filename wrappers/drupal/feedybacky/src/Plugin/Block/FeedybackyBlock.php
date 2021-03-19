<?php

namespace Drupal\feedybacky\Plugin\Block;

use Drupal\Core\Block\BlockBase;
/**
 * @Block(
 *   id = "feedybacky_block",
 *   admin_label = @Translation("Feedybacky Block"),
 *   category = @Translation("Feedybacky Block"),
 * )
 */

class FeedybackyBlock extends BlockBase {
	/**
	* {@inheritdoc}
	*/

	public function build() {
		$currentUser = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());

		$currentUserEmail = $currentUser->get('mail')->value;
		$currentUserName = $currentUser->get('name')->value;
		$currentUserUid = $currentUser->get('uid')->value;

		$config = \Drupal::config('feedybacky.settings'); 
		$url = $config->get('feedybacky.url');
		$apiKey = $config->get('feedybacky.apiKey');
		$projectSymbol = $config->get('feedybacky.projectSymbol');
		$language = \Drupal::languageManager()->getCurrentLanguage()->getId();

		return [
			'#markup' => $this->t(
				'<div id="feedybacky-container"></div>
				<script type="text/javascript" src="'.$GLOBALS['base_path'].'modules/feedybacky/feedybacky/js/feedybacky.min.js"></script>
				<script>
					var userName = \''.$currentUserName.'\';
					var userMail = \''.$currentUserEmail.'\';
					var userID = \''.$currentUserUid.'\';
					var language = \''.$language.'\';

					var feedybacky = new Feedybacky(\'feedybacky-container\', {
						onSubmitUrl: \''.$url.'\',
						language: \''.$language.'\',
						beforeSubmit: (payload) => {
							payload.add(\'projectSymbol\', \''.$projectSymbol.'\');
							payload.add(\'apiKey\', \''.$apiKey.'\');
						},
						extraInfo: () => {
							return {
								userMail,
								userName,
								userID,
								language
							};
						}
					});
				</script>'
			),
		];
	}

}