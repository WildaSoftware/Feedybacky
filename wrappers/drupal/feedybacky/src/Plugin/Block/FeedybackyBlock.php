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

		$language = \Drupal::languageManager()->getCurrentLanguage()->getId();
		$config = \Drupal::config('feedybacky.settings');
		$url = $config->get('feedybacky.url');
		$apiKey = $config->get('feedybacky.apiKey');
		$projectSymbol = $config->get('feedybacky.projectSymbol');
		$emailField = $config->get('feedybacky.emailField');
		$screenshotField = $config->get('feedybacky.screenshotField');
		$metadataField = $config->get('feedybacky.metadataField');
		$historyField = $config->get('feedybacky.historyField');
		$historyLimit = $config->get('feedybacky.historyLimit');
		$prefix = $config->get('feedybacky.prefix');
		$alertAfterRequest = $config->get('feedybacky.alertAfterRequest');
		$side = $config->get('feedybacky.side');
		$order = $config->get('feedybacky.order');
		$expandMessageLink = $config->get('feedybacky.expandMessageLink');

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
						},
						emailField: '.$emailField.',
						screenshotField: \''.$screenshotField.'\',
						metadataField: \''.$metadataField.'\',
						historyField: \''.$historyField.'\',
						historyLimit: \''.$historyLimit.'\',
						prefix: \''.$prefix.'\',
						alertAfterRequest: \''.$alertAfterRequest.'\',
						side: \''.$side.'\',
						order: \''.$order.'\',
						expandMesssageLink: \''.$expandMessageLink.'\',
					});
				</script>'
			),
		];
	}

}
