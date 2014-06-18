using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Web;

namespace UEv143
{
    /// <summary>
    /// Config 的摘要说明
    /// </summary>
    public static class Config
    {
        private static bool noCache = true;
        private static JObject BuildItems()
        {
            //var json = File.ReadAllText(HttpContext.Current.Server.MapPath("config.json"));
            //return JObject.Parse(json);

            /*
                 * 2014-06-04，陈建伟
                 * 注释掉上面两行代码，并添加下段代码，使得 config.json 文件的 UrlPrefix 相关参数(共 8 个)返回的目录路径都是 controller.ashx 文件所在目录
                 * 通过这种方式，避免了每次调整 ueditor 安装目录后都需要需改 config.json 文件中关于 UrlPrefix 相关配置项的问题。
                 */
            var json = File.ReadAllText(HttpContext.Current.Server.MapPath("config.json"));
            var path = VirtualPathUtility.GetDirectory(HttpContext.Current.Request.Path);
            var ret = JObject.Parse(json);
            var urlPrefixList = ret["urlPrefixList"];
            var names = urlPrefixList != null ? urlPrefixList.Values<string>() : null;
            if (names == null || names.Count() == 0)
            {
                var list = new List<string>();
                var tmp = ret.ToList<KeyValuePair<string, JToken>>().Where(p => p.Key.EndsWith("urlprefix", StringComparison.CurrentCultureIgnoreCase));
                foreach (var item in tmp)
                {
                    list.Add(item.Key);
                }
            }
            foreach (var name in names)
            {
                ret.Remove(name);
                ret.Add(name, path);
            }
            return ret;
        }

        public static JObject Items
        {
            get
            {
                if (noCache || _Items == null)
                {
                    _Items = BuildItems();
                }
                return _Items;
            }
        }
        private static JObject _Items;


        public static T GetValue<T>(string key)
        {
            return Items[key].Value<T>();
        }

        public static String[] GetStringList(string key)
        {
            return Items[key].Select(x => x.Value<String>()).ToArray();
        }

        public static String GetString(string key)
        {
            return GetValue<String>(key);
        }

        public static int GetInt(string key)
        {
            return GetValue<int>(key);
        }
    }
}