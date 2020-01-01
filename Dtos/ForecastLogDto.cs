using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Forecastsite.Dtos
{
    public class ForecastLogDto
    {
        public string FileName { get; set; }
        public int FileSize { get; set; }
        public string Test { get; set; }
        public DateTime Date = DateTime.Now;
        public int TimeSpend { get; set; }

    }
}