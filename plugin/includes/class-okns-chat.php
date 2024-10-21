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
    }

    public function start_chat()
    {
        $graph_id = $_POST["graph_id"];
        $response = $this->api->start_graph($graph_id);
        $this->graph_config_id = $response["graph_config_id"];
        update_option("okns_graph_config_id", $this->graph_config_id);
        wp_send_json_success($response);
    }

    public function send_message()
    {
        $interaction = sanitize_text_field($_POST["message"]);
        $this->graph_config_id = $_POST["graph_config_id"];
        $response = $this->api->interact($this->graph_config_id, $interaction);
        wp_send_json_success($response);
    }
}
