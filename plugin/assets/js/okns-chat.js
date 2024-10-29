jQuery(document).ready(function ($) {
  function waitForZeroMd() {
    return new Promise((resolve) => {
      if (customElements.get("zero-md")) {
        resolve();
      } else {
        customElements.whenDefined("zero-md").then(() => resolve());
      }
    });
  }
  const chatWidget = $(".okns-chat-widget");
  const chatList = $(".chatlist");
  const chatForm = $("#chatform");
  const chatInput = $(".chatbox");
  const submitButton = $(".submit-button");
  const loadingAnimation = $(".loading-animation");
  const startChatButton = $(".start-chat");
  const minimizeButton = $(".minimize-chat");
  const chatHeader = $(".chat-header");
  let graphConfigId = "";
  chatWidget.addClass("minimized"); // Start minimized
  updateMinimizeButtonText();
  function showLoading() {
    $(".loading-animation").show();
    chatInput.prop("disabled", true);
    submitButton.prop("disabled", true);
  }

  function hideLoading() {
    $(".loading-animation").hide();
    chatInput.prop("disabled", false);
    submitButton.prop("disabled", false);
  }
  function containsMarkdown(content) {
    // Basic check for common markdown syntax
    const markdownPatterns = [
      /^#\s/m, // Headers
      /\*\*(.*?)\*\*/, // Bold
      /\*(.*?)\*/, // Italic
      /\[.*?\]\(.*?\)/, // Links
      /```[\s\S]*?```/, // Code blocks
      /`.*?`/, // Inline code
      /^\s*[-*+]\s/m, // Lists
      /^\s*\d+\.\s/m, // Numbered lists
      /\|.*\|.*\|/, // Tables
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
      .text(message.role === "user" ? "You" : "Assistent");

    const hasMarkdown = containsMarkdown(message.content);

    if (hasMarkdown) {
      messageContent.addClass("has-markdown");
      const markdownIndicator = $("<span>")
        .addClass("markdown-indicator")
        .text("MD");
      messageBadge.append(markdownIndicator);
    }

    if (hasMarkdown) {
      // Create zero-md element after ensuring it's defined
      waitForZeroMd().then(() => {
        const zeroMd = document.createElement("zero-md");
        const script = document.createElement("script");
        script.type = "text/markdown";
        script.textContent = message.content;
        zeroMd.appendChild(script);

        const messageText = $("<div>").addClass("message-text");
        messageText.append(zeroMd);
        messageContent.append(messageBadge, messageText);

        // Trigger a re-render if needed
        chatList.scrollTop(chatList.prop("scrollHeight"));
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
    chatList.empty();
    messages.forEach((message) => {
      const messageElement = createMessageElement(message);
      chatList.append(messageElement);
    });
    chatList.scrollTop(chatList.prop("scrollHeight"));
  }

  function displayError(errorMessage) {
    displayMessages([{ role: "system", content: "Error: " + errorMessage }]);
  }

  function startChat() {
    showLoading();
    const graphId = chatWidget.data("graph-id");
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
      },
      success: function (response) {
        hideLoading();
        if (response.success && response.data) {
          handleApiResponse(response.data);
          graphConfigId = response.data.graph_config_id;
          startChatButton.hide();
          chatForm.show();
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
        // Handle token permission separately if needed
        break;
      case "GraphFinished":
        // Hide the chat form when the graph is finished
        chatForm.hide();
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
    chatList.append(possibilitiesElement);
  }

  chatForm.on("submit", function (e) {
    e.preventDefault();
    const message = chatInput.val().trim();
    if (message) {
      sendMessage(message);
      chatInput.val("");
    }
  });

  startChatButton.on("click", startChat);
  function updateMinimizeButtonText() {
    if (chatWidget.hasClass("minimized")) {
      minimizeButton.html("▲"); // Up arrow when minimized
    } else {
      minimizeButton.html("▼"); // Down arrow when expanded
    }
  }
  minimizeButton.on("click", function (e) {
    e.stopPropagation(); // Prevent event from bubbling to header
    toggleChatState();
  });
  chatHeader.on("click", function () {
    toggleChatState();
  });

  function toggleChatState() {
    chatWidget.toggleClass("minimized");
    updateMinimizeButtonText();

    // Handle start button visibility
    if (chatWidget.hasClass("minimized")) {
      startChatButton.hide();
    } else if (!graphConfigId) {
      // Only show start chat button if chat hasn't been started yet
      startChatButton.show();
    }
  }
  function initialize() {
    startChatButton.show();
    chatForm.hide();
    chatWidget.addClass("minimized"); // Ensure it starts minimized
    updateMinimizeButtonText(); // Set initial button text
  }
  // Initialize the chat widget
  startChatButton.show();
  chatForm.hide();
  initialize();
});
