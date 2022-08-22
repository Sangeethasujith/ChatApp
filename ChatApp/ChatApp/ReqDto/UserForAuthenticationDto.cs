using System.ComponentModel.DataAnnotations;

namespace ChatApp.ReqDto
{
    public class UserForAuthenticationDto
    {
        [Required(ErrorMessage="Email is Required")]
        public string? Email { get; set; }
        [Required(ErrorMessage = "Passwordsssssss is Required")]
        public string? Password { get; set; }
    }
}
