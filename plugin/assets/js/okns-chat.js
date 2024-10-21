jQuery(document).ready(function ($) {
  const chatWidget = $(".chat-widget");
  const graphId = chatWidget.data("graph-id");
  let graphConfigId = "";

  function switchToActiveState() {
    $(".chat-state-initial").hide();
    $(".chat-state-active").show();
  }

  function switchToInitialState() {
    $(".chat-state-initial").show();
    $(".chat-state-active").hide();
    $(".messages").empty();
  }

  function startChat() {
    $.ajax({
      url: okns_ajax.ajax_url,
      type: "POST",
      data: {
        action: "okns_start_chat",
        graph_id: graphId,
      },
      success: function (response) {
        handleApiResponse(response.data);
        switchToActiveState();
      },
    });
  }

  function sendMessage() {
    const message = $("#chat-input").val().trim();
    if (message) {
      $.ajax({
        url: okns_ajax.ajax_url,
        type: "POST",
        data: {
          action: "okns_send_message",
          message: message,
          graph_config_id: graphConfigId,
        },
        success: function (response) {
          handleApiResponse(response.data);
        },
      });
      $("#chat-input").val("");
    }
  }

  function handleApiResponse(response) {
    if (response.error) {
      displayMessage("Error: " + response.error, "system");
      return;
    }

    graphConfigId = response.graph_config_id;

    // Display chat history
    if (response.chat_history) {
      response.chat_history.forEach((entry) => {
        displayMessage(entry.content, entry.role);
      });
    }

    // Handle different response types
    switch (response.type) {
      case "GraphFinished":
        displayMessage(response.output_string, "assistant");
        break;
      case "GraphDecisionRequired":
        displayMessage(response.question, "assistant");
        displayPossibilities(response.possibilities);
        break;
      case "GraphWrittenInputRequired":
        displayMessage(response.question, "assistant");
        break;
      case "GraphTokenPermissionRequired":
        displayMessage(response.message, "assistant");
        // You might want to handle token permission separately
        break;
    }
  }

  function displayMessage(content, role) {
    const messageElement = $("<div>")
      .addClass("message")
      .addClass(role)
      .text(content);
    $(".messages").append(messageElement);
    $(".messages").scrollTop($(".messages")[0].scrollHeight);
  }

  function displayPossibilities(possibilities) {
    const possibilitiesElement = $("<div>").addClass("possibilities");
    possibilities.forEach((possibility) => {
      const button = $("<button>")
        .text(possibility)
        .click(function () {
          $("#chat-input").val(possibility);
          sendMessage();
        });
      possibilitiesElement.append(button);
    });
    $(".messages").append(possibilitiesElement);
  }

  $("#start-chat, #new-chat").click(startChat);
  $("#send-message").click(sendMessage);
  $("#chat-input").keypress(function (e) {
    if (e.which == 13 && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  $(".minimize-chat").click(function () {
    chatWidget.toggleClass("minimized");
  });
});
