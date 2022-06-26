using SignalRChat.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
namespace Notification
{
    public class NotificationService
    {
        private readonly IHubContext<AuthChatHub> _myHubContext;
        private Timer _timer;
        private readonly TimeSpan _updateInterval = TimeSpan.FromMilliseconds(1000);

        private Queue<string> LastHundredValues = new Queue<string>();

        public NotificationService(IHubContext<AuthChatHub> myHubContext)
        {
            _myHubContext = myHubContext;
            _timer = new Timer(UpdateCPUUsage, null, _updateInterval, _updateInterval);
        }

        public async Task SendMessage(string user, string message)
        {
            await _myHubContext.Clients.All.SendAsync("SendMessage", user, message);
        }

        private void UpdateCPUUsage(Object state)
        {
            try
            {
                var millisecondsToWait = 500;
                var startCpuUsage = Process.GetProcesses();
                var startTotal = startCpuUsage
                    .ToList()
                    .Sum(process => process.TotalProcessorTime.TotalMilliseconds);

                Thread.Sleep(millisecondsToWait);

                var endCpuUsage = Process.GetProcesses();
                var endTotal = endCpuUsage
                    .ToList()
                    .Sum(process => process.TotalProcessorTime.TotalMilliseconds);

                var cpuTotalUsedMilliseconds = endTotal - startTotal;
                var cpuUsageTotal = cpuTotalUsedMilliseconds / (Environment.ProcessorCount * millisecondsToWait);
                var cpuUsagePercentage = Math.Abs(cpuUsageTotal * 100);

                UpdateQueue(cpuUsagePercentage);

                _myHubContext.Clients.All.SendAsync("ReceiveMessage", "server", $"{cpuUsagePercentage:N2}");
                _myHubContext.Clients.All.SendAsync("SendQueue", "server", LastHundredValues);

                Console.WriteLine("CPU usage: " + $"{cpuUsagePercentage:N2}");
            }
            catch (Exception e)
            {
                Console.WriteLine("{0} Second exception caught.", e);
                Console.WriteLine("Just keep running, no problem!!!.");
            }
        }

        private void UpdateQueue(double cpuUsagePercentage)
        {
            if(LastHundredValues.Count < 101)
            {
                LastHundredValues.Enqueue($"{cpuUsagePercentage:N2}");
            }
            else
            {
                LastHundredValues.Dequeue();
                LastHundredValues.Enqueue($"{cpuUsagePercentage:N2}");
            }
        }
    }
}
