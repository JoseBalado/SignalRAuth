using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using SignalRAuth.Data;
using SignalRAuth.Models;
using SignalRChat.Hubs;
using Notification;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();

builder.Services.TryAddEnumerable(
    ServiceDescriptor.Singleton<IPostConfigureOptions<JwtBearerOptions>,
        ConfigureJwtBearerOptions>());

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

builder.Services.AddCors(options =>
{
        options.AddPolicy("MyAllowSpecificOrigins",
                        policy  =>
                        {
                            policy.AllowAnyHeader();
                            policy.AllowAnyMethod();
                            policy.AllowAnyOrigin();
                            // AllowCredentials() needed to make CORS works.
                            policy.AllowCredentials();
                            // WithOrigins() needed when AllowCredentials() is needed.
                            policy.WithOrigins(
                                "https://localhost:44488",     // Allow connecting from localhost.
                                "http://192.168.1.33:3000", // IP of the server and port that wants to connect to this server.
                                                            // The application on the server (JavaScript) trying to connect must use this protocol, IP and port: 
                                                            // https://ip-of-this-server:7116/chatHub

                                "http://localhost:3000"     // Allow connecting from localhost.

                            );
                        });
});

builder.Services.AddSignalR();

builder.Services.AddSingleton<NotificationService>();
builder.Services.AddSingleton<NotificationService2>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors("MyAllowSpecificOrigins");

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");;

app.MapHub<ChatHub>("/chatHub");
app.MapHub<AuthChatHub>("/AuthChatHub");

app.Run();
