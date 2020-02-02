using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Forecastsite.Controllers
{
    public class PlatformController : Controller
    {
        // GET: Forecast
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult testview()
        {
            return View();
        }
    }
}