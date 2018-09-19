using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Fuji.ReporteEstructurado.Sitio.Extensions
{
    public class Security
    {
        /// <summary>
        /// Método que permite encriptar las credenciales y obtener el token asociado al usuario
        /// </summary>
        /// <param name="Usuario"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public static string Encrypt(string cadena)
        {
            byte[] Results;
            System.Text.UTF8Encoding UTF8 = new System.Text.UTF8Encoding();
            MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
            byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(ConfigurationManager.AppSettings["Clave"].ToString()));
            TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();
            TDESAlgorithm.Key = TDESKey;
            TDESAlgorithm.Mode = CipherMode.ECB;
            TDESAlgorithm.Padding = PaddingMode.PKCS7;
            byte[] DataToEncrypt = UTF8.GetBytes(cadena);
            try
            {
                ICryptoTransform Encryptor = TDESAlgorithm.CreateEncryptor();
                Results = Encryptor.TransformFinalBlock(DataToEncrypt, 0, DataToEncrypt.Length);
            }
            finally
            {
                TDESAlgorithm.Clear();
                HashProvider.Clear();
            }
            string Resultado = Convert.ToBase64String(Results);
            return ToHex(Resultado);
        }
        /// <summary>
        /// Permite desencriptar la cadena con el algoritmo de rijndael
        /// </summary>
        /// <param name="Token"></param>
        /// <returns></returns>
        public static string Decrypt(string Token)
        {
            string response = "";
            try
            {
                string CadenaEncriptada = HexToString(Token);
                byte[] Results;
                UTF8Encoding UTF8 = new UTF8Encoding();
                MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
                byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(ConfigurationManager.AppSettings["Clave"].ToString()));
                TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();
                TDESAlgorithm.Key = TDESKey;
                TDESAlgorithm.Mode = CipherMode.ECB;
                TDESAlgorithm.Padding = PaddingMode.PKCS7;
                byte[] DataToDecrypt = Convert.FromBase64String(CadenaEncriptada);
                try
                {
                    ICryptoTransform Decryptor = TDESAlgorithm.CreateDecryptor();
                    Results = Decryptor.TransformFinalBlock(DataToDecrypt, 0, DataToDecrypt.Length);
                    response = UTF8.GetString(Results);
                }
                finally
                {
                    TDESAlgorithm.Clear();
                    HashProvider.Clear();
                }
            }
            catch (Exception e) { Log.EscribeLog(e.Message); }
            return response;
        }
        /// <summary>
        /// Convierte un string en su representación en hexadecimal.
        /// </summary>
        /// <param name="cadena"></param>
        /// <returns></returns>
        public static string ToHex(string cadena)
        {
            string hex = "";
            char[] values = cadena.ToCharArray();
            foreach (char letter in values)
            {
                int value = Convert.ToInt32(letter);
                hex += String.Format("{0:x}", value);
            }
            return hex;
        }
        /// <summary>
        /// Converte una cadena de hexadecimal a un string, método inverso de ToHex
        /// </summary>
        /// <param name="hex"></param>
        /// <returns></returns>
        public static string HexToString(string hex)
        {
            string cadena = "";
            try
            {
                if (hex.Length % 2 == 0)
                {
                    for (int i = 0; i < hex.Length; i = i + 2)
                    {
                        int value = Convert.ToInt32(hex.Substring(i, 2), 16);
                        cadena += (char)value;
                    }
                }
                else
                {
                    throw new Exception("Cadena inválida");
                }
            }
            catch (Exception e) { cadena = ""; Log.EscribeLog(e.Message); }
            return cadena;
        }

        ///// <summary>
        ///// Método para validar la autenticidad del token de un usuario
        ///// </summary>
        ///// <param name="Token"></param>
        ///// <param name="userId"></param>
        ///// <returns></returns>
        //public static bool ValidarToken(string Token)
        //{
        //    bool valido = false;
        //    try
        //    {
        //        var base64EncodedBytes = Convert.FromBase64String(Token);
        //        var tokenDecoded = Encoding.UTF8.GetString(base64EncodedBytes);
        //        int id = Convert.ToInt32(tokenDecoded.Split('|')[0]);
        //        using (var db = new App_Data.LicenciasDBEntities())
        //        {
        //            App_Data.tbl_CAT_Usuarios usuario;
        //            if ((usuario = db.tbl_CAT_Usuarios.FirstOrDefault(i => i.intUsuarioID == id && (bool)i.bitActivo)) != null)
        //                valido = Token == GenerarToken(usuario.intUsuarioID, usuario.vchPassword) ? true : false;
        //        }
        //    }
        //    catch
        //    {
        //        valido = false;
        //    }
        //    return valido;
        //}

        public static string GenerarToken(int userId, string password)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(userId + "|" + EncryptPassword(password)));
        }

        /// <summary>
        /// Método para encriptar las contraseñas
        /// </summary>
        /// <param name="Password"></param>
        /// <returns></returns>
        public static string EncryptPassword(string Password)
        {
            string encryptedPassword = string.Empty;
            try
            {
                using (var db = new App_Data.KotobaDBEntities())
                {
                    encryptedPassword = db.stp_encripta_cadena(Password).First();
                }
            }
            catch
            {
                encryptedPassword = "";
            }
            return encryptedPassword;
        }
    }
}