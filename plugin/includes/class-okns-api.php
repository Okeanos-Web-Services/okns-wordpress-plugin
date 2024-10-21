<?php
class OKNS_API
{
    private $base_url = "https://api.okns.de";
    private $api_token;

    public function __construct()
    {
        $this->api_token = get_option("okns_api_token"); // Store the API token in WordPress options
    }

    public function start_graph($graph_id)
    {
        $response = wp_remote_post($this->base_url . "/graph/{$graph_id}", [
            "headers" => [
                "Authorization" => "Bearer " . $this->api_token,
            ],
        ]);
        return $this->handle_response($response);
    }

    public function interact($config_id, $interaction)
    {
        $response = wp_remote_post(
            $this->base_url . "/graph_config/{$config_id}/interact",
            [
                "headers" => [
                    "Authorization" => "Bearer " . $this->api_token,
                ],
                "body" => ["interaction" => $interaction],
            ]
        );
        return $this->handle_response($response);
    }

    private function handle_response($response)
    {
        if (is_wp_error($response)) {
            return ["error" => $response->get_error_message()];
        }
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return ["error" => "Invalid JSON response from API"];
        }
        return $data;
    }
}
