using AutoMapper;
using SafeShare.CORE.DTO_s;
using SafeShare.CORE.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SafeShare.CORE
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<User,UserDTO>().ReverseMap();
            CreateMap<FileToUpload,FileDTO>().ReverseMap();
            CreateMap<ProtectedLink,ProtectedLinkDTO>().ReverseMap();
        }
    }
}
