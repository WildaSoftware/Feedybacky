<?php
/**
 * Plugin Name: Feedybacky
 * Plugin URI: https://github.com/WildaSoftware/Feedybacky
 * Description: Feedybacky's plugin wrapper for Wordpress. The plugin can be used to facilitate feedback gathering from a web site. This version based on version 1.5 of the original plugin.
 * Version: 1.0
 * Author: Wilda Software
 * Author URI: http://wildasoftware.pl/
 **/

const FYBY_OPTION__LANGUAGE = 'fyby_option__language';
const FYBY_OPTION__ONSUBMIT = 'fyby_option__onsubmit';
const FYBY_OPTION__ONSUBMITURL = 'fyby_option__onsubmiturl';
const FYBY_OPTION__EXTRAINFO = 'fyby_option__extrainfo';
const FYBY_OPTION__EMAILFIELD = 'fyby_option__emailfield';
const FYBY_OPTION__SCREENSHOTFIELD = 'fyby_option__screenshotfield';
const FYBY_OPTION__METADATAFIELD = 'fyby_option__metadatafield';
const FYBY_OPTION__HISTORYFIELD = 'fyby_option__historyfield';
const FYBY_OPTION__HISTORYLIMIT = 'fyby_option__historylimit';
const FYBY_OPTION__BEFORESUBMIT = 'fyby_option__beforesubmit';
const FYBY_OPTION__ONSUBMITURLSUCCESS = 'fyby_option__onsubmiturlsuccess';
const FYBY_OPTION__ONSUBMITURLERROR = 'fyby_option__onsubmiturlerror';
const FYBY_OPTION__PREFIX = 'fyby_option__prefix';
const FYBY_OPTION__ALERTAFTERREQUEST = 'fyby_option__alertafterrequest';
const FYBY_OPTION__ADBLOCKDETECTED = 'fyby_option__adblockdetected';
const FYBY_OPTION__SIDE = 'fyby_option__side';
const FYBY_OPTION__ORDER = 'fyby_option__order';
const FYBY_OPTION__EXPANDMESSAGELINK = 'fyby_option__expandmessagelink';
const FYBY_OPTION__TEXTS = 'fyby_option__texts';
const FYBY_OPTION__CLASSES = 'fyby_option__classes';
const FYBY_OPTION__APIKEY = 'fyby_option__apikey';
const FYBY_OPTION__PROJECTSYMBOL = 'fyby_option__projectsymbol';
const FYBY_OPTION__TERMSURL = 'fyby_option__termsurl';
const FYBY_OPTION__PRIVACYPOLICYURL = 'fyby_option__privacypolicyurl';

function fyby__setup_menu() {
	add_options_page('Feedybacky', 'Feedybacky', 'manage_options', 'feedybacky-config', 'fyby__handle_menu_view' );
}

function fyby__generate_input($name, $param, $type, $label, $options = []) {
	$field = '<tr><th scope="row"><label for="FeedybackyConfig['.$name.']">'.$label.'</label></th><td>';
	
	if($type == 'text') {
		$field .= '
			<input type="text" id="feedybacky-config-'.strtolower($name).'" name="FeedybackyConfig['.$name.']" value="'.get_option($param).'" class="regular-text">
		';
	}
	elseif($type == 'textarea') {
		$field .= '
			<textarea id="feedybacky-config-'.strtolower($name).'" form="feedybacky-config" name="FeedybackyConfig['.$name.']" class="regular-text">'.get_option($param).'</textarea>
		';
	}
	elseif($type == 'checkbox') {
		$field .= '
			<input type="checkbox" id="feedybacky-config-'.strtolower($name).'" name="FeedybackyConfig['.$name.']" '.(!empty(get_option($param)) ? 'checked' : '').'>
		';
	}
	elseif($type == 'select') {
		$paramValue = get_option($param);
		
		$text = '
			<select id="feedybacky-config-'.strtolower($name).'" name="FeedybackyConfig['.$name.']">
		';
		
		foreach($options as $optionValue => $optionLabel) {
			$text .= '<option value="'.$optionValue.'" '.($paramValue == $optionValue ? 'selected' : '').'>'.$optionLabel.'</option>';
		}
		
		$text .= '</select>';
		
		$field .= $text;
	}
	elseif($type == 'number') {
		$field .= '
			<input type="number" id="feedybacky-config-'.strtolower($name).'" name="FeedybackyConfig['.$name.']" value="'.get_option($param).'" min="0">
		';
	}
	
	$field .= '</td></tr>';
	
	echo $field;
}
 
