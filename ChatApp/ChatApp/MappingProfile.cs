using AutoMapper;
using ChatApp.Models;
using ChatApp.ReqDto;

namespace ChatApp
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, User>()
        .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
        
    }
}
