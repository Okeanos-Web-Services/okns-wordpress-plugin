<div class="okns-chat-widget" data-graph-id="<?php echo esc_attr(
    $atts["graph_id"]
); ?>">
    <div class="chat-header">
        <h3>Chat with Okeanos</h3>
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
                <svg
                    id="Ebene_1"
                    data-name="Ebene 1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 74 74"
                >
                    <defs>
                        <style>
                            .cls-2 {
                                fill: none;
                                stroke: url(#Unbenannter_Verlauf_5);
                                stroke-width: 1px;
                                stroke-dasharray: 350;
                                stroke-dashoffset: 350;
                                animation: drawHexagon 3s infinite;
                            }
                            @keyframes drawHexagon {
                                0% {
                                    stroke-dashoffset: 100;
                                }
                                50% {
                                    stroke-dashoffset: 0;
                                }
                                100% {
                                    stroke-dashoffset: -100;
                                }
                            }
                        </style>
                        <linearGradient
                            id="Unbenannter_Verlauf_5"
                            data-name="Unbenannter Verlauf 5"
                            x1="14.25"
                            y1="37"
                            x2="59.75"
                            y2="37"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#00d2e5" />
                            <stop offset="1" stop-color="#056dff" />
                        </linearGradient>
                    </defs>
                    <rect class="cls-1" x="0" width="74" height="74" />
                    <path
                        class="cls-2"
                        d="M59.75,27.13l-12.88-12.88h-.96l-18.52,18.52v8.47l7.79,7.79.18.18-.18.18-2.7,2.7-.18.18-.18-.18-8.92-8.92-.07-.07v-12.18l.07-.07,16.58-16.58h-3.28l-15.7,15.7v14.1l9.67,9.67.18.18-.18.18-2.7,2.7-.18.18-.18-.18-10.8-10.8-.07-.07v-17.82l.07-.07,13.77-13.77h-3.28l-12.88,12.88v19.73l12.88,12.88h.96l18.52-18.52v-8.47l-7.79-7.79-.18-.18.18-.18,2.7-2.7.18-.18.18.18,8.92,8.92.07.07v12.18l-.07.07-16.58,16.58h3.28l15.7-15.7v-14.1l-9.67-9.67-.18-.18.18-.18,2.7-2.7.18-.18.18.18,10.8,10.8.07.07v17.82l-.07.07-13.77,13.77h3.28l12.88-12.88v-19.73ZM44.22,33.65l.07.07v6.55l-.07.07-7.04,7.04-.18.18-.18-.18-7.04-7.04-.07-.07v-6.55l.07-.07,7.04-7.04.18-.18.18.18,7.04,7.04Z"
                    />
                </svg>
            </div>


            <p>Thinking...</p>
        </div>
    </div>
    <button class="start-chat hexagon-button" style="display: none;">
        <span>Start Chat</span>
    </button>
</div>