function fyby__handle_menu_view(){
	if(!empty($_POST['FeedybackyConfig'])) {
		$data = $_POST['FeedybackyConfig'];		
		update_option(FYBY_OPTION__LANGUAGE, $data['language']);
		update_option(FYBY_OPTION__ONSUBMIT, str_replace('\\', '', $data['onSubmit']));
		update_option(FYBY_OPTION__ONSUBMITURL, $data['onSubmitUrl']);
		update_option(FYBY_OPTION__APIKEY, $data['apiKey']);
		update_option(FYBY_OPTION__PROJECTSYMBOL, $data['projectSymbol']);
		update_option(FYBY_OPTION__TERMSURL, $data['termsUrl']);
		update_option(FYBY_OPTION__PRIVACYPOLICYURL, $data['privacyPolicyUrl']);
		update_option(FYBY_OPTION__EXTRAINFO, str_replace('\\', '', $data['extraInfo']));
		update_option(FYBY_OPTION__EMAILFIELD, !empty($data['emailField']));
		update_option(FYBY_OPTION__SCREENSHOTFIELD, $data['screenshotField']);
		update_option(FYBY_OPTION__METADATAFIELD, $data['metadataField']);
		update_option(FYBY_OPTION__HISTORYFIELD, $data['historyField']);
		update_option(FYBY_OPTION__HISTORYLIMIT, $data['historyLimit']);
		update_option(FYBY_OPTION__BEFORESUBMIT, str_replace('\\', '', $data['beforeSubmit']));
		update_option(FYBY_OPTION__ONSUBMITURLSUCCESS, str_replace('\\', '', $data['onSubmitUrlSuccess']));
		update_option(FYBY_OPTION__ONSUBMITURLERROR, str_replace('\\', '', $data['onSubmitUrlError']));
		update_option(FYBY_OPTION__PREFIX, $data['prefix']);
		update_option(FYBY_OPTION__ALERTAFTERREQUEST, !empty($data['alertAfterRequest']));
		update_option(FYBY_OPTION__ADBLOCKDETECTED, $data['adBlockDetected']);
		update_option(FYBY_OPTION__SIDE, $data['side']);
		update_option(FYBY_OPTION__ORDER, $data['order']);
		update_option(FYBY_OPTION__EXPANDMESSAGELINK, !empty($data['expandMessageLink']));
		update_option(FYBY_OPTION__TEXTS, str_replace('\\', '', $data['texts']));
		update_option(FYBY_OPTION__CLASSES, str_replace('\\', '', $data['classes']));
	}
	
	echo '<div id="feedybacky-config-page">';
	 
	echo '<img id="feedybacky-admin-logo" src="'.WP_PLUGIN_URL.'/feedybacky/feedybacky/img/icon.png'.'" style="width: 100px"/><div id="feedybacky-admin-header" style="font-weight: bold; font-size: 1.2rem">Plugin config</div>';
	echo '<form id="feedybacky-config" method="post">';
	
	echo '<table class="form-table" role="presentation">';
	echo '<tbody>';
	
	echo fyby__generate_input('language', FYBY_OPTION__LANGUAGE, 'text', 'Language');
	echo fyby__generate_input('onSubmit', FYBY_OPTION__ONSUBMIT, 'textarea', 'On Submit');
	echo fyby__generate_input('onSubmitUrl', FYBY_OPTION__ONSUBMITURL, 'text', 'On Submit URL');
	echo fyby__generate_input('apiKey', FYBY_OPTION__APIKEY, 'text', 'API key');
	echo fyby__generate_input('projectSymbol', FYBY_OPTION__PROJECTSYMBOL, 'text', 'Project symbol');
	echo fyby__generate_input('termsUrl', FYBY_OPTION__TERMSURL, 'text', 'URL to terms and conditions');
	echo fyby__generate_input('privacyPolicyUrl', FYBY_OPTION__PRIVACYPOLICYURL, 'text', 'URL to privacy policy');
	echo fyby__generate_input('extraInfo', FYBY_OPTION__EXTRAINFO, 'textarea', 'Extra Info');
	echo fyby__generate_input('emailField', FYBY_OPTION__EMAILFIELD, 'checkbox', 'Email Field');
	echo fyby__generate_input('screenshotField', FYBY_OPTION__SCREENSHOTFIELD, 'select', 'Screenshot Field', ['visible' => 'Visible', 'autoEnable' => 'Auto Enable','autoDisable' => 'Auto Disable']);
	echo fyby__generate_input('metadataField', FYBY_OPTION__METADATAFIELD, 'select', 'Metadata Field', ['visible' => 'Visible', 'autoEnable' => 'Auto Enable', 'autoDisable' => 'Auto Disable']);
	echo fyby__generate_input('historyField', FYBY_OPTION__HISTORYFIELD, 'select', 'History Field', ['visible' => 'Visible', 'autoEnable' => 'Auto Enable', 'autoDisable' => 'Auto Disable']);
	echo fyby__generate_input('historyLimit', FYBY_OPTION__HISTORYLIMIT, 'number', 'History Limit');
	echo fyby__generate_input('beforeSubmit', FYBY_OPTION__BEFORESUBMIT, 'textarea', 'Before Submit');
	echo fyby__generate_input('onSubmitUrlSuccess', FYBY_OPTION__ONSUBMITURLSUCCESS, 'textarea', 'On Submit Url Success');
	echo fyby__generate_input('onSubmitUrlError', FYBY_OPTION__ONSUBMITURLERROR, 'textarea', 'On Submit Url Error');
	echo fyby__generate_input('prefix', FYBY_OPTION__PREFIX, 'text', 'Prefix');
	echo fyby__generate_input('alertAfterRequest', FYBY_OPTION__ALERTAFTERREQUEST, 'checkbox', 'Alert After Request');
	echo fyby__generate_input('adBlockDetected', FYBY_OPTION__ADBLOCKDETECTED, 'text', 'AdBlock Detected');
	echo fyby__generate_input('side', FYBY_OPTION__SIDE, 'text', 'Side');
	echo fyby__generate_input('order', FYBY_OPTION__ORDER, 'text', 'Order');
	echo fyby__generate_input('expandMessageLink', FYBY_OPTION__EXPANDMESSAGELINK, 'checkbox', 'Expand Message Link');
	echo fyby__generate_input('texts', FYBY_OPTION__TEXTS, 'textarea', 'Texts');
	echo fyby__generate_input('classes', FYBY_OPTION__CLASSES, 'textarea', 'Classes');
	
	echo '</tbody>';
	echo '</table>';
	
	echo submit_button("Save");
	echo '</form>';
	
	echo '</div>';
}

