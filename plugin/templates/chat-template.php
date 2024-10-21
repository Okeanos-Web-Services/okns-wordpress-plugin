<div class="chat-widget" data-graph-id="<?php echo esc_attr(
    $atts["graph_id"]
); ?>">
    <div class="chat-header">
        <h3>Chat with us</h3>
        <button class="minimize-chat">_</button>
    </div>
    <div class="chat-body">
        <div class="chat-state-initial">
            <button id="start-chat">Start Chat</button>
        </div>
        <div class="chat-state-active" style="display: none;">
            <div class="messages"></div>
            <div class="input-area">
                <textarea id="chat-input" placeholder="Type a message..."></textarea>
                <button id="send-message">Send</button>
            </div>
            <button id="new-chat">Open New Chat</button>
        </div>
    </div>
</div>
