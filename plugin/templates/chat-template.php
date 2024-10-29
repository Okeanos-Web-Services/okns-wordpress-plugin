<div class="okns-chat-widget <?php echo esc_attr($atts["position"]); ?>"
     id="<?php echo esc_attr($atts["widget_id"]); ?>"
     data-graph-id="<?php echo esc_attr($atts["graph_id"]); ?>"
     data-position="<?php echo esc_attr($atts["position"]); ?>">
    <script type="module">
        import 'https://cdn.jsdelivr.net/gh/zerodevx/zero-md@2/dist/zero-md.min.js';
    </script>
    <div class="chat-header">
        <h3>Chatte mit unserem Assistenten</h3>
        <div>

        </div>
        <button class="minimize-chat">_</button>
    </div>
    <div class="shape-container">
        <div class="shape"></div>
    </div>
    <div class="chat-body">
        <div class="chatbot__overview">
            <ul class="chatlist">
                <!-- Chat messages will be inserted here -->
            </ul>
        </div>
        <div class="chatbox-area">
            <form action="" id="chatform">
                <textarea placeholder="Talk to me!" class="chatbox" name="chatbox" resize="none" minlength="2"></textarea>
                <button type="submit" class="submit-button hexagon-button">
                    <span>Send</span>
                </button>
            </form>
        </div>
        <div class="loading-animation" style="display: none;">
            <div class="logo-loader">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="150" height="150">
                    <defs>
                        <linearGradient
                            id="lineGradient-<?php echo esc_attr(
                                $atts["widget_id"]
                            ); ?>"
                            x1="14.25"
                            y1="37"
                            x2="59.75"
                            y2="37"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#00d2e5" />
                            <stop offset="1" stop-color="#056dff" />
                        </linearGradient>
                        <clipPath id="centerClip-<?php echo esc_attr(
                            $atts["widget_id"]
                        ); ?>">
                            <rect x="0" y="20" width="100" height="60" />
                        </clipPath>

                        <mask id="lineMask-<?php echo esc_attr(
                            $atts["widget_id"]
                        ); ?>">
                            <rect width="100" height="100" fill="black" />
                            <g
                                fill="none"
                                stroke="white"
                                stroke-width="4"
                                class="animated-lines"
                            >
                                <g transform="translate(48.5, 56.5) translate(-22.5, -33.5)">
                                    <path
                                        class="path"
                                        d="M23 10 C23,10 35,22 35,22 C35,22 35,32 35,32 C35,32 10,57 10,57"
                                    />
                                </g>
                                <g transform="translate(58.25, 54.5) translate(-21.75, -38)">
                                    <path
                                        class="path"
                                        d="M19 10 C19,10 33.5,24.5 33.5,24.5 C33.5,24.5 33.5,42.5 33.5,42.5 C33.5,42.5 10,66 10,66"
                                    />
                                </g>
                                <g transform="translate(68, 52.5) translate(-21, -42.5)">
                                    <path
                                        class="path"
                                        d="M15 10 C15,10 32,27 32,27 C32,27 32,53 32,53 C32,53 10,75 10,75"
                                    />
                                </g>
                                <g transform="translate(51.5, 43.5) translate(-22.5, -33.5)">
                                    <path
                                        class="path"
                                        d="M22 57 C22,57 10,45 10,45 C10,45 10,35 10,35 C10,35 35,10 35,10"
                                    />
                                </g>
                                <g transform="translate(41.75, 45.5) translate(-21.75, -38)">
                                    <path
                                        class="path"
                                        d="M24.5 66 C24.5,66 10,51.5 10,51.5 C10,51.5 10,33.5 10,33.5 C10,33.5 33.5,10 33.5,10"
                                    />
                                </g>
                                <g transform="translate(32, 47.5) translate(-21, -42.5)">
                                    <path
                                        class="path"
                                        d="M27 75 C27,75 10,58 10,58 C10,58 10,32 10,32 C10,32 32,10 32,10"
                                    />
                                </g>
                            </g>
                        </mask>

                        <style>
                                            #<?php echo esc_attr(
                                                $atts["widget_id"]
                                            ); ?> .path {
                                                stroke-dasharray: 100;
                                                stroke-dashoffset: 100;
                                                animation: drawLine-<?php echo esc_attr(
                                                    $atts["widget_id"]
                                                ); ?> 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                                            }

                             @keyframes drawLine-<?php echo esc_attr(
                                 $atts["widget_id"]
                             ); ?> {
                                0%,
                                5% {
                                    stroke-dashoffset: 100;
                                }
                                30%,
                                33% {
                                    stroke-dashoffset: 0;
                                }
                                48%,
                                52% {
                                    stroke-dashoffset: -100;
                                }
                                67%,
                                70% {
                                    stroke-dashoffset: 0;
                                }
                                95%,
                                100% {
                                    stroke-dashoffset: 100;
                                }
                            }

                            /* Staggered delays with smooth overlap */
                            #<?php echo esc_attr(
                                $atts["widget_id"]
                            ); ?> .path:nth-child(1) { animation-delay: 0s; }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(2) {
                                animation-delay: 0.3s;
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(3) {
                                animation-delay: 0.6s;
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(4) {
                                animation-delay: 0.9s;
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(5) {
                                animation-delay: 1.2s;
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(6) {
                                animation-delay: 1.5s;
                            }

                            /* Slightly different timing functions for each path */
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(1) {
                                animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(2) {
                                animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(3) {
                                animation-timing-function: cubic-bezier(0.3, 0, 0.3, 1);
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(4) {
                                animation-timing-function: cubic-bezier(0.35, 0, 0.25, 1);
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(5) {
                                animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                            }
                            #<?php echo esc_attr($atts["widget_id"]); ?>
                            .path:nth-child(6) {
                                animation-timing-function: cubic-bezier(0.3, 0, 0.3, 1);
                            }
                        </style>
                    </defs>
                    <!-- Gradient rectangle masked by the lines -->
                    <g clip-path="url(#centerClip-<?php echo esc_attr(
                        $atts["widget_id"]
                    ); ?>)">
                        <rect
                            width="100"
                            height="100"
                            fill="url(#lineGradient-<?php echo esc_attr(
                                $atts["widget_id"]
                            ); ?>)"
                            mask="url(#lineMask-<?php echo esc_attr(
                                $atts["widget_id"]
                            ); ?>)"
                        />
                    </g>
                </svg>

            </div>

            <div>
            <p>powered by </p> <a href="https://www.okns.de/" target="_blank">Okeanos | okns.de</a>
            </div>
        </div>
    </div>
    <button class="start-chat hexagon-button" style="display: none;">
        <span>Start Chat</span>
    </button>
</div>
