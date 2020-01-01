using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Forecastsite.Startup))]
namespace Forecastsite
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
