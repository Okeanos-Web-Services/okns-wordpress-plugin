<?php
class OKNS_API
{
    private $base_url = "https://api.okns.de";
    private $api_token;

    public function __construct()
    {
        $this->api_token = get_option("okns_api_token");
    }

    public function start_graph($graph_id)
    {
        $url = $this->base_url . "/graph/{$graph_id}";
        return $this->make_request($url);
    }

    public function interact($config_id, $interaction)
    {
        $url = add_query_arg(
            ["interaction" => urlencode($interaction)],
            $this->base_url . "/graph_config/{$config_id}/interact"
        );
        return $this->make_request($url);
    }

    private function make_request($url)
    {
        $args = [
            "headers" => [
                "X-API-Key" => $this->api_token,
            ],
            "timeout" => 60, // Increased timeout for long-running requests
        ];

        $response = wp_remote_post($url, $args);

        if (is_wp_error($response)) {
            return ["error" => $response->get_error_message(), "status" => 500];
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if ($status_code !== 200) {
            return ["error" => "HTTP Error", "status" => $status_code];
        }

        if (json_last_error() !== JSON_ERROR_NONE) {
            return [
                "error" => "Invalid JSON response from API",
                "status" => 500,
            ];
        }

        return $data;
    }
}
