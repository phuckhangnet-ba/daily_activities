let tele_token = '7685709224:AAF9h6iuTpn-_Qx9d3fiXbAOguZbaM_ws6E'; // Replace with your actual token
let chatId = '-1002337145719'; // Replace with your actual channel ID
let url = `https://api.telegram.org/bot${tele_token}/sendMessage`;
function _send(message){
    $.ajax({
    type: 'POST',
    url: url,
    data: {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML' // Optional: Enable HTML formatting
    },
    success: function(response) {
      console.log('Message sent successfully:', response);
      // Handle success (e.g., display a success message)
    },
    error: function(error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., display an error message)
    }
  });
}