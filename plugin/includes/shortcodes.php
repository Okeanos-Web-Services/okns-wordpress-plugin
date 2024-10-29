<?php
function okns_chat_shortcode($atts)
{
    $atts = shortcode_atts(
        [
            "graph_id" => "",
            "dynamic_bottom" => "true", // Add this line
        ],
        $atts
    );

    ob_start();
    include plugin_dir_path(__FILE__) . "../templates/chat-template.php";
    return ob_get_clean();
}
add_shortcode("okns_chat", "okns_chat_shortcode");
