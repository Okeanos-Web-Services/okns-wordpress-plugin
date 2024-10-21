jQuery(document).ready(function ($) {
  const chatWidget = $(".okns-chat-widget");
  const chatList = $(".chatlist");
  const chatForm = $("#chatform");
  const chatInput = $(".chatbox");
  const submitButton = $(".submit-button");
  const loadingAnimation = $(".loading-animation");
  const startChatButton = $(".start-chat");
  const minimizeButton = $(".minimize-chat");
  let graphConfigId = "";

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

  function createMessageElement(message) {
    const messageContainer = $("<li>").addClass(
      "message-container " + message.role,
    );
    const messageContent = $("<div>").addClass("message-content");
    const messageBadge = $("<div>")
      .addClass("message-badge")
      .text(message.role === "user" ? "You" : "Graph");
    const messageText = $("<div>")
      .addClass("message-text")
      .text(message.content);

    messageContent.append(messageBadge, messageText);
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

  minimizeButton.on("click", function () {
    chatWidget.toggleClass("minimized");
  });

  // Initialize the chat widget
  startChatButton.show();
  chatForm.hide();
});