function fyby__init_plugin() {
	if(empty(get_option(FYBY_OPTION__LANGUAGE))) {
		update_option(FYBY_OPTION__LANGUAGE, 'en');
	}

	if(empty(get_option(FYBY_OPTION__SCREENSHOTFIELD))) {
		update_option(FYBY_OPTION__SCREENSHOTFIELD, 'visible');
	}

	if(empty(get_option(FYBY_OPTION__METADATAFIELD))) {
		update_option(FYBY_OPTION__METADATAFIELD, 'visible');
	}

	if(empty(get_option(FYBY_OPTION__HISTORYFIELD))) {
		update_option(FYBY_OPTION__HISTORYFIELD, 'visible');
	}

	if(empty(get_option(FYBY_OPTION__ALERTAFTERREQUEST))) {
		update_option(FYBY_OPTION__ALERTAFTERREQUEST, 1);
	}

	if(empty(get_option(FYBY_OPTION__SIDE))) {
		update_option(FYBY_OPTION__SIDE, 'right');
	}

	if(empty(get_option(FYBY_OPTION__ORDER))) {
		update_option(FYBY_OPTION__order, 'description,message,email,explanation,screenshot,metadata,history,termsAccepted,personalDataAccepted,note');
	}
	 
	echo '<div id="feedybacky-container"></div>';
	echo '<script type="text/javascript" src="'.WP_PLUGIN_URL.'/feedybacky/feedybacky/js/feedybacky.min.js"></script>';
		
	$params = [];
	if(!empty(get_option(FYBY_OPTION__LANGUAGE))) {
		$params[] = 'language: "'.get_option(FYBY_OPTION__LANGUAGE).'"';
	}

	if(!empty(get_option(FYBY_OPTION__ONSUBMIT))) {
		$params[] = 'onSubmit: () => { '.get_option(FYBY_OPTION__ONSUBMIT).' }';
	}

	if(!empty(get_option(FYBY_OPTION__ONSUBMITURL))) {
		$params[] = 'onSubmitUrl: "'.get_option(FYBY_OPTION__ONSUBMITURL).'"';
	}
	
	if(!empty(get_option(FYBY_OPTION__APIKEY))) {
		$params[] = 'apiKey: "'.get_option(FYBY_OPTION__APIKEY).'"';
	}
	
	if(!empty(get_option(FYBY_OPTION__PROJECTSYMBOL))) {
		$params[] = 'projectSymbol: "'.get_option(FYBY_OPTION__PROJECTSYMBOL).'"';
	}
	
	if(!empty(get_option(FYBY_OPTION__TERMSURL))) {
		$params[] = 'termsUrl: "'.get_option(FYBY_OPTION__TERMSURL).'"';
	}
	
	if(!empty(get_option(FYBY_OPTION__PRIVACYPOLICYURL))) {
		$params[] = 'privacyPolicyUrl: "'.get_option(FYBY_OPTION__PRIVACYPOLICYURL).'"';
	}

	if(!empty(get_option(FYBY_OPTION__EXTRAINFO))) {
		$params[] = 'extraInfo: () => { return { '.get_option(FYBY_OPTION__EXTRAINFO).' }; }';
	}

	if(!empty(get_option(FYBY_OPTION__EMAILFIELD))) {
		$params[] = 'emailField: true';
	}

	if(!empty(get_option(FYBY_OPTION__SCREENSHOTFIELD))) {
		$params[] = 'screenshotField: "'.get_option(FYBY_OPTION__SCREENSHOTFIELD).'"';
	}

	if(!empty(get_option(FYBY_OPTION__METADATAFIELD))) {
		$params[] = 'metadataField: "'.get_option(FYBY_OPTION__METADATAFIELD).'"';
	}

	if(!empty(get_option(FYBY_OPTION__HISTORYFIELD))) {
		$params[] = 'historyField: "'.get_option(FYBY_OPTION__HISTORYFIELD).'"';
	}

	if(!empty(get_option(FYBY_OPTION__HISTORYLIMIT))) {
		$params[] = 'historyLimit: "'.get_option(FYBY_OPTION__HISTORYLIMIT).'"';
	}

	if(!empty(get_option(FYBY_OPTION__BEFORESUBMIT))) {
		$params[] = 'beforeSubmit: (payload) => { '.get_option(FYBY_OPTION__BEFORESUBMIT).' }';
	}

	if(!empty(get_option(FYBY_OPTION__ONSUBMITURLSUCCESS))) {
		$params[] = 'onSubmitUrlSuccess: (statusCode, response) => { '.get_option(FYBY_OPTION__ONSUBMITURLSUCCESS).' }';
	}

	if(!empty(get_option(FYBY_OPTION__ONSUBMITURLERROR))) {
		$params[] = 'onSubmitUrlError: (statusCode, response) => { '.get_option(FYBY_OPTION__ONSUBMITURLERROR).' }';
	}

	if(!empty(get_option(FYBY_OPTION__PREFIX))) {
		$params[] = 'prefix: "'.get_option(FYBY_OPTION__PREFIX).'"';
	}

	if(!empty(get_option(FYBY_OPTION__ALERTAFTERREQUEST))) {
		$params[] = 'alertAfterRequest: true';
	}

	if(!empty(get_option(FYBY_OPTION__ADBLOCKDETECTED))) {
		$params[] = 'adBlockDetected: "'.get_option(FYBY_OPTION__ADBLOCKDETECTED).'"';
	}

	if(!empty(get_option(FYBY_OPTION__SIDE))) {
		$params[] = 'side: "'.get_option(FYBY_OPTION__SIDE).'"';
	}

	if(!empty(get_option(FYBY_OPTION__ORDER))) {
		$params[] = 'order: "'.get_option(FYBY_OPTION__ORDER).'"';
	}

	if(!empty(get_option(FYBY_OPTION__EXPANDMESSAGELINK))) {
		$params[] = 'expandMessageLink: true';
	}

	if(!empty(get_option(FYBY_OPTION__TEXTS))) {
		$params[] = 'texts: { '.get_option(FYBY_OPTION__TEXTS).' }';
	}

	if(!empty(get_option(FYBY_OPTION__CLASSES))) {
		$params[] = 'classes: { '.get_option(FYBY_OPTION__CLASSES).' }';
	}
	
	$paramsString = implode(",\n", $params);
	
	echo '<script>
			var feedybacky = new Feedybacky("feedybacky-container", {
				'.$paramsString.'
			});
		</script>';
}

function fyby__add_assets() {
    wp_register_style('fyby__styles', WP_PLUGIN_URL.'/feedybacky/assets/styles.css');
    wp_enqueue_style('fyby__styles');
}

add_action('admin_menu', 'fyby__setup_menu');
add_action('wp_footer', 'fyby__init_plugin');
add_action('admin_menu', 'fyby__add_assets');
