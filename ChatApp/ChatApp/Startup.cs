using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ChatApp.Models;
using Public_Chat.Hubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ChatApp.JwtFeatures;
using EmailService;

namespace ChatApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var jwtSetting = Configuration.GetSection("JWTSettings");

            services.AddDbContext<AuthDbContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("AuthDbContext"));

            });

            services.AddScoped<JwtHandler>();

            var emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);

            services.AddScoped<IEmailSender, EmailSender>();

            services.Configure<DataProtectionTokenProviderOptions>(opt =>
                 opt.TokenLifespan = TimeSpan.FromHours(2));
          
           
            services.AddIdentity<User, IdentityRole>(opt =>
            {
                opt.Password.RequiredLength = 7;
                opt.Password.RequireDigit = true;
                opt.Password.RequireUppercase = true;
                opt.Password.RequireLowercase = true;
            })
 .AddEntityFrameworkStores<AuthDbContext>().AddDefaultTokenProviders();

            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSetting["validIssuer"],
                    ValidAudience = jwtSetting["validAudience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes(jwtSetting.GetSection("securityKey").Value))
                };
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo()
                {
                    Title = "Chat API",
                    Version = "v1"
                });
            });
            services.AddMvcCore().AddApiExplorer();
            services.AddCors(options =>
            {
                options.AddPolicy("_myAllowSpecificOrigins",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:4200")
                               .AllowAnyHeader()
                               .AllowAnyMethod()
                               .SetIsOriginAllowed((x) => true)
                               .AllowCredentials();
                    });
            });

            services.AddAutoMapper(typeof(Startup).Assembly);
            services.AddSignalR();

            //services.ResolveDependencies();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
            });
            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("_myAllowSpecificOrigins");
            app.UseAuthentication();

            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chatsocket");     // path will look like this https://localhost:44379/chatsocket 
            });
        }
    }
}
