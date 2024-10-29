jQuery(document).ready(function ($) {
  // Initialize each chat widget separately
  $(".okns-chat-widget").each(function () {
    initializeChatWidget($(this));
  });

  function initializeChatWidget($widget) {
    const widgetId = $widget.attr("id");
    const position = $widget.data("position");
    const $chatList = $widget.find(".chatlist");
    const $chatForm = $widget.find("#chatform");
    const $chatInput = $widget.find(".chatbox");
    const $submitButton = $widget.find(".submit-button");
    const $loadingAnimation = $widget.find(".loading-animation");
    const $startChatButton = $widget.find(".start-chat");
    const $minimizeButton = $widget.find(".minimize-chat");
    const $chatHeader = $widget.find(".chat-header");
    let graphConfigId = "";

    function waitForZeroMd() {
      return new Promise((resolve) => {
        if (customElements.get("zero-md")) {
          resolve();
        } else {
          customElements.whenDefined("zero-md").then(() => resolve());
        }
      });
    }

    // Initialize based on position
    if (position === "dynamic-bottom") {
      $widget.addClass("minimized");
      updateMinimizeButtonText();
    }

    function showLoading() {
      $loadingAnimation.show();
      $chatInput.prop("disabled", true);
      $submitButton.prop("disabled", true);
    }

    function hideLoading() {
      $loadingAnimation.hide();
      $chatInput.prop("disabled", false);
      $submitButton.prop("disabled", false);
    }

    function containsMarkdown(content) {
      const markdownPatterns = [
        /^#\s/m,
        /\*\*(.*?)\*\*/,
        /\*(.*?)\*/,
        /\[.*?\]\(.*?\)/,
        /```[\s\S]*?```/,
        /`.*?`/,
        /^\s*[-*+]\s/m,
        /^\s*\d+\.\s/m,
        /\|.*\|.*\|/,
      ];
      return markdownPatterns.some((pattern) => pattern.test(content));
    }

    function createMessageElement(message) {
      const messageContainer = $("<li>").addClass(
        "message-container " + message.role,
      );
      const messageContent = $("<div>").addClass("message-content");
      const messageBadge = $("<div>")
        .addClass("message-badge")
        .text(message.role === "user" ? "You" : "Assistant");

      const hasMarkdown = containsMarkdown(message.content);

      if (hasMarkdown) {
        messageContent.addClass("has-markdown");
        const markdownIndicator = $("<span>")
          .addClass("markdown-indicator")
          .text("MD");
        messageBadge.append(markdownIndicator);
      }

      if (hasMarkdown) {
        waitForZeroMd().then(() => {
          const zeroMd = document.createElement("zero-md");
          const script = document.createElement("script");
          script.type = "text/markdown";
          script.textContent = message.content;
          zeroMd.appendChild(script);

          const messageText = $("<div>").addClass("message-text");
          messageText.append(zeroMd);
          messageContent.append(messageBadge, messageText);

          $chatList.scrollTop($chatList.prop("scrollHeight"));
        });
      } else {
        const messageText = $("<div>")
          .addClass("message-text")
          .text(message.content);
        messageContent.append(messageBadge, messageText);
      }

      messageContainer.append(messageContent);
      return messageContainer;
    }

    function displayMessages(messages) {
      $chatList.empty();
      messages.forEach((message) => {
        const messageElement = createMessageElement(message);
        $chatList.append(messageElement);
      });
      $chatList.scrollTop($chatList.prop("scrollHeight"));
    }

    function displayError(errorMessage) {
      displayMessages([{ role: "system", content: "Error: " + errorMessage }]);
    }

    function startChat() {
      showLoading();
      const graphId = $widget.data("graph-id");
      if (!graphId) {
        hideLoading();
        displayError("Graph ID is missing");
        return;
      }

      $.ajax({
        url: okns_ajax.ajax_url,
        type: "POST",
        data: {
          action: "okns_start_chat",
          graph_id: graphId,
          widget_id: widgetId,
        },
        success: function (response) {
          hideLoading();
          if (response.success && response.data) {
            handleApiResponse(response.data);
            graphConfigId = response.data.graph_config_id;
            $widget.addClass("chat-started");
            $startChatButton.hide();
            $chatForm.show();
          } else {
            displayError(response.data.error || "Unknown error");
          }
        },
        error: function (jqXHR) {
          hideLoading();
          displayError(jqXHR.responseJSON?.data?.error || "An error occurred");
        },
      });
    }

    function sendMessage(message) {
      if (!graphConfigId) {
        displayError("Please start the chat first.");
        return;
      }
      showLoading();
      $.ajax({
        url: okns_ajax.ajax_url,
        type: "POST",
        data: {
          action: "okns_send_message",
          message: message,
          graph_config_id: graphConfigId,
          widget_id: widgetId,
        },
        success: function (response) {
          hideLoading();
          if (response.success && response.data) {
            handleApiResponse(response.data);
          } else {
            displayError(response.data.error || "Unknown error");
          }
        },
        error: function (jqXHR) {
          hideLoading();
          displayError("An error occurred");
        },
      });
    }

    function handleApiResponse(response) {
      if (response.error) {
        displayError(response.error);
        return;
      }

      if (
        response.type == "GraphDecisionRequired" &&
        response.question &&
        response.chat_history
      ) {
        response.chat_history.push({
          role: "assistant",
          content: response.question,
        });
      }
      if (response.chat_history) {
        displayMessages(response.chat_history);
      }

      switch (response.type) {
        case "GraphDecisionRequired":
          displayPossibilities(response.possibilities);
          break;
        case "GraphTokenPermissionRequired":
          break;
        case "GraphFinished":
          $widget.addClass("chat-finished");
          $chatForm.hide();
          break;
      }
    }

    function displayPossibilities(possibilities) {
      const possibilitiesElement = $("<div>").addClass("possibilities");
      possibilities.forEach((possibility) => {
        const button = $("<button>")
          .text(possibility)
          .click(function () {
            sendMessage(possibility);
          });
        possibilitiesElement.append(button);
      });
      $chatList.append(possibilitiesElement);
    }

    function updateMinimizeButtonText() {
      if (position === "dynamic-bottom") {
        $minimizeButton.html($widget.hasClass("minimized") ? "▲" : "▼");
      }
    }

    function toggleChatState() {
      if (position === "dynamic-bottom") {
        $widget.toggleClass("minimized");
        updateMinimizeButtonText();

        if ($widget.hasClass("minimized")) {
          $startChatButton.hide();
        } else if (!graphConfigId) {
          $startChatButton.show();
        }
      }
    }

    function initialize() {
      $startChatButton.show();
      $chatForm.hide();

      if (position === "dynamic-bottom") {
        $widget.addClass("minimized");
        updateMinimizeButtonText();
      }
    }

    // Event Handlers
    $chatForm.on("submit", function (e) {
      e.preventDefault();
      const message = $chatInput.val().trim();
      if (message) {
        sendMessage(message);
        $chatInput.val("");
      }
    });

    $startChatButton.on("click", startChat);

    if (position === "dynamic-bottom") {
      $minimizeButton.on("click", function (e) {
        e.stopPropagation();
        toggleChatState();
      });

      $chatHeader.on("click", toggleChatState);
    }

    // Initialize the widget
    initialize();
  }
});
