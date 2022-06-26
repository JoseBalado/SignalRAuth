using Microsoft.AspNetCore.SignalR;
using Notification;
using Microsoft.AspNetCore.Authorization;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        private readonly NotificationService2 _stockTicker;
        public ChatHub(NotificationService2 stockTicker)
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
