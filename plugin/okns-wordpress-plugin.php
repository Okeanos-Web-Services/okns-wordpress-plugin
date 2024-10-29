<?php
/**
 * Plugin Name: okns Wordpress Plugin
 * Plugin URI: https://okns.de
 * Description: A chat plugin with API integration
 * Version: 0.1
 * Author: Michael Hermelschmidt
 * Author URI: https://www.okns.com/
 **/

if (!defined("ABSPATH")) {
    exit();
}

function okns_enqueue_scripts()
{
    wp_enqueue_style(
        "okns-chat-style",
        plugin_dir_url(__FILE__) . "assets/css/okns-chat.css"
    );
    wp_enqueue_script(
        "okns-chat-script",
        plugin_dir_url(__FILE__) . "assets/js/okns-chat.js",
        ["jquery"],
        "0.1",
        true
    );
    wp_register_script(
        "zero-md",
        "https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js",
        [],
        "2.0",
        true
    );
    wp_script_add_data("zero-md", "type", "module");

    wp_localize_script("okns-chat-script", "okns_ajax", [
        "ajax_url" => admin_url("admin-ajax.php"),
    ]);
}
add_action("wp_enqueue_scripts", "okns_enqueue_scripts");

require_once plugin_dir_path(__FILE__) . "includes/class-okns-api.php";
require_once plugin_dir_path(__FILE__) . "includes/class-okns-chat.php";

$okns_chat = new OKNS_Chat();
