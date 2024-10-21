<?php
function okns_settings_init()
{
    add_options_page(
        "OKNS Chat Settings",
        "OKNS Chat",
        "manage_options",
        "okns-settings",
        "okns_settings_page"
    );
    add_action("admin_init", "okns_register_settings");
}
add_action("admin_menu", "okns_settings_init");

function okns_register_settings()
{
    register_setting("okns_settings", "okns_api_token");
}

function okns_settings_page()
{
    ?>
    <div class="wrap">
        <h1>OKNS Chat Settings</h1>
        <form method="post" action="options.php">
            <?php settings_fields("okns_settings"); ?>
            <?php do_settings_sections("okns_settings"); ?>
            <table class="form-table">
                <tr valign="top">
                <th scope="row">API Token</th>
                <td><input type="text" name="okns_api_token" value="<?php echo esc_attr(
                    get_option("okns_api_token")
                ); ?>" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
