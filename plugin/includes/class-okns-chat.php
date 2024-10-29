<?php
class OKNS_Chat
{
    private $api;
    private $graph_config_id;

    public function __construct()
    {
        $this->api = new OKNS_API();
        $this->graph_config_id = get_option("okns_graph_config_id", "");

        add_action("wp_ajax_okns_start_chat", [$this, "start_chat"]);
        add_action("wp_ajax_nopriv_okns_start_chat", [$this, "start_chat"]);

        add_action("wp_ajax_okns_send_message", [$this, "send_message"]);
        add_action("wp_ajax_nopriv_okns_send_message", [$this, "send_message"]);

        add_shortcode("okns_chat", [$this, "render_chat_widget"]);
    }

    public function start_chat()
    {
        $graph_id = sanitize_text_field($_POST["graph_id"]);
        if (empty($graph_id)) {
            wp_send_json_error([
                "error" => "Graph ID is missing",
                "status" => 400,
            ]);
            return;
        }

        $response = $this->api->start_graph($graph_id);
        if (isset($response["error"])) {
            wp_send_json_error($response);
        } else {
            $this->graph_config_id = $response["graph_config_id"];
            update_option("okns_graph_config_id", $this->graph_config_id);
            wp_send_json_success($response);
        }
    }

    public function send_message()
    {
        $interaction = sanitize_text_field($_POST["message"]);
        $this->graph_config_id = sanitize_text_field($_POST["graph_config_id"]);
        $response = $this->api->interact($this->graph_config_id, $interaction);
        if (isset($response["error"])) {
            wp_send_json_error($response);
        } else {
            wp_send_json_success($response);
        }
    }

    public function render_chat_widget($atts)
    {
        $atts = shortcode_atts(
            [
                "graph_id" => "",
                "position" => "dynamic-bottom", // default to dynamic-bottom, can be 'static-middle'
            ],
            $atts
        );

        // Generate a unique ID for this instance
        $widget_id = "okns-chat-" . uniqid();
        $atts["widget_id"] = $widget_id;

        ob_start();
        include plugin_dir_path(__FILE__) . "../templates/chat-template.php";
        return ob_get_clean();
    }
}
