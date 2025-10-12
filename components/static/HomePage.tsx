import HeroSection from "../global/heroSection";
import { FaRocket, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const serviceCategories = [
    {
      title: "خدمات بانکی بین المللی",
      services: [
        {
          id: 1,
          title: "افتتاح حساب پی پال",
          description: "افتتاح حساب پی پال بین المللی در ایران",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/12-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQUAPCV5HT%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115023Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiAdNbhSos5XqYr4gq9o4WKaW7fPiO2Qi8lOMAQlzn0wCQIgHRFmciO2ErPujMwzV18m7opC87SdaQ%2BS64eLltBlwFYq1gIILRAAGgwzMTEzNzYxMjAyMjUiDOZmbxPOJLVVQwDFuSqzAsJh7%2B4AuiOvdwM1mOyvLGRUtWppogMaFh9gVuwk%2FUrDcEO4OKmGaZzmd4GeCqghsyrMfprclwqiV8XhJCfiZ9mE%2B7ysfOhfs36reUVr92fB17WMT7uj0zbPulTbQ7R74z9hElChGL2Ll4VqUbY84aKUOhxVeZ2eYf8uWwPbyU153%2Bv2Q9a5e34WtfzUJtUI6MiLuvYNKzJFe53dd%2BG6q6%2FUsvvgU58351m2Z0CcL67SS2C9%2F2zf0APoIesxZszkdMEHu3TAI8wInIwiSYB0Pew9dvej5w6vucozCbaY7EKsdQDnqB28z3W5cM8mIaLKasoSIsMcTROoMeEOBPHXwA5%2FSbXvmRIEdaL2NV9c3MsyLXc4ZxyqOPr3iBbW8K369oF%2B3ep82W7%2BrUG1oL09hTKG%2Bs0wkvKtxwY6rgJnb9TqBEgz2H8%2FYKoAAe8OvujxE%2BOiYA78nKcecLBqVj5JLDnzJDRWAYY9g0X%2FLS72tR3NGc3rjo5itsJ%2BGhUwNqGiL9CySx2yOber5MVVi2%2BM7ClerWWWmdcO3APE7CubFc0URKhhPADV5vUEKx0%2FID8cjApaoej8Q5EJVe08Pixcrxiqnn9qm6unt1G%2BSNhTnRtU%2Ffh3xWDc%2BcdgW15YxDVTzcehe9U9qdpIOZVnAH7nPH7KkY7ZqJb62H%2FMjwLqenhx6kIjkwRC9LQCbRemrBjpJ82kmhFE7dEaymz9Ly7UzKWOd9WvL46AHBGdoNCSoHTavrpErwn7ISSAF52%2Fh3AX0cGwCPRwU7BuB1PQqKfZJpEjhi1UGs8FI1TvIMH0T72k6RM9Nz%2B6FOL1Kg%3D%3D&X-Amz-Signature=02f29582be1519530d1e06b04c3a08be2975b611e42cb68b0d739b5e2d34a2a7&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/Opening-a-PayPal-account",
        },
        {
          id: 2,
          title: "شارژ حساب پی پال",
          description: "شارژ حساب پی پال با بهترین نرخ",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/15-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ7VRWQT6Q%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115358Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA6s2mfNSiVdmP8bXQUy2AT6OtULKb%2FoX2A2OhPHAjEL0CIQD7kNXZvI3w101oBOwT30jpOjVEqcmn3bqBTzPD40ifhSrWAggtEAAaDDMxMTM3NjEyMDIyNSIMHjVyeGVl0o6Zl0zxKrMCbqphvOqxMq83WH%2FCF1HRpP2Lb%2FHLOraEM19k%2Bo%2B66mgAS2nCtPOT38mBiyy%2BypZOjojNsB82ht9rr6L1DbZ8bFAycfI7UPDqAVnyfajkY701clx5udq2gUZqhfaSujaGPWDgB8qZ09Dqz53oAwrQw0vrNfL67cTEUEfOmvodZZsalUF7QpHYyFqmvLZyG1p5uwj8mIO59w8zUVLuTX94uhCbN5j64ik1Tn5AKzT8UNuJjejm3Nb0AXbS%2B9kplWmEa4MXiuL4A5aDN0EJnEoPem5mC02xBAVye7Dn2nJVJlQ%2FlcTZUBNgLy%2FRsvg9TIvMt4Gnj6ycTbJhEMfjcSCgNwLtz9tufBZe3UuApn2HLn%2Bx4Vch6EmoefVzNWmwnMQjhfV%2BB3s0RZhymcwM7H3N0cuXkjCS8q3HBjqsAicnCFMQvB2mK5inC44u6u%2BWcqqOvU9cok%2Fz4%2FiJetTpIopcXRva9ln0fM6p1%2B6DGJSxg2r9MF5Xj4oOyQxdxAdNt1fGlGTpWCRtigTdlV5fvycxRtahoFpJMlfe4gsqbNeeBnOatmmAt%2F7CND8JaTdWEEK6FzHJXLVpSDSIEDLKP1b1ZPKbEPk9EId1qCE41EhdJj7rYYYrFAf5qlDcD9uxNPlw21saEQqusISH5ca7etB1FcpqdeWZs4K7Iky8%2Fiw29WWMRgpBsUxn%2BX14DNj2dgDv2tTwFrDt8f7608cHfT3nfcO33BMCBNA9PT69Goyl8Cwp8M7TBEW6zzVwZ4j6snB4LYx6tehdwOTVIjiC4VjswSBQBIhYj0JBG1J5ZmOyrZ14qWFzCbkIAQ%3D%3D&X-Amz-Signature=805e3055584a58d340c93ff8739ce560b0e2f5b04b3ea63b17086d77a420c9b8&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/charge-paypal-account",
        },
        {
          id: 3,
          title: "نقد حساب پی پال",
          description: "نقد کردن موجودی پی پال به ریال",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/16-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQXLTL6724%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115455Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA8sMz6Z33lLrDYiBT7LolSC%2B2b%2BeyzWgOQ3w7WNhvz%2FgCIQD4no%2BW7yQAwZQZHQfLQHhQ%2BuQTFj7fOPJEimV4h7uCNyrWAggtEAAaDDMxMTM3NjEyMDIyNSIMyYtkLrdSkHjc%2FnkCKrMCNgj4W21KTVVrGPEZQ%2BqrAVIJwiKM6lYBJKW6Z4G8AGtcafSOVKSF9w3KFTpvicXriRWRd8NB8jvF%2FteooBTpYlGdPUpSJCJlWV5TEmeJdpjsTnvzOC6qCPn2SkKEma819yUWwwPw3lADyTRPke5Vf7iwjoLPySl3XYzDkn%2FMVBQ2EKVXDqx4EI7WTDJ%2FHNfy0veUjm8Vm%2B90ChH3QG2IUeNCgexM%2FphAiLxa1K5w7qcQ4A%2BRsf7NzTf7kUC81F3hcAeVxz6xlg%2BvfAPPml56mOmgDehbcwOKlywihnBDsSI8%2BzY%2Fc7%2BnPRAp8H5DqTrplI1rNCbLjYP1CpQyNMaT42xPFsGg6Qlrq5cnLcs8rd0YAFNAR%2FsJstOy2Hdc44TyMsM%2BvIGz78%2BFUZDjkZWX0j2%2BcDCS8q3HBjqsAltLZq%2B8nTsEq%2BlvRaBlDAjsqd4cruZ85OcErci9evfBVMBKaX57b7VbDvNz7XOJwTxwkkq61aHEwd3a9jGnlCWM1odDPtRH6WBX3GIq9%2B%2BXxEFN3SERAowNW3%2BNE3j%2BviJrYlopb69XY8lyh8vou0Ony0mbVWjol3D1fhw%2FlBSzbInwa1BlK6GudDo%2FcFtyzNPSFPhtyWxExWqCJRDDZvSoYugZjgowKl9m13JdnG%2FEBPtWDMzoCkmIcgQXCmREpftmu7BOq4VuCf18lgkTOFpjsTJB0w4n9%2Fazys4A5h%2F7kX%2B4YwgAJ4Pk6S3zD8uEhNGpDmFjNynPcwpABaZCgzGFc2XLsvDun77j9g47PCdBm%2BY9cnQItvtNagK2rBHDXLVG1uLigcTPKdV%2BNg%3D%3D&X-Amz-Signature=3a88ffbba6da2fb2a45278399a863ac1987ac85d0aadac8a359512032c05d72d&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/cashing-out-PayPal-balance",
        },
        {
          id: 4,
          title: "افتتاح حساب وایز",
          description: "افتتاح حساب Wise برای پرداخت های بین المللی",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/2-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQQP5KC3BI%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115633Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA6394sWEdhCg3PPQljhoR8zKu2JLk9nwXSYTttI57n6QCIDFDDC9ke7KU4v1RBhqIFAscrv6UJ56EJywKOxgeGfOIKtYCCC0QABoMMzExMzc2MTIwMjI1IgzplgCVoM6RiCWm8HMqswIwLp4U%2BRGUeWkierba1c1uvSsJhQrWXxRW%2Fxkl6fJ8Q7nUVcYxkV2Wx%2FyqksxyXsSiHIQJ9epVJ5KNSuv5XBfUgTWc0owhsbrqKWmkHH7wVjMVbFmd6aADTurfvf385ZrONsdNON53StZ%2Ftk%2FDwHuaFrSDU7Sf%2FqQUfn4mm5iOYRgNEQqLaybfqs9%2BHN2jcDziSr4uzehUmkj4gm9YJ7bP%2FbNwcnsyxcQbG6X1%2FfJJ%2F8M2EIObccm3j0QNwKjkqxMYrBx3dpgLvtShjlV61cCQaGbgA5KSMmX4IKa9vJnDQeUiYlgsWdoZFBP5n398Iq7JQVnKSPScD3SvSGwZL%2B9InHYmHFn5OzehvdGZz2gr35%2FsQesEL%2BeLd%2B9xYaFO%2BuBzIH%2FoMU637n3zLVUJYF6aIm02MJLyrccGOq0CjgPP9dCqEE4jEabK8adan5yg%2BGSWnM0HKYyBq62DcWw7q4S%2FyNA4ccvCM3liAqrK4fU6LrtqE87YMZ220z0biSeZr%2FMD0KooLs3pPNQgT9OAVUGeupZ213KcheYuEozpOEPALGW7jB%2FFky1d8e49wlf4fV8F5wD7LJ25G3qZDiN85ETslYSalqFzDTVPaSd5uiaerO%2FGkzuUstYs1BCo%2FV%2BuACC5%2BnrVZKNEorLfLSGlaKD%2BHz00vOY%2BBh3anPfxS1V5YjMs4bl7BeblinVbnRbF2YFYZDGDvTj0%2B3xvNu68fFSJO8R%2BW9OJ4S0x45kay4cYs8ciRfcm7uEJjVfgaWQIBVfT5fDjzExvGmmWF8bXm1XnFG7fTRRBvOyTQd8HY4i4v3QDuYPJovwMpw%3D%3D&X-Amz-Signature=9c6d8514057836cac1c91dfbaef89156a63ab978f98c1232c81b6f42d7a147ff&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/opening-a-wise-account",
        },
        {
          id: 5,
          title: "شارژ حساب وایز",
          description: "شارژ حساب Wise با امنیت کامل",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/18-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQV4MGD6RT%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115601Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiAxAnU%2Fzq6vOdxIr%2Fm8KmGdDk6Jyf%2BJbpO7DMO%2FZVI8VQIgcZrtV76RXmfk0%2BaEDSgsam2i9XJn1Y7H985GIBDza14q1gIILRAAGgwzMTEzNzYxMjAyMjUiDK5QlZc8kOHzJ4J%2FkyqzAs5GJXQC3JqjqEPYtjJzcgnjRv4DlsYp91CE3BWGGKnGc5I6nYS84pLPCzpQCqFwnnrvmFH85b0VMKsSJUK8LP4GThNaClDk1eNvBMFelVoitpkQN4ixgEhmR6a5aiY45ldbMHG%2BxpKFsb0ZNQvdhJSlyViON5NdbsiwMa6l9QL7z8Tz%2BL3kYZYgPsPcV6KVBp8Tr9%2F3UG3mu3fzdiXZea2rV3fZ1Y2%2BX1dsmuiNs7%2F45jwo7aj1a3c04c7rjx2wrx%2B%2BnYvz1%2FCAun%2BY3Elhuoi9InJC%2BeLLiPpgm8vKagyPYJ6oo8TYfnvF%2FK43oz4T3NcrYNWtEdNobstThx3hKKiDo7bsyR6OH1Hs1xTL6q3xz6ry04UJeqpapzzq8lKppGJLngdLrzxCi3A%2Baa%2B1fO8ZoGkwkvKtxwY6rgLj%2Fxa4KhlV8MuN7VENGJLPpYKoIAKMsRnr98zDPRqcBWfB7swK%2Fd9k5f85NBaL6HKra%2FkBOlIlcppfqrIjot9%2FKSwqfMAWvTn1RtBXk5a0jbwMYVVVL9uCvSxly40Ep1O1Njb%2FBJfm5TZwykycZeSZzoP4sofS0xPaLaEGrAl2vY4faWEbqV6ljONm6whMzh%2Fw7uQOlfYnCZxrtmy%2F6FiukhmZBgoTcCCqxVLXeDLLc5eblSx7ydx3tqZV5mBt%2FzGiGnVYGu5OdMadc7xBPcSFR931LzZqZSnwwH1PFJiaOSSrTUqFfp64tpwFZdIRgFJ1ZE6gzPAiEYfYr5fZrVCqO%2FIao2d7kOx9oxm%2B%2BV5qgPJJADjJm%2F857FoqEB%2FRLfagc%2BNZrTUH5qwjIyTl4w%3D%3D&X-Amz-Signature=3749151d34b240246025013f59e2edbe66c25f3f8fa12da3a9ef24a493216a40&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/charge-wise-account",
        },
        {
          id: 6,
          title: "نقد حساب وایز",
          description: "نقد کردن موجودی حساب Wise به ریال",
          image:
            "https://arziplus.s3.eu-north-1.amazonaws.com/1/51-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQZ6AUC5CG%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115738Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiBOeXid%2BF72KmgaoKlD%2FnP4gVpes92hQsVdFiwwA2S2EgIhAPm3qbrtU0HFRYbM9CrtlFS0RgXVDetfM7wHpNTVrQkdKtYCCC0QABoMMzExMzc2MTIwMjI1IgyyZkk1z27b5FIZgH8qswL7qt5%2FQu2MUhaIhTo0uOUTCn%2FYfQzHS0PCSFBVSpbGyQi7le%2BqW%2FO3KRjWwT%2F22OjBuLPilb0zAtaRL8GMNm1ZlKKU4ncye6uUrxnodE0XKlkg1%2BHBVqwZ%2BgbESIQn2GoLZM3PXf8WvljRZ21xJgHFa7b0RWLZiqSWW7gsLyN%2Bq9OXK5neZNwI4ooI%2FOShl%2F%2BQ1Kh9R5jWhf4Yh2skujXC8KgSac9TWP%2BgaMI9pTLKYiFo7EEX98hh68xaPp8vIukBXFaVkf%2FzbUmOe%2FAdtL7%2FSiPM9pyIVryDydaW0Xy8QTouFs7uhj7Cz3%2FRRGETpvRQe1ny9VpUTaFjt6a6JwHuy5Rurlc7EsCbOttUpgbpoe7gYau6X4jTpo9hkBUpQkzLybkZ%2FcR9DJy4RretC3CXs40KMJLyrccGOq0Cn6h1Irdgbj0aUn29hW2IFwWXywpzAjkHmMD8brASS1R3XzddarpNgH6xJNvmr5Th5IuJzNzh8d5ntDKWLUUIsb5GfwclsUlLO%2FV5B11p0LaXSg8viHkZCv8aIKhw9ySWbpYO4Gzh1VXkKVWj9de%2FODzIs2eebiZqO9AyB277WgexSjRFBrDr14ftZFuZLxIuDS9x9M85G1arPqqomjp%2FvnKxKicpNGAHb%2Bl7%2BdhTfQwXTEiA5uK4Ati2Woh2SeSi2C5lNbS7o3pQOm99a5cSAqWMufm4JUpynBXSsZBD6Fap0Jd1hPwElslb5fUCTxeOuw0zV4m%2B1VqaBZ9mj0ejn6Aw913oYnIZ6Nvb6jPMQMUFQsOo%2FHwibySzasUwojwtCUg7pniLK8ZtF4dwsQ%3D%3D&X-Amz-Signature=8467bb277c65a0549afe2266dc1951a15d1cf0abbcebf6200e324abaf0fcdcd8&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/cashing-out-wise-account",
        },
      ],
    },
    {
      title: "خدمات پرداخت بین المللی",
      services: [
        {
          id: 7,
          title: "اکانت ChatGPT Plus",
          description: "خرید اشتراک اکانت ChatGPT Plus",
          image: "https://arziplus.s3.eu-north-1.amazonaws.com/1/21-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2VVNAKYD%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115950Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiAx4wIB5z3GjjX5vdqxnORtLOBb4nVbfnePD3nR6Q9%2FTAIhAJB1c9lY%2BCFawsHirUIsEWpxbZl%2BTYS0qQHyuGAlmi9VKtYCCC0QABoMMzExMzc2MTIwMjI1IgyNGv5iHubq8rlX0LgqswLmOOdts%2FpRAyelLejVG34V5brtcIoou3mur8m30GUX6r2vUZqtxQ%2FfLdT6awY83f3IvR9I9GTvzLvJ2Yw2xTkhJ7kYT0RTqub9cEnaoDEXD1xmYvBGyTZ3fI4iJ%2Bqi7L76RO5F51ZozMW3N8BZ7sJYXe1y5al8eM4XjF1UOBgiYLnNtpaQ0pjs5B6oeILqYcujxnqFjj9Hl%2Bz99cQ3H4Mbwgp%2FQN0nbX5kUbI8CHyELjfXsa%2BTHhsDPCnefTZ2B3z5jdV%2FF%2FmAqVqYmVtRMW%2FNhATADJuvgif3biowD1p0WYNKhcI3NSFNRmzXyNAirKw%2BUltrNqNdWfP81LmPfD7KZckVDiufVhsgTHCbbQxwpiWqI4n48huirFFXLbn4Q9%2BXlphd5Ht4bHiDkYXqBQqH6JTrMJLyrccGOq0C7kWvyX4w%2FyyylIrf5VDVvCkc6jzWAE6ws5w9f78Cy4a2H%2BUqpkCSvkI4StZYoI5v%2FXcTWD6aPIKXDi9W1%2FPp%2BwVOVwxM7VBi5fyeIz4k73k6a3WGf8FRo6qB9eschp8aq2mfjumUjbDipgYjNqPREjXGnCbXudMSexS5iuH%2FVLCaKNFEGQVa0wrJplv%2Bz5lrrGwULIRjvtNPPxx4%2Fh6Rnyk6begk4gDBF5unbJUhijnTZvKGG8WSdOBtTvAN1GfS4Fkllrr%2FqJYH60cIcdNijHXdKg%2BsC1sj5WI6o2TZBSoAX%2BCA9H%2B7TtOBxVtXvaIiTBKqXu4SdWgZlUJBRBT1ZNTxkhOMGI9o46ttkYWJjSdc%2B2fLPdhqxevrrXsE0ZgMsnH%2B1nVS4%2BfYd8QLCw%3D%3D&X-Amz-Signature=926fcbf2f0c646dee510f956c92c7c781348d759c4a56ecb438c81052bcf134d&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          href: "/buy-chatgpt-plus",
        },
        {
          id: 8,
          title: "اکانت Claude AI",
          description: "خرید اشتراک Claude AI",
          image: "/assets/images/claude.png",
          href: "/buy-Claude",
        },
        {
          id: 9,
          title: "اکانت Midjourney",
          description: "خرید اشتراک Midjourney برای تولید تصاویر AI",
          image: "/assets/images/midjourney.png",
          href: "/buy-Midjourney",
        },
        {
          id: 10,
          title: "آزمون زبان تافل",
          description: "ثبت نام و پرداخت آزمون TOEFL",
          image: "/assets/images/toefl.png",
          href: "/toeflPayment",
        },
        {
          id: 11,
          title: "آزمون زبان آیلتس",
          description: "ثبت نام و پرداخت آزمون IELTS",
          image: "/assets/images/ielts.png",
          href: "/IeltsPayment",
        },
        {
          id: 12,
          title: "آزمون GRE",
          description: "ثبت نام و پرداخت آزمون GRE",
          image: "/assets/images/gre.png",
          href: "/grePayment",
        },
        {
          id: 13,
          title: "سفارت آمریکا",
          description: "پرداخت هزینه ویزای آمریکا",
          image: "/assets/images/usa-embassy.png",
          href: "/Paying-for-the-American-Embassy",
        },
        {
          id: 14,
          title: "پرداخت Booking.com",
          description: "رزرو هتل از Booking.com",
          image: "/assets/images/booking.png",
          href: "/buy-booking",
        },
        {
          id: 15,
          title: "شهریه دانشگاه خارجی",
          description: "پرداخت شهریه دانشگاه های خارجی",
          image: "/assets/images/university.png",
          href: "/Paying-tuition-fees-at-a-foreign-university",
        },
        {
          id: 16,
          title: "هاستینگر (Hostinger)",
          description: "پرداخت هاستینگ Hostinger",
          image: "/assets/images/hostinger.png",
          href: "/HostingerHostingPayment",
        },
      ],
    },
    {
      title: "خدمات احراز هویت بین المللی",
      services: [
        {
          id: 17,
          title: "سیم کارت مالزی",
          description: "خرید سیم کارت فیزیکی مالزی",
          image: "/assets/images/malaysia-sim.png",
          href: "/MalaysianSimCard",
        },
        {
          id: 18,
          title: "سیم کارت انگلیس",
          description: "خرید سیم کارت فیزیکی انگلیس",
          image: "/assets/images/uk-sim.png",
          href: "/EnglishSimCard",
        },
        {
          id: 19,
          title: "افتتاح حساب آپورک",
          description: "افتتاح حساب Upwork برای فریلنسری",
          image: "/assets/images/upwork.png",
          href: "/opening-a-Upwork-account",
        },
        {
          id: 20,
          title: "مدارک تایید آدرس",
          description: "تهیه مدارک تایید آدرس بین المللی",
          image: "/assets/images/address-verification.png",
          href: "/AddressVerificationDocuments",
        },
      ],
    },
    {
      title: "خرید از سایت های خارجی",
      services: [
        {
          id: 21,
          title: "خرید از آمازون",
          description: "خرید از Amazon با پرداخت آسان",
          image: "/assets/images/amazon.png",
          href: "/amazon-shopping",
        },
        {
          id: 22,
          title: "خرید از eBay",
          description: "خرید از eBay با بهترین قیمت",
          image: "/assets/images/ebay.png",
          href: "/ebay-shopping",
        },
        {
          id: 23,
          title: "خرید از AliExpress",
          description: "خرید از AliExpress با پرداخت آسان",
          image: "/assets/images/aliexpress.png",
          href: "/aliexpress-shopping",
        },
        {
          id: 24,
          title: "خرید از Etsy",
          description: "خرید محصولات دست ساز از Etsy",
          image: "/assets/images/etsy.png",
          href: "/etsy-shopping",
        },
        {
          id: 25,
          title: "خرید از Walmart",
          description: "خرید از Walmart آمریکا",
          image: "/assets/images/walmart.png",
          href: "/walmart-shopping",
        },
        {
          id: 26,
          title: "خرید از Best Buy",
          description: "خرید لوازم الکترونیکی از Best Buy",
          image: "/assets/images/bestbuy.png",
          href: "/electronics-shopping",
        },
      ],
    },
    {
      title: "اشتراک نرم افزارها",
      services: [
        {
          id: 27,
          title: "اشتراک Netflix",
          description: "پرداخت اشتراک Netflix",
          image: "/assets/images/netflix.png",
          href: "/streaming-subscription",
        },
        {
          id: 28,
          title: "اشتراک Adobe Creative",
          description: "پرداخت اشتراک Adobe Photoshop و Illustrator",
          image: "/assets/images/adobe.png",
          href: "/adobe-subscription",
        },
        {
          id: 29,
          title: "اشتراک Microsoft Office",
          description: "پرداخت اشتراک Office 365",
          image: "/assets/images/office.png",
          href: "/microsoft-subscription",
        },
        {
          id: 30,
          title: "اشتراک Canva Pro",
          description: "پرداخت اشتراک Canva Pro",
          image: "/assets/images/canva.png",
          href: "/design-tools-subscription",
        },
        {
          id: 31,
          title: "اشتراک Zoom Pro",
          description: "پرداخت اشتراک Zoom Pro",
          image: "/assets/images/zoom.png",
          href: "/video-conference-subscription",
        },
        {
          id: 32,
          title: "اشتراک Dropbox",
          description: "پرداخت اشتراک Dropbox",
          image: "/assets/images/dropbox.png",
          href: "/cloud-storage-subscription",
        },
        {
          id: 33,
          title: "اشتراک Figma",
          description: "پرداخت اشتراک Figma",
          image: "/assets/images/figma.png",
          href: "/design-software-subscription",
        },
        {
          id: 34,
          title: "اشتراک GitHub",
          description: "پرداخت اشتراک GitHub Pro",
          image: "/assets/images/github.png",
          href: "/developer-tools-subscription",
        },
      ],
    },
    {
      title: "سایر خدمات",
      services: [
        {
          id: 35,
          title: "خرید VPS و سرور",
          description: "خرید VPS و سرور مجازی",
          image: "/assets/images/vps.png",
          href: "/vps-purchase",
        },
        {
          id: 36,
          title: "خرید بازی Steam",
          description: "خرید بازی از Steam",
          image: "/assets/images/steam.png",
          href: "/gaming-purchase",
        },
        {
          id: 37,
          title: "خرید گیفت کارت",
          description: "خرید گیفت کارت آمازون و گوگل پلی",
          image: "/assets/images/giftcard.png",
          href: "/gift-card-purchase",
        },
        {
          id: 38,
          title: "پرداخت Google Ads",
          description: "پرداخت تبلیغات گوگل",
          image: "/assets/images/ads.png",
          href: "/ads-payment",
        },
        {
          id: 39,
          title: "خرید کتاب الکترونیکی",
          description: "خرید کتاب از Amazon Kindle",
          image: "/assets/images/ebook.png",
          href: "/ebook-purchase",
        },
        {
          id: 40,
          title: "خرید بلیط هواپیما",
          description: "خرید بلیط هواپیما بین المللی",
          image: "/assets/images/flight.png",
          href: "/flight-booking",
        },
        {
          id: 41,
          title: "پرداخت دوره های آنلاین",
          description: "پرداخت دوره های Coursera و Udemy",
          image: "/assets/images/coursera.png",
          href: "/online-courses-payment",
        },
        {
          id: 42,
          title: "خرید کریپتو کارنسی",
          description: "خرید و فروش ارزهای دیجیتال",
          image: "/assets/images/crypto.png",
          href: "/crypto-purchase",
        },
      ],
    },
  ];

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <HeroSection
        heading="ارزی پلاس - پرداخت های بین المللی"
        subheading="خدمات ارزی معتبر"
        description="با ارزی پلاس، تمام پرداخت های بین المللی خود را به راحتی انجام دهید. از افتتاح حساب پی پال تا خرید از سایت های خارجی، ما همراه شما هستیم."
        buttons={[
          {
            text: "شروع کنید",
            href: "/register",
            variant: "primary",
            icon: <FaRocket />,
          },
          {
            text: "مشاوره رایگان",
            href: "/contact",
            variant: "outline",
            icon: <FaShieldAlt />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/logoArzi.webp",
          alt: "ارزی پلاس",
          width: 600,
          height: 600,
        }}
        theme={{
          headingColor: "text-white",
          subheadingColor: "text-[#FF7A00]",
          descriptionColor: "text-[#A0A0A0]",
          backgroundColor: "#0A1D37",
          featuresColor: "text-gray-500",
        }}
        features={[
          { text: "پرداخت امن و سریع", icon: <FaShieldAlt /> },
          { text: "پشتیبانی 24/7", icon: <FaGlobe /> },
          { text: "بهترین نرخ ارز", icon: <FaRocket /> },
        ]}
      />

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1D37] mb-6">
              خدمات ارزی پلاس
            </h2>
            <p className="text-[#A0A0A0] text-lg max-w-3xl mx-auto">
              مجموعه کاملی از خدمات پرداخت بین المللی برای تمام نیازهای شما
            </p>
          </div>

          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h3 className="text-2xl font-bold text-[#FF7A00] mb-8 text-center">
                {category.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-2">
                {category.services.map((service) => (
                  <Link
                    key={service.id}
                    href={service.href}
                    className="group bg-white/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#FF7A00]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="relative mb-4">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={300}
                        height={200}
                        className="w-1/2 h-1/2 mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <h4 className="text-[#0A1D37] font-bold text-center text-xs mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">
                      {service.title}
                    </h4>

                    <p className="text-[#A0A0A0] text-[10px] leading-relaxed  text-center transition-colors duration-300">
                      {service.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-16">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-2xl font-bold hover:scale-105 transition-transform duration-300"
            >
              <FaGlobe />
              مشاهده تمام خدمات
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
