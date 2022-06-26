using Microsoft.AspNetCore.SignalR;
using Notification;
using Microsoft.AspNetCore.Authorization;

namespace SignalRChat.Hubs
{
    [Authorize]
    public class AuthChatHub : Hub
    {
        private readonly NotificationService _stockTicker;
        public AuthChatHub(NotificationService stockTicker)
        {
            _stockTicker = stockTicker;
        }
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine("User: {0}, message {1}", user, message);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
