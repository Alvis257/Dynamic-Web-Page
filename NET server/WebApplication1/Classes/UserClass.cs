using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Classes
{
    public class UserfromTable
    {
        [Key]
        public int userId { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime lastUpdatedDate { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string email { get; set; }
        public string resetCode { get; set; }
        public bool admin { get; set; }
        public bool read { get; set; }
        public bool write { get; set; }
        public bool delete { get; set; }
        public bool share { get; set; }
    }
    public class User
    {
        public int userId { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public DateTime createdDate { get; set; }
        public DateTime lastUpdatedDate { get; set; }
        public string userName { get; set; }
        public string password { get; set; }
        public string role { get; set; }
        public string email { get; set; }
        public string resetCode { get; set; }
        public Rights rights { get; set; }
    }

    public class UserLogin
    {
        public string userName { get; set; }
        public string password { get; set; }
    }
    public class UpdateResetCodeModel
    {
        public string userName { get; set; }
        public string resetCode { get; set; }
    }
    public class Rights
    {
        public bool admin { get; set; }
        public bool read { get; set; }
        public bool write { get; set; }
        public bool delete { get; set; }
        public bool share { get; set; }
    }

    public class ResetPasswordModel
    {
        public string userName { get; set; }
        public string resetCode { get; set; }
        public string newPassword { get; set; }
    }

    public class CheckCode
    {
        public string email { get; set; }
        public string resetCode { get; set; }
    }

    public class request
    {
        public string email { get; set; }
    }

}

