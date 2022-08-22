using System.ComponentModel.DataAnnotations;

namespace ChatApp.ReqDto
{
    public class RegisterDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [Required]
        [DataType(DataType.EmailAddress)]
        public string? Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string? Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Password and confirm password must be equal")]
        public string? ConfirmPassword { get; set; }
    }
}
