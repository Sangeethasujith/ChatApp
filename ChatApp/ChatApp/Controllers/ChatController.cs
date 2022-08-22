using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using ChatApp.JwtFeatures;
using ChatApp.Models;
using ChatApp.ReqDto;
using EmailService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Public_Chat.Hubs;
using Public_Chat.ReqDto;





namespace Public_Chat.Controllers
{

    [Route("api/chat")]
   // [Authorize]
    [ApiController]

    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;
       private readonly EmailService.IEmailSender _emailSender;


        public ChatController(IHubContext<ChatHub> hubContext, UserManager<User> userManager, IMapper mapper, JwtHandler jwtHandler,IEmailSender emailSender)
        {
            _hubContext = hubContext;
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
           _emailSender = emailSender;
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationDto userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new AuthResponseDto { ErrorMessage = "Invalid Authentication" });

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            var firstName = user.FirstName;

            return Ok(new AuthResponseDto { IsAuthSuccessful = true, Token = token , FirstName=firstName});
        }


        [Route("send")]                                           //path looks like this: https://localhost:44379/api/chat/send
        [HttpPost]
        public IActionResult SendRequest([FromBody] MessageDto msg)
        {
            _hubContext.Clients.All.SendAsync("ReceiveOne", msg.user, msg.msgText);
            return Ok();
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var param = new Dictionary<string, string?>
            {
                {"token", token },
                {"email", forgotPasswordDto.Email }
            };

            var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);

            var message = new Message(new string[] { user.Email }, "Reset token email", callback);
            await _emailSender.SendEmailAsync(message);
            return Ok();
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
                return BadRequest();

            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid Request");

            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
            if (!resetPasswordResult.Succeeded)
            {
                var errors = resetPasswordResult.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            return Ok();
        }

    }
}
