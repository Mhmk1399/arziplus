"use client";

import HeroSection from "../global/heroSection";
import { FaRocket, FaGlobe, FaShieldAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
  const serviceCategories = [
  {
      title: "خدمات بانکی بین المللی",
      subcategories: [
        {
          name: "خدمات پی پال",
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
          ],
        },
        {
          name: "خدمات حساب وایز",
          services: [
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
      ],
    },
    {
      title: "خدمات پرداخت بین المللی",
      subcategories: [
        {
          name: "اکانت هوش مصنوعی",
          services: [
            {
              id: 7,
              title: "اکانت ChatGPT Plus",
              description: "خرید اشتراک اکانت ChatGPT Plus",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/21-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2VVNAKYD%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T115950Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiAx4wIB5z3GjjX5vdqxnORtLOBb4nVbfnePD3nR6Q9%2FTAIhAJB1c9lY%2BCFawsHirUIsEWpxbZl%2BTYS0qQHyuGAlmi9VKtYCCC0QABoMMzExMzc2MTIwMjI1IgyNGv5iHubq8rlX0LgqswLmOOdts%2FpRAyelLejVG34V5brtcIoou3mur8m30GUX6r2vUZqtxQ%2FfLdT6awY83f3IvR9I9GTvzLvJ2Yw2xTkhJ7kYT0RTqub9cEnaoDEXD1xmYvBGyTZ3fI4iJ%2Bqi7L76RO5F51ZozMW3N8BZ7sJYXe1y5al8eM4XjF1UOBgiYLnNtpaQ0pjs5B6oeILqYcujxnqFjj9Hl%2Bz99cQ3H4Mbwgp%2FQN0nbX5kUbI8CHyELjfXsa%2BTHhsDPCnefTZ2B3z5jdV%2FF%2FmAqVqYmVtRMW%2FNhATADJuvgif3biowD1p0WYNKhcI3NSFNRmzXyNAirKw%2BUltrNqNdWfP81LmPfD7KZckVDiufVhsgTHCbbQxwpiWqI4n48huirFFXLbn4Q9%2BXlphd5Ht4bHiDkYXqBQqH6JTrMJLyrccGOq0C7kWvyX4w%2FyyylIrf5VDVvCkc6jzWAE6ws5w9f78Cy4a2H%2BUqpkCSvkI4StZYoI5v%2FXcTWD6aPIKXDi9W1%2FPp%2BwVOVwxM7VBi5fyeIz4k73k6a3WGf8FRo6qB9eschp8aq2mfjumUjbDipgYjNqPREjXGnCbXudMSexS5iuH%2FVLCaKNFEGQVa0wrJplv%2Bz5lrrGwULIRjvtNPPxx4%2Fh6Rnyk6begk4gDBF5unbJUhijnTZvKGG8WSdOBtTvAN1GfS4Fkllrr%2FqJYH60cIcdNijHXdKg%2BsC1sj5WI6o2TZBSoAX%2BCA9H%2B7TtOBxVtXvaIiTBKqXu4SdWgZlUJBRBT1ZNTxkhOMGI9o46ttkYWJjSdc%2B2fLPdhqxevrrXsE0ZgMsnH%2B1nVS4%2BfYd8QLCw%3D%3D&X-Amz-Signature=926fcbf2f0c646dee510f956c92c7c781348d759c4a56ecb438c81052bcf134d&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-chatgpt-plus",
            },
            {
              id: 8,
              title: "اکانت Claude AI",
              description: "خرید اشتراک اکانت هوش مصنوعی Claude AI",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/22-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ4FLNFVCL%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120130Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiBclRIifTTE8Fk8Rs1mxEJ9ml3itTAljlNvNkvoIuK8AgIhAKFP1K%2FUICUTTmUsG7aIt%2FKprVAliTRz5VIzL0frEqTzKtYCCC0QABoMMzExMzc2MTIwMjI1Igx2Kihe6gGezDaQz1MqswLZP2SW1wNs6y%2Fs7YFd77IDxczFjSEsnGoCglsNHjQwHSbpgXFQz95UT%2F64YMmOnU32t4FqfhMT%2BKLmJgIHm6RwibqV91StqHMJcKr9dUmjrIu6tYA%2B3AbAiAW5jyIsl7AXAlaLWN3y5gqUa8lolqI%2FE1W6bHQAMDOkzQJAa1WSiOQVW3azWcHfPEvVLpCuutqKeFrUMpllw51rdxluDDowau6S3NkoX4Sk65voCMwWCfne13sqAWMP9fAHwNm90wHxwxrz5eI8nNyA1P6cb7xCBRepYmoL8eGsyXfVLE2Hig5nP%2FyfpwBlj6ObjGGeTQCNoX9J5jE4O%2FfzDumOmPQB%2BnpLZNJ169yBi81uT47q6hy60tR6PkKiS7E0JtQ9vAbYhb%2F5kKpKuCvs4%2F%2Fw5ZVcbEjVMJLyrccGOq0CC2UpqkH985fRL28s%2FJp00ptD2zdyKh%2Bar5Tav%2BeKmxf6DQdcP%2B17GqvhWc9GVV%2BH2tWpAYcTQ%2FPWlL5YQZgxd7W1%2FbvWo0mU0Bz1MpWaLT6V%2BpXA3cbU%2BPgcS1sDIzWTjmzqkq8%2FWRfFGoDRiHtARNxBDAsZwAU5FAeJLWDKVUHnbH5U5qks9q36DiEa5TmfC9jueJsiKpqsae8fcoPYww6yoi%2FMsXHJgvtvVfRuSm7fMhl%2BNsmFI0dYvvhT9oRtdBKDT%2BFgA7kFs64R13Sdvk%2B7Iwvn138i5uYokgnE5PZlVqjLBnBijxhya1Ynz5bbqZib43Tt6mS7mViusFBikVA1xaM4rliCdmBMAe366hEpjgfCBSs3iWRE0IcJIE2m8%2BckdNmCYCY5SuyMoA%3D%3D&X-Amz-Signature=3e7c37b6008281fededfd98b89dbe0590f8c1a456ad458cbfa6bc77713b35851&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-Claude",
            },
            {
              id: 9,
              title: "اکانت Midjourney",
              description: "خرید اشتراک Midjourney برای تولید تصاویر AI",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/23-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQSZIUIUQJ%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120317Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA6bSSoqMiq5tWOYNP6bEMlTnKGp2pQjfQsE5JIQHb2hYCIHTXNGX0SZjc0i3gJzflLCbUVICCr4nKRr%2FZQRlM%2FJTQKtYCCC0QABoMMzExMzc2MTIwMjI1IgxxhTFP8Al2e7RjdSYqswLeYS5%2Bl9Klt7e6ZbaKGKt1GiJ611K4yBCBVrH6ZJaMT9V3BjbtZTDHwZpCGHyUXTa8GChp%2Bg1NSDT0EI0bzaQcME9u8Ueqc5%2FE99kI%2BDanKQALUCIlogKtuHNdFOZkjbwa4uHvEp3JJKrXPRU82EPF%2Fh2Qzf84PraAjWq4MA8ypWSjHgCV9%2BWSYxGc%2FPJVu3nsUMFxbrVUBHv4pjnPTyGB%2F6sADXdK0MXJgsgCev6ItgBJ88VV4iTWUn50SuD0u0FZyucPlRFt9MRjP6XLFzsH1RJfPK5f2OMzutOJPcwjHx8yGIOZCzFclaYUabmIym1SQl%2BJs6tHojg6FZGeF0YIfOFy6k3zZCNnVKUIcImvvmuGLdzOGAgbYzxose63ITxXuseUR6zM23RZLD4itbcfvKsnMJLyrccGOq0CvFXAUHLvcBUymlv6I152iYbrkSa3G13RMpZui5wTfBCGU10exbn0A7qiFlo3GaF%2F37EI6WR%2FCq4dyDf9oiS8Fku4K6r0UtmENYEZYm6eDDdbBstLIvrfBL0imFAdP5%2FTKtPJF7dGA%2BW2mVtgRO0Q7WJAZ5PCsqGDc3hgOa5%2BkAJH0nu0EksD7tQAbhEJLkEGwmE0ov8L%2B1I6hj03iJ%2BBDh8UamW%2Fn0SPBPT1OZMTsdoiwbVb%2B3fJ%2Fh3k3rJ2nmboVhfSsEA%2Ftg5%2FQmYzC8J81vTXfH2zlH%2FCP79W64ShbkJcgTFnI%2F23qH3DBqks2KV%2Bjp5o%2BD%2BNhfXCES40wDriXTwamu3BGGnDtzM8QXP8OyzEHjd4dcKdfm8SWUhhDcTae2WVhekaAD%2F%2BRye68g%3D%3D&X-Amz-Signature=14a2a89f571bd79f9618533508993c5d6730d2a80276df39829db3c3cb7e8390&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-Midjourney",
            },
            {
              id: 10,
              title: "خرید اکانت D-ID",
              description: "خرید اکانت D-ID — خالق ویدیوهای حرفه‌ای",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/24-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQU3ODPC5I%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120341Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA%2BLbLVNH0F8XEapsD6xbhNZ%2FbRgX5BOIJTqr9WJatreQCIEvScxGHVl6lBDZ69FSS6rRwLO4tls94SZn4uE7O%2FO5WKtYCCC0QABoMMzExMzc2MTIwMjI1IgzOGQhK8bz1F9xpygMqswK5EkpTqLSExf7eo0i%2BZhbopVyC7vXdj6BkHZoY8wttgSWNSsmrvFEAnCExwg36bWz2GDTmcqZhFMOsdC4%2B8%2FaVAwlZAATdVJ6E1vl36CJMwESQckrlf1ynK9BHdWwZdflyeR4DOR%2BXJ3JWEw5ko9AM7a4vwDdyXDLDVYSnDHsPFNuUoh5Ccd06U9IjWD2mgvPsqymYrn0CBe79Z%2Btjbm6bEAgG5T3iPJPlHEpGbZYzzNm6y3aGW6Fb%2FeKlxj6VSzkgSknMA8VhnRV7O8XmhOHHRO8yhV1U%2Bai2lwVVr6kAmN%2ByffvCBBFupsEnd9JBV7lWxUU6oHsmCac6Sfwx868xocX41TqNeqidXuPMwThyNaXTMedk%2BPuM3%2FjhopuG%2BY9UYmpzLJ00lwvhsnJTj2wG3ay3MJLyrccGOq0CCemFDsyAtli9eRLuzH1WW7S9FF66LaFKAsTMDtqJP2pvWUk9Ez7zZNYL1gLqrESIFt6qQq29v2sMAhJDU6Ziu1Hp1MvywQRjz9TeEyFgq%2BH%2FBI7gAdWLihTRyTpnxqgSwb%2FacdElZq3wv79sGIzG5%2Bua%2BnYoMAlvtjrsVfXklJTDl3svx9YyLx7Z9YCuOhtBn1ZYXCFtjXvVi6Xv5sBEUVDf9CJELNOl2hRS9sV8T%2FHSGm5ATMCU3EnFR%2BUUSoMNEjUwEuEUhpS50tQ3zX3X2mqnb1AXxu194i%2B9qP64xJrbkKTH%2Bn%2BtAI7jzbM%2FF19Pm8%2F5QyH5roU8Z8mOn62%2FXqhXOh3yZJtteW6RqsUsIP57pQDHtUeaOyS8DScS2n%2FbOvGe0qjMD1HJZsS4VQ%3D%3D&X-Amz-Signature=f35fca438e44e286a1735369b6e119b952e0bea66405e599e95628c6834f5121&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-D-ID",
            },
            {
              id: 11,
              title: "خرید اکانت DALL-E",
              description: "خرید اکانت DALL-E — خالق تصاویر حرفه‌ای",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/25-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQR3WS6DNO%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120624Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiBIt1qMkXgkMh54%2FWRB43%2FHAh9uJgJVbnb7lS6UylbNvgIhAOd9agGL768jlK2yNtfk2SzvI%2FG2HWDR2bh36InRR1aQKtYCCC0QABoMMzExMzc2MTIwMjI1IgxjN%2BnV%2FN6dxJYQzMoqswKP3ohIRfjPi3WGBQ0VJH5EM53ESZRLNo1Tftus%2Bd7yDkBuhVL0LWTQR88yrv5014k11J6YtasapMCvIfc1HK6XYBqBEibNAU7CKgyZd96p5NxyqhsXuPJ8ilQ5iMNAyTGpK5T%2F%2BpOkhH6sDrhsm7XCYUo9fWF3Scb%2FOfYK9FiUgHzxWPSREw%2BtpPXMWrcvrdk6y4jX1XCZJV4CLpbxIsphKg0ROg3V27NhhcKoZPmnXULNk3%2BM5Ya5vc5StlgTuEkU%2F%2FbtRB0saNZP6x6JcATObMIvNulVgz3S5GZfmjC52zMaVVBjmT5ydSal1SOfuUuyoNGhaG33Qw5YaVMb3A3YuWtZD2GSmltxluVXCx8SaWDKvr0nxHyMFsOEidsDWCczw0D09Jw5JrQzSzgTrH7sxYNjMJLyrccGOq0CoDhZZfIrxdKaNiUwT%2FPFokBh8MGf4ROsYW%2FfrEkMqnUTBKR%2BMLVMxAi%2FBJeSV3G3evb1iPKBS45HYMSthObxCJ5%2FEZY%2BK8S6toFGVqp5pmNIv48jR4weA0tU4rdvPJ%2F3V%2F%2BtfpQsx2pKBzueSL%2BL8R%2FxcOU7mq3wNVnE0Gzeuo4MIyCpOWSyXIbuvphs1EMAbmWujC75pP%2Bw6mAMDvcJ5ryCUXBJbA0s1I1wk7zWuITesTpnbt5jz7Q28SwOC%2BhKA%2Flrt88hgXS%2FEQIO1bwUzuqtD4rJ51ivJcZBcP%2F9%2BFLAZ4kF68OKYrvqGOmLDXadr7YS%2BWkK1iJZi2aiFKkWEgCxP%2F1hgn8SmB9JCos9nWFfokmrO%2FW%2FOgzPYArkWh0DM316Ez7Iij7RgY1ZBQ%3D%3D&X-Amz-Signature=8d249ad5195af80918de9e45dfd62f5b26d27f11d7c9be2646a26ef5917a1981&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-DALL-E",
            },
          ],
        },
        {
          name: "آزمون بین‌المللی",
          services: [
            {
              id: 12,
              title: "آزمون زبان تافل",
              description: "ثبت نام و پرداخت آزمون TOEFL در ایران",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/26-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQX4JS7YML%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120717Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA5LxNMTjPZtxvF2jCpTcxTfzdpC%2BFUzMDXEfzKorIJs8CICYUqXaIJ6xSyc4KJSwWJP62T9y3D0dZSgRPMaWXQswYKtYCCC0QABoMMzExMzc2MTIwMjI1IgwkOmuXzGYXcLxzUy0qswIo0oUSgK7kAh7MBPOrns3WjdWWUyIyTJlTbZPaXecaYs0x5im%2Fm0TbrynZPUjTPB9lZUgNo3BJHXOdHuXrDk0XeaITgoyVXl%2BjmGvgDX442g0x3Pil2lZtzpKDfmwUmwcLTBJPSXx4Q7JQ7iSTBvZwz2N3aibu0L9I1q02TSnzANFDfe24rjiQN5862JsUxUWyXlRObAEKV%2BCA7U%2BgYAxCMiENom97I97Nbqr%2BLQ%2B4r9V4iqPIpgz7q2i%2Buc7ykosnEPXpGsLnOeGykNQaQWFteclKp62CQ6W0AqkMIO8bhlU8W504UPqhhp8awUa3oPazkJp9aRimTQ5xwvPBlC%2Bm1UIk%2FA7vyu67H%2FybtSn%2F9yVc1mm7TEByq6QJqsYPTsHmR58mPtnfwwJUNrMq9fh4rzTNMJLyrccGOq0Cb%2B4JRMaKD73kTtI6TeysWXP4%2FtEPckAbkKmhHZ7Fd39y6bNZqal1pQmP9yO0JtOhJV8bCaaGZ%2FOeWr8WBK8uNCTatzpiQ7LZd5JUQ0oC2aTqhEqgRipsFXm%2Fydkk5j6GQaWu7B26wNET16gS%2B5r5ViqYB7fGUZjG0yFQg9uy6qlmFA1niXam65sZxClGWNCnu5b4StinzdYYjac2PJ39zwZ4sE5G88clFL6gUWWzdYLeYDeekz6fPQc2%2Fknmrom%2BiZVUQmCHjHkUPd0vOXbUiOl1gcYfMkYicGt7zbQSXSBscLQi%2FmkaEak55Tpk0w43HvEKw6FzzB0nihJwRS0Dw0ujt%2FPlVBvS3kP4bTy%2B5RpmpUZQOiuP6rKq37bOiLrkRYJlZOOfJdobqbWksw%3D%3D&X-Amz-Signature=b40b0f81b2e178691d41600c6dd45200e6eb01eb3216906f5f4147e126bd6760&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/toeflPayment",
            },
            {
              id: 13,
              title: "آزمون زبان آیلتس",
              description: "ثبت نام و پرداخت آزمون IELTS در ایران",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/27-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ6T7RWM53%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120812Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEAx1cz6lKWZDvrPIEGH8I3ofmhAOa5O7lThCKz8ZmQGQ4CIB0oJmQcjuievJCFXxeFGIrqS1fq9wt48adKtSRucbZIKtYCCC0QABoMMzExMzc2MTIwMjI1IgzEUIL7in1C4F0Z76kqswKqSzi9hGUFT9tRdQXbUjkFFRtGNPTxUFpSbpB9y%2B%2F%2BI7Eqfbw%2FDVrXmfPpJ2MPmK1ksYx08m8JKI74P2Lbtc6awK4tQHX%2BrsnWkDmzWaJOFShQtqJRA%2BEJHCSXJ4t1qIaVnzKsTOkVoCOvcstMiY%2BAbBhc5lz2VSO7MrRaQJ0PrDoGHdc5ycrsmQ32BY12GaXRpOTUv4gIfhEyBpqnToFxCb049WjwVk6KSEGQAqRpC%2BW5VLNb4vx%2BdDWjjN6UCOFlqenkQE3ktzHfrmX0tjIYvu%2BSd4CXZQ%2FcwV3nXseLrXYcwwiqnuYHEgjfQWlatYuYF0YlWx8RyTICUVDIdZU1zPfVQNv92u7X9Ij4RRHADogXhR52gGSg4JSyr9%2B4JEMRemt62fZ0qOWdX6%2FA3Np4E4%2FgMJLyrccGOq0C3WBEiTgt%2FhA6BZ6CY3aVw2BWD%2FYIeY8PReUICTtv%2FmfQ4Kdf6%2BOQ5ya%2FYvIXzzc3CKpJsb7ldhYedrGvK0rz1YMNRvZXHs13kC5d5CLUdLryuYdt0kDWTYkxuo%2FEhCund29nkBiP56bbS4vWIi9y26reeX93qBPBRuMoGe%2BxCsf9rLFMWrg2184Q3JlZrrc3yJJDKAWVBMXT4OheEW7f5wVpU7zbX5t2pxlzjuF0H9kiNyy2aucpi0%2FU3M14rHsCU1IANsW%2BRin8GGkgHt%2FVxiRiPTQ%2BdhNCY%2FFJEva6nLry%2BER5UERvkjx6z4sqZXawz7QRSvzpH3M%2BRoHJsojpIfvYTUrrekziowU%2Fq%2FvmhTjHhY6j6HUWK274ibl61sXgLFcCo8%2Fu7qwnTvd4ww%3D%3D&X-Amz-Signature=931a8b3b694811f69755dae76426c4ced4a1e1e95381dee5d351a231094da3bf&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/IeltsPayment",
            },
            {
              id: 14,
              title: "پرداخت آزمون Duolingo",
              description: "پرداخت هزینه آزمون Duolingo در ایران",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/28-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2HPXQ7G3%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T120915Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiBwa3gzRK%2BcOE75XOy%2BCh1gIZ%2Fm7AVacfnzXRYUdVaFsQIgcxQ3f7MCefF0a3lmc6pJDwjwLi8hLWCc%2BP9oKBmi0%2BUq1gIILRAAGgwzMTEzNzYxMjAyMjUiDET8Dt1wR0N%2FN%2BlLCSqzAv5HBj6mEPfWJNF7zQMpcwyfUS%2Fl9jiXNQoEx5NA42Yb7RCD6MKcOQmFcPUjQPZ3PVdbBlrWa43kEcebN7G%2BhrdQJSgSl%2FK%2BjLebhYASLUbxEXfIlYDfLK9Vd1lDlpa0nz13GBb6dnvbAdE6nIeOWnZUvgL7vKP644O5C0ZJ14Vuhb4g%2BYpsGgLH8Dec%2BUTHRfn9Y%2BVTmRl4UKQRktl4B4YxBtQvsyrO3kBCvjqbDoxVpie5BE%2F%2FdeXnT50ZwFrH%2BchT5lYpIxxhZtFAOw7EHxzytXlWUvIhVKHMkIk5RinARLQg4fkNnDq8sAPGU5XVwaMWhawM%2FQ81R%2Bg0DhLsoYVDnQUXm9J7KjAlqmtcRFXV0rgzrz4WOvHG1i%2Bm8PQ%2F1PRtOlnU9OVy1Ycqh2Ogm3ZFZwcwkvKtxwY6rgKX3vz15O5%2BMF7JI%2BGNJZIZPUNsq7S%2FoGDvQ1Gf%2F6bUv61LSKvVDya1Ecxqt7g0jtqICy9ipJLaEj49v48ParHw%2FUKS9jgYOm02HBOlQgp%2Fa7oubznYAtDvtyB%2BxtmdL%2Bf9vzH%2FhRtqTQBz9mFQepmQxcmCn9W58UeInw2YpOZ8CLhYkMR0Sv1WLsWKbZgSfYIXU%2FS3bFek4pfiVibO818k8C7MsHPNis2V6kJ5OWByd7pmZ2MCVkuDROhPU6Fy5eoCS7NMtb7ZcEhrYHZBQNW4hFrUCK6l%2BiBejNOxXkRTI4S6QLq%2F%2BLmdK3AKLAAnmsdv02PUzLRc0k5DY0O%2FgEZeMuMW5H%2Br43n8fv8izeydPAnNl41HEkTw8vg%2FBNHrxq8ssr2GpIfhz62ayp0Dxg%3D%3D&X-Amz-Signature=c756abbb9d6c00c8cf6c31e9f468bce97a6e0d178aa841597eec3b5f73e6100c&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/duolingoPayment",
            },
            {
              id: 15,
              title: "آزمون GRE",
              description: "ثبت نام و پرداخت آزمون GRE در ایران",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/29-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQTK7TISPR%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T121105Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEAqtPbhIXlAjnMNPofBYGZtOnNAkWspjYBJTS2qQusZ%2FICIGg1B5zS%2F7MNwB275LvrF4RBKem%2Ffl5WHzjUblzHFUlFKtYCCC0QABoMMzExMzc2MTIwMjI1Igzmz77LnMyYX7gFCQYqswKwk7v4jMcAIkkAamB%2F4gPfNmb7T%2BjF759I89vC07Pu8fpQjJYc8xooDpibOZlvVKMGobYEeMwkYbmLnxWvLOZGWXa2%2FavSE2KwLTTCd1rXnwOBwtub7hXb8qlMJq2ewiJD59uc%2FibbKKzuAsvN58%2BJ9RFFfKpc%2B8KWrgdL%2FkG5OYtLi8TtzwDzzsfaADdnKs3sW1%2FR%2FKLAX%2FkeP2UkVlwOdDiOvuT3KeEBTNDB%2BmmBkqkLgnhO7PA3zYKO91M0s7owY0xzAt1sBeeeZgvNT%2B8UD1BY7sPN%2BFE3XQ%2FwCgpYfZUoXiYswcXq3aobefqBbQQ0fI2N99YovavbgxPOumDeMQ7chzAbnCYQa7cIAnGkI77tbJ%2B5%2FbN6THpr2rP9y9e2AiG1IyGLVhCYu1Hnu%2BHMBD%2BiMJLyrccGOq0CA0k2Q5eyqUfxjmavkWAIb9llMukcPWG0M3V2OkWqw5BOTWaBaeyZvejVJ4IERsy10ggyxoj8zar16tOxjewYPhy722cBsrW%2FghfhyPwQh6mrb3f0xtIT3rGO%2BXRnkZjyK%2FU7sb4R%2Fjt4A6uF4LBcONxZhNlaYZ6XMtGBf4wYUGShr7o4peC54xWrvyyCTepcLYYv2B8e2z0CtyJZjcZT2ff9fYS58zn1rxm928avknqpTZNeynZWDLiDQBgXOviOfEb%2FxUNaw5o3GktM9gUN%2B62tdEXEUwv3UbEWrKZI4SywH8DKPfA4%2FHDpc7pUquCDCv66SFRtpGAxdODKuz3YBjkuH9YLSJUHGd9rVx5oHXvvgdLZ15RQCX6%2By5%2F7SPkPf50L1FDNTYXRMX47kw%3D%3D&X-Amz-Signature=22e835e5cf1ccec89cbf6f1465b222e19c67f9321f96f469012e59e0f592bc44&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/grePayment",
            },
            {
              id: 16,
              title: "پرداخت آزمون پرومتریک",
              description: "پرداخت هزینه آزمون پرومتریک در ایران",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/30-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ5QCHS5VV%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T121232Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAseG67fETpEPYdnuMMWqpYi8K1NQPBskVECTZJcvYlNoCIQDowAa5o5jqcOF9hiATSsfOFTXOcXAR3WhYFalt6p3cSCrWAggtEAAaDDMxMTM3NjEyMDIyNSIMGkBzUyae66sdU4KzKrMCWCQ1jSg1dvOCHruSCIS4lS76VCiFFl8w3zzbyuYrrMfBmj6m51j%2B801U5Unn9oIQAH1shFPaqG1yrImLc5cCzNR05KB6v67QJmlUOMqs6%2BPuAFDgMY1Fn8wxFcVbEtOaBYulWUAy5NGZTFwZz2fvxpICgYnA1ViDBQ2rz4kSQ%2B0jQwyKKgGmngSPUh%2FX3qh3UC3eoKMJ6lfTPrMF1yZeSx2q0c%2FD4p%2FDJKKSOBlavayhjaKFLHExLuwRAvxEVvPDejxTmoJVvBYY19yaimS4rkWekLCrgjEHp50qNeUZKQfhfI8nALBipuZsRtaPnBwsfOilYexcVQPWaXE1JlU1oAFoI5ojj8Yi1yqMD7RifD3x4CfE8z6ygXeCphrnQUMa6c1Mwq4X%2Fwrb%2BU%2F4v99ADFScVzCS8q3HBjqsAitYSQsnhV5wGa1Ley6kUpQ5ofMOOwo0hfnJ6dVmpqzZRJ3I8UvuguvD%2FgY38X%2Fj9ehfAczopzvlHvPkQNbYFcODVj9fnG8DWALNvD8Xv81JfaowG9icN69tCjPuQfHbW002vI%2FCqj5H%2BbOG5Z6cj0cuPdjO9HNM%2BV1SPzQvjwpU4%2FUPULHfkoulJso9q6a5XpFZJ3mPYtMhMhmRjoinBUfgH%2BA3P4l8WrVuEF2KLbyWiYjBs5GDi37DxcUJWUtnK3dgsg9PZBSmb5qDwmjddE%2F9Rd66hFK2Qw1hsYejKpvSR21vIEbPgiOGm%2F4%2BWZWdW8A0LVpwZhL5F%2Fx0hE6qU%2BkVW6Hgc05b0gpNNLfYCt2vstZtE1xMxVLjetprLydIylzrjJUu2Jnxdyp1Ug%3D%3D&X-Amz-Signature=2f2083280bf4ffeeb7882833946fc7c70896038fc866b381734fa534a7299dbd&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/prometricPayment",
            },
          ],
        },
        {
          name: "سفارت / ویزا / هتل",
          services: [
            {
              id: 17,
              title: "پرداخت Booking.com",
              description: "رزرو هتل از Booking.com",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/34-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQZWJAG6DL%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T122149Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA1kaxgv1M%2BKinTCzp3diDaiFAqstAsEAs%2FX%2BmbqRRBAgCIQD%2FSMeHthUEr0%2B3C%2B%2FoGVogSJPqiDbLL28p7%2Buf%2FEBeGyrWAggtEAAaDDMxMTM3NjEyMDIyNSIMKUF2dMGBOsWAwOYJKrMCV1MvM6QlR03uJmnCgkK2rfLQsPl7jT78CRf4AMHNG37UsITc2AxBW0170hPigQ4J0zeo67GoN28MuXcyKsWExN2woYRKVa7VMdBtQOC1rao%2BtFGeZLBFlmtza8HlsCDXYSttw9lNf8VhuMfo7Rz4mvlp%2BOfooQk5Gx8Y8Zil2a1acUw9HaVEko7MSClD78il7vCyKzyT4OUhHi5xY32MG9l7eJnKoUitxlPH5iRsQNTfgXH0FdNRXTUCah7suEhPvSi0xxXZ083xQyWGiXTuInlhDH2iowjl1UraSuymRluULPhJhBI1Pm6ZQHTb3damwnBsG8zV3AAAmNGk2CInNDzq2fA20Wd2SHI4ZUpARGMzSTrRHMtvyOkFRrm3kliL2Kt9%2F3RA3tCPj%2FpGFmn10J8RzDCS8q3HBjqsAloBj6%2FiRPiBFfMcvqnjijPhwpbvJNktxsQVFjCcLs8W8cV7gUeCuuLyV6xcOqhwwY5CxBHhxoQdTRiOXRVx%2FSbPr0RxtVlXWM%2FfnkjNCv%2BweYqZtkpeAfdR%2BVnnae%2Bh6sto9wEDEUvx1SbWiK7ng2G8jvdxchAfUQBfqAh2dekXGj2h4BEFn8PLdq2rtUBqWxUshqNpuwJuEtVRHoErjE88fRUj%2BieOCZSw%2Bd8dnZU0tmvRc22g0zYzzQYwkQ1yTCk%2BlXyK51%2FCVIFNIYLQxYAL%2BVm5rqyMuKibLtgV2KaoeFSI1UDO1GRJ%2FKChRQwCmxtieJSwuCisCi70iAAhCOafcw1ePzAp2DitjxAXklMbxZAH1NmpCycdxppZPj0qIfAqa7kjRY3EEPFpGw%3D%3D&X-Amz-Signature=f77bcc27316416df2b116b8b1f276977b20876da7d6decb9bad69c17155cbeb6&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-booking",
            },
            {
              id: 18,
              title: "سفارت آمریکا",
              description: "پرداخت هزینه‌های سفارت آمریکا",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/31-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2WVNSG3H%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123027Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEAv2q6txBXEjKFS6%2F%2BmkDyf4lSvqoImKDM8YpZfrdKU0ECIETpoLxtq69u2WbSG%2FirKmyHsvjamDR%2FtQIUQErbHixWKtYCCC4QABoMMzExMzc2MTIwMjI1Igy%2BJtJHuDpJ22D9v8IqswIs3S%2BM5K5JBdou95tmpEv3sqc9u5UkcGsXfkSPIFi3XBvlIkfDpwOLyF2sE4DYaIv4yXZ3WSW6FimDMuickdzx1mvK4izwLcYyPP2z00hsfS%2BVTYE8Evu5x6h9bp%2BfH6SXilP4mJkdwf5n8mlkKwXgCjHBZUTq24mxrX%2BZ5AWAfOYzvEAEd1XyyWBd0s7xZulmuArgeIT%2FoWjPL7Jhnhs%2BTzbJJubXnsyi%2BtBdqW616Cn8LT%2FIbD%2BYuYd5gYireqFqLkbhdkUmWm%2BNJWfFnLS%2FeXnqoMG17pAuTymyGb14FAJE5ACobCgVhOrhRgFH4xvjeyWChLbHUJv36j%2BlZ81E%2FMKD4Ib4HSL%2FYlnen20dADREKh%2FCo6A8WF5fBObId0pmAHrO1ZwC4NNpUWXyaCV3%2FS6hMJLyrccGOq0CNAs4cqf0ys6YruLLbkFgM7dv7RpiLUG7n%2FoKnKX%2BzDo0zHUKFgSPOkQxSF93MpyT%2BZtwOvAdDn0MGXuU3bUstCAgji%2FQ3WROpPbajDckVgEhYP12txR%2BvtemXHnJo1MqPoCMWzCjO0dx5akSOH8pOSqK08aCU5WVzbzP3QSLcbn177CtO8BTC0JNAiSmg6Gzt9w2OQDC1qHjUQ2pW8wKQo%2Bs1Pmk5ExmQ4nSDgB%2FO5r%2FdWHZz9Tjvei3SMPwzMf98qXpFhIXk4sXGfLDsRS0t8R1x1ZsKScBX2UVuqIIqhbV115fIhexQiCkCNBSn2%2FTLxeSgtg5PmkLrnW%2B0i9zM4NKBTYTvzE%2FXkclmrLdXvvqvj2BECNsWEKd1LhLNh7E%2FiTeCRaOqyQWay%2FMww%3D%3D&X-Amz-Signature=efe62d5a0bcb1c3d004ad5c73631b158aee65edf5a0befdf49c43b1625996f76&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/Paying-for-the-American-Embassy",
            },
            {
              id: 19,
              title: "سفارت انگلیس",
              description: "پرداخت هزینه‌های سفارت انگلیس",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/32-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ6NMKDR7G%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123046Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEAp69P5Vuw24Nh3Oay4nnuWs%2Flq3D9EdeKxlk6jf14KZ0CIE%2BESIiakHHXwfB4WecfCVaZe%2FFXEeVR0%2BWoI%2BF9w1Y6KtYCCC4QABoMMzExMzc2MTIwMjI1IgyY3RAmc2rEPCPNst0qswIymgrzZo9UDCAN8UYRxUgwoFqLRH%2B1zou%2Fi7hjXFLEsE9SXCpYmWUnEHhCs%2BQdD%2Fh51AHvbVsip%2FrhD00aiNHhTIl0btA1SbXpyr1waZXaHZmlqo69rr5vKZU1mdmTft7Xi%2F99NOLDbPYWJDqf6xT%2Bky6do9eyHV5tL7F0y0%2Fk4t43WCW5kPHaGFT4Mj03c5%2BoXyukw0XKk1oxMKKadfa64o3BYOU4E529HZ6zZnoMSd6HzTxBRy6iyfATXSqeWz4mMiedJXLZDlm%2BgAbrBf%2BTU4GBHnVthiba0FHz24dz%2Fzz4ZSTeUX5f9pXOUmWYX2k%2Fm9OQq6M3tp4hTUAi%2BGN1Sg07LX7b99Su8PgW5wyI%2F0gAKClpILsbPWUXJU%2FAXtspj%2BxCjqteb9tUS7iCFTZkYqOzMJLyrccGOq0CVwr%2FhMWbREkGefoweb%2FNAhjZx3ACQRTFbjgUdMbdXBJRfJ7d9h1bz%2FJ2%2B6dLmvG0SodUqwFyUqfgatRklX34pfsptZ7arwtn4GhtIcwUeypJ2k5r5SpMaKBhvE%2FKBZjD13QwyI%2Fz4PJad5jL99gt81ZuX0lNfVRhRmAcRRVYOcfrJrXYELawmdsG9X9O%2BNpqYlX6o70WXrlION%2BCH50yszTlnXHp0LX56Sbw0uyqsggajUFiKey59YYwQeRLJoGHGvQ65BXt1cBW13hDBdE17r59%2BdwJlrrtEXvYBH0Orj%2FHRJVOheCXC05HIG20NrdyNP355e50f%2FzvWyTtVa4rr2gnliouYPhudFZJHzqkw5HnEy%2Fmp8kyJCR%2BqubFHy2A4Co0eWJp%2BEBoiXcA4A%3D%3D&X-Amz-Signature=853ef4c932feab8a3ec9226847ad85edb50e32a1c18a7026400563e5e2acf9fa&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/Paying-for-the-england-Embassy",
            },
            {
              id: 20,
              title: "سفارت استرالیا",
              description: "پرداخت هزینه‌های سفارت استرالیا",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/33-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQW35MS6RR%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123104Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA94RUR59CHZGCmDiDgdaPWNVhzZHNgf%2B9vwAvuBz58y0CIQDw5pD%2FmA6%2F2lNFT0VY%2BC4dJaz2XaPpp5OPSvX5Ydb4eyrWAgguEAAaDDMxMTM3NjEyMDIyNSIMOeQwerXGFk4oNUnVKrMCYiy1nQS%2Bc2CMRJlzx70012G4BgTamGWaVIBzSkMt%2F4Db0lqYcZ4fgLFY%2Bf2w0TeNnrAq%2FFv%2B6jK3cUiKAizfkYAndWDkVlUOI4cAnH%2BkFfHKDoA09yA43CXBtfDeN5GR2ASgqOUqOX3sKTgwD2Ew9RTtCdaup%2FIiiV5SduklJX%2BIIJzdD32%2BX99GYXWS8b7AqAw3Wv2sbiLhTJ2oPQSbpeBixo1FHMqNW75uE8czmRJmYlEgaAs04sHJFxmRVpMS79LdPFxwDChDRkLgQAp9VVGmgDmBUhegRFwSPFjh1wOTiMQoTkhUADNPiNumK%2Fa8Sq2fjtEoTgMdH0OKqdnHZuUUCjoFCHe9sDeeSpAOgEmM1dqhb56UxPoacuIKV8s3Xc964MxXjEjfBRwoOU6%2FUBXwCTCS8q3HBjqsAvM3s0EK%2B3j3jxuR8kOwJrqqGHT9lL8OPBeUW%2FexZEWLijfmp4TesANOzr%2FnsEm5y5%2FM1pcfT3HSV82sH4GjU3jqZ27%2F9nLTIqEyyfpreKdMaBcxlQWBdsGA5rhYghECinYWP1JzY%2B4FqQykcCROdc52bXV0kYSd7aWkuqtpDUnmJHH%2BiSGvEhQko733ZZMUxnQQj1xdD6cWwG0Pv5BaBy%2B%2BNgrbU%2FUP1F7AaQjQCLf8h3mqvL2B2tO4I72zT4SNdZauOdKxb0XH2CeZhRDvcSz%2Fj0TyFzVSHkVDaPF7Y3ordu9pXkABOsEIQe%2Fyo22gURPPECNNSQkW3LOhL1B2AxxVGvNPTMaqR%2F1R7wQgSGcnrzMyVA19vy21HGIX5QQUU0rzG8q3ut5BwzfduA%3D%3D&X-Amz-Signature=7b55cb4b28c10945c60ad0324ac41b87783ce24d9387e7217f6213cddcb63dd3&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/Paying-for-the-Australia-Embassy",
            },
            {
              id: 21,
              title: "پرداخت Airbnb",
              description: "رزرو اقامتگاه از Airbnb",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/35-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ6XMVSN4T%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123135Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAp59dHcsXFPvKwCtnjkwGO1Up7q%2F38iYHohlgzhdyb2kCIQDhcZaMsDAWIvfvLhln%2BSnRkDJ%2BGG63Sxgs29A7cL%2FJvCrWAgguEAAaDDMxMTM3NjEyMDIyNSIMYlaWtSJJn6QYJESdKrMCqL5doC8qkbycHMXB1IOHKTFSJnb%2FVWS8Tz08yo2xSyROwfKo%2FJ5N%2Fi3wgi1IfcN4vvORfiGADFHCZKX%2FtNGfFL05xoH4vsSQ3TkTL27mqO9yahi2zGoWKKROvVKkadx5oplKFJnJEz0wF7yElAlleDlnAfAQaS%2BoybVLkXmQkar%2Bz7AosnnOEBbHDyRWvdnD%2FhLCIvYd79O4f5DfH%2BN%2FYRzQiikJo7GBTcn2sPCvMoQ6QnGpeFlmkNoCUpNZGItTJdqIAySddNOv6UW5wbe4lJ6GUi81v%2BqRTwcKnJPfJeI4SJNkKLSkPWXeiCeemLXVCKNCrTfkswdDW55BfVWJKsoQpmaVKfkNKGt7mf6bjqs%2F60RfbkTFL82F94YREQvk4xEYY%2BI4mskP%2BBhUs8JeCOjmvTCS8q3HBjqsAj0PMv6sy5YIJm2vxacpdFm6jUliUzZcThGcW6O7d6R3%2Brh0tAve9sOGM%2BLmvVtAgvvO6ywJGBD4rIs9IXwd4ioV25Jp4tfOrPW0UudgifP2Qvsi64Gt94v4lho414VJEcZFfJHStwXX5o4xd%2Bq2QBm4kBNRHl9YxG907zGm9kEnmwLWvaAHY4UTu1140kDalpQYtYyJhd4pJndEgDmFI4znEp3sgg%2F%2Bw3by3GA2SOlu39M0DhGq7473XXP%2BaY9dPNx0aC4iqhvCJ8Sx0KnZe%2BvFI56LTEmOkIow4OhY6mZWWR13f1MCtaWNFmRhkoSEBc6uOjaIeKMH80FwzQVxxX%2FO0qdMR1kpOPZgqQQ4qqhNyDtm4PQFz8YrdJZaDobVAUKaHLO0cO6wwNSOHw%3D%3D&X-Amz-Signature=42e8ca5f1a2529c986a7440c2a2115ae7ba2ae9f887b9272edef098c3ac26a80&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/buy-Airbnb",
            },
          ],
        },
        {
          name: "پرداخت‌های دانشجویی",
          services: [
            {
              id: 22,
              title: "شهریه دانشگاه خارجی",
              description: "پرداخت شهریه دانشگاه های خارجی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/36-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ7N3M2VBF%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123152Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA7hk7WBAeU9nwQHrMW6%2B39Rq3a6O3lmL7w%2BObYyz9TIcCIQCJxR3uxvADIXs5n3DSIdpqmt1cskm7lO0oibfW7ndMdyrWAgguEAAaDDMxMTM3NjEyMDIyNSIMXu%2B1zeovmBFO7whNKrMC609wf0TJI%2BGSVWI3ZANxvYUzFv3pI6HxTtPPALBh6RrSxBvNMSlMMd%2FIztTCoojuPERUmtPLzZTiQ9g3iQp2xJAtZpEE8vuLiAsS1F%2F%2BMxm3%2FTrDBqdQ%2FYrN1JK%2FNpeb1MTA7ggwdHNUP06j4c2RmuuI%2BScyQvQq0fe9JjjsWmTZPxHEQC5YwRmm1GOUsDtXhUt6nt5Oxie03j1JLBl2Bfa81oeauQ3NpQ6Sd%2BdLtGDHNfrfL6myl4h6jb%2F1xvq%2FWui58rcmjxWryYf19k1Z2QIElk6nVN3BqfUHdb27eL1IISSSIBrfo3Z0yH3vhX%2B6zAsYVnQmPLD%2FgvE5kloPBo3bsGslrukbfbtbIL8RT9ZOxhu0yyRfCh7A9N%2Bxcy854zeyvEwex7b9QSaB2C9dW7SlkTCS8q3HBjqsAs4kl%2FWgQ0XVNvngejQ5aL0BynbmoDSkJzK6EwXqoN8mp0BJYV7RiHRfZQQ0KZ9ZXiQehalK2LnwguUlo5EL%2Bf1i5UEOIky39IEurBQthYhJkn28S5nsiKIClZ2A52I4fWTsBvmBAsuxBRibUdgIVXK6KJeVP0xxxqkWeP0KyA%2BpPBIbu2G5e5fMgVEwoSIC7%2BtpxVnIyQ6teCN%2F9CbqtED7ff4olFgnjTZGr3kosOT2fIFaWft9eoxslT4zhvUIxEjhWHaasTeXWQGMTk5SgOIiB6gTc6fWPWyfa5OjNt%2FHVinc0FjbgkG%2BALC%2BXjei99yVkWTi03zLF8OVfMoJos0%2FL9Yb9z9%2BvZlCYFbsIZx2%2FDZavjcZE7%2BZegSFcPrxkqKV5hkFNqN49eD68w%3D%3D&X-Amz-Signature=7e4fd8c905a8058dd42f7c4bda5b9528bd677291b7ddd101364de8b8b7c280d5&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/Paying-tuition-fees-at-a-foreign-university",
            },
            {
              id: 23,
              title: "دیپازیت فی",
              description: "پرداخت دیپازیت فی دانشگاه",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/37-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQTWKJJQLQ%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123213Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA1TxFaME%2Fu5KHwTUZB14mLASRZRDc5gkVJdmm13t4qz8CIQC%2B8dGgqxl%2FFrcN%2B5dWqoZrxLhQHnbM%2Bez%2F4SkrusYVZCrWAgguEAAaDDMxMTM3NjEyMDIyNSIMaEZRLAD6xf2Dz4wcKrMCFBEv4G%2FxY4NLN9K%2FcAqyYMPi6D4nIaDKqaKL5s4OJoi04j8Cd2AkLyH%2Bk4Ebi0Xnvr80boeOZujqebCFqKjjbmd6SC%2B1Iy%2BIzwiRdeNfqoKy5%2FPrySjSQ4TBojGT6Va8rsl4JYvTCD%2Fh2RHhBzN6yYgu9Z8WdcMybwxtH27eh%2FNdvoZnCs1e3b1JpAq2Q3XtgnvossdDjHqKD%2FUAsyMROtWaumCH7nQ3RbhB525lKz4i7nARUgV1vjUKLqXgS6ZrIC6sR1sy9pzT5JCRcVyINcV548Gt%2FoMuUoog2lPSqPQGtQ2kmlAGLjmmPcx4KGt4vSIpytidt5Yge6Y8IoAfu8xLTwai9yqXImhlX40Dd4PWgno37%2F9vo4njxT4FLGZHDlwC3lF97EzDqvx60OoSQJK6LzCS8q3HBjqsAhq5tvT2SmYMKtVOqEZkwFpsJqupyWY9QJko87AfWT%2FY7mDLOoxU%2B%2BDvGuwFdjDtZ9H%2BbgQNGZmFFxa9ksjJMz%2FnaqApMJ1RXEPwQtZNOGR0uEFhTt8opQzEZWXxm1oeuqjm6SClB6YgqzjWN9vk8dAFS%2F5qSmUqZo5S326hnm2XvUXmvq6uMm4ZVfmJvwe%2BMSoKgUaRKAsXx8GASR7YMbtOTQXrex2s6oIdIQUqYmTx0Uzaqsrom61Tc47ptTBF3%2FIlDG%2Fau3MqcoHjfnFn60JB%2FPZe79lLfKtarmjY2hDtIfSJGswCxRms5YUbmrS9jydhF5F3bGW%2FaRA%2BelqtXEsQvflKjEQh1nZvTyPVNMsr2158qmiBcKn7d9vYkhNRONhid3aCMESPcrezQQ%3D%3D&X-Amz-Signature=c3829be65831042fa3536a2396d2d944b7c4690b711f8761bc314462ed47821a&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/depositFeePayment",
            },
            {
              id: 24,
              title: "اپلیکیشن فی",
              description: "پرداخت اپلیکیشن فی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/38-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQTIAROTLB%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123229Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA6z%2BHEat7M2whc49ICtATx6whF3cM%2BoWggwxo5Vy4CjQCIQCiuWfzo4EwmE2he1dNODbHtwtReM6y3vzD0tvk5wnXuyrWAgguEAAaDDMxMTM3NjEyMDIyNSIMd8dJCPtf9I4B0M6HKrMCGPdRPUHlEJ7F43upa50EW0do53Ss5iYuB%2B99Zl2oQZNIT1C7MdpQrCaRfce7cW%2F4uEu99e3fk%2FQMZBUqDOPvCy0y14BQS%2B99r1NyfJ9KsAqzuEZDaY3BMzrskaKydgu%2FvIYecM3EkU5MzUNWYXcLWwxx5ks3l4MgL6Vlo9VJregS013A5FwJYHNfPI8yPaaEvdZs7j8I%2B74QX3d%2Bzi9PEY2rrLuF0OTBC1XI4%2FyODmj7IaK7WVnQHFf6n0VxSrXkvRrUcNO6wRrmBcw7NgauSy4yp7RHSKMAYTSFlGye1TgfJ8DUVLyBWV3sx5mvS340VM4ykXo6FQRukdvYu1nZ01Y8Z%2BBJYPSHK%2FxHk%2Fu9V%2BSyuqi%2BlO7vjFGEV7O1IpUrYf7w9Wex7jQYFICOkYZ0JGrUNzCS8q3HBjqsAkA2Ik%2FYGALa0%2Bhxg2REaEdz5%2Fs7JFd8KrxQbH4Iqo19yMsRxYDLGv%2B6n8vE7cjrol2FEJGIqE%2BwQbwGdQ8OivpRkpOZF1gwAulvUBkqF8nX9nVaVptWAgd008cGItthRLn2GyvQth6z2YgB303mp2h6Z8vLyMLJO3YPuoKvGanlFDgJ2cakQFCGa6ttxwbnkQv0Jn6aPbkwDbezvffzJPyMuQQBvX1i3VoeMXpBN5zWZkFwfCPhhsaCnhYdxk%2BUnUfpQbLgK4K0iuutW4k9rEh8eiUP6s%2BmRHT%2BF%2FZ1scCXqHiijgYgyvujFx%2Fjj76SCaPnjXu4eYy%2F%2Fa%2FCAqw21SylpoDwxhCczRy7kZ%2FISebKLDjW%2BYJDbdlveURAItS3gISCa5mrT7nuA6wTfA%3D%3D&X-Amz-Signature=d11ba782ff62d4f03017cb4e843939fb5849043b72784eeb406920c7e4b06d7e&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/ApplicationFeePayment",
            },
            {
              id: 25,
              title: "پرداخت uni-assist",
              description: "پرداخت هزینه uni-assist",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/39-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2SO4ODYP%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123245Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA1pCMYkDbthxzFHhGs%2BLWhciXGzLat%2BclmXVsuPC%2B%2FawCIQDc0jztYJHBFehgtDUdaI4rzFaNDOF9xyU1bjwDaQ2NYirWAgguEAAaDDMxMTM3NjEyMDIyNSIMWRqasDKPpzP27z13KrMCJfAR7%2BCCyqe57f4y9XZs8%2FJiwJXWOImtJmYcdZvNBLcISCLox%2FyOVrELR18NeblAM7qJz8X71dhNZXG4A3oWkXcXI4sop7HySgIonrk%2Fi8QpQ0%2F%2BjNUV00xeeIM9VvHsxMuaNVYA4jK%2BpXA85BVxaXY7jh3Pz4FwHoRhADe3tCgGb7G9ES5t6SmV76p5szdVHpXacOR6Pb4KmfZ8XBW2omB5s7su1fffp%2F%2FdFN9h87D8o2Hz7v3JZVHEugLwAnemKzQRJUme%2Bi7oJ5g%2BMvPblqaMGDv%2Bu6RiXw27k%2FhiMqOs4lV0echAZZPu363YRBKe7sy8e6Q6RwxeF1E4V9NtHbWgLl1VIsSFUFG%2F5jWJc%2FbJC39aG%2B9%2FDI96Mj%2FS796z4x65eWvyFrec3o%2FCa%2Bunf45BsDCS8q3HBjqsApJTr%2FFgRmCwo4X2YH%2BwP92yWCArq%2BxLLsRXWm7%2B913gyws9BRUmgw278F%2FEnmAorfzXVghotCgKzA3Q8fKP7Qtqxb8M73tc2BhonpITsH2ZsPRLYZ04%2B9PcY7ym8v46LTLZr9wwx5Hvt0FQvRf%2BYO3Ajmnuq3ENH%2BSsgS7CjKNOkk%2BqApaPYFVNwXCAV2ZjnhOLlvgRqgd1uNFaH9FfqyRrijdoGmyf9mPVyP7g5B09iz%2FfE0%2FvOY%2FZoipsi9AW3iwZEWRGHyl83hGsS0e9vfFCfzr3OBZNtTV9yM7bXA%2FUVqHPWcpi9%2FG%2FKpW2UgD7S4jKCgkUn31TomSFfchVIUiz1%2Fx%2Bisunfmg6%2BxxvJ7LzPLVtO5E4T2zh8ZBMKBPR9LkjWWRHeg9WcCUC7A%3D%3D&X-Amz-Signature=556e9fec9a4e02cd1ba06dd39e3e99235515bdd4e778356c808124e596f8b829&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/UniAssistPayment",
            },
          ],
        },
        {
          name: "هاستینگ و دامنه",
          services: [
            {
              id: 26,
              title: "هاستینگر (Hostinger)",
              description: "پرداخت هاستینگ Hostinger",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/40-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQSNDXNOFS%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123300Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiBZ%2Bvd1SU0zAiU3h7JNMvE9TI7fq5gU%2Bk%2BAfxGnD2NxKAIgecshRoS9%2Frslw681BQ%2BKeToXA5lW9VzlB0Z9FFaxtr8q1gIILhAAGgwzMTEzNzYxMjAyMjUiDPoI4BM1ZH4zLREvtSqzAq9bkXAvnf1vUmRNk%2BjM7MMJ7GS9f9qmHfQmjGgffRTaPeChFdrOkbejd2FVd6hsiG5UTWesDSRpIS5qoe1vEynTn3CulFVfJ9xzB2ggQwjYcpMTvfaFodF9rshO0ISEYtQhneujDGkprlbyOZhWNJndW7QzcEsMhCmvxnjs1Diu1brCP8rMtTRKQwsdCc2x8oK1L%2BL1a3SALVD9x%2F3y%2BeB38Ol6H0A4DGKbM37ivuBAOcbalZi%2Fk1FV0TSqD7USxtNgtIZjII847v1W66zAAqGm4oCQPLQ3eGHij4V5qlTHdTnlf%2FkEcKnM05OkGIKhzMLiwrsknSbDizCCButPpx5RbChJg%2BwmdLhcaE5lzIpaU2XYrbb6pMlkCvNGVkQRFwLaEWX4c2xFLmwAVAy%2FL40XsOUwkvKtxwY6rgLsbGpttmuxjUCjzBrfgqOgzNa02AnnRnn195fo6y5IkrCAUZ7MVqoe5BJWOL68RF5q2Xn9bWmzDG6ERUH4QVMAjNyF2y9z%2BJQd7aDm61cX72hRNklW58yDuXWi6iodCiS51eRSh1MUlMIrRqJG5lBNAwuoo1QShBaZBkIClpQh1DmqLe1hz%2BwEXzPf1QKvEgkJn3WyIiDGXiQitJclQXmJKEg8h%2BCYgCFbOgHgUPaSPdZpQO%2BhDoYAkA%2FuUJM3KpqXrokEAUtYzTMtLhkUchyKvbUgPZpC84yVgRk1rTKgLiPKROeRxA5VuELnincmcm%2BD%2B2%2FGJZL1tuUSv9AkpAVd1OSGWM62r8UdAe1HAJuNyNEAGB6yPlX8Tk7Tn2YStmpIgpGB3MI971Ub5igTTQ%3D%3D&X-Amz-Signature=0a14a4c952b00f9ca3af3aa5b3ea387ef414ec84cb62f3e6f9210fa1be5c5a13&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/HostingerHostingPayment",
            },
            {
              id: 27,
              title: "هتزنر (Hetzner)",
              description: "پرداخت فاکتور Hetzner",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/41-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQYE73XASC%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123321Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiAOiltD0SRUWLJajVxu9j2mIblRk1%2BsAXcrigMmfaiGIQIgUndmIBKyz5OHjtWgt0sKNBkL2eU9L0IoydqRvGOTkcgq1gIILhAAGgwzMTEzNzYxMjAyMjUiDJ5am7V1pch4xU5aCCqzAg%2F5LZ2wF%2BEkPZ7AWXN9wIvDUcy5y6xX8cJQuMN5EaaEQX8bb47Lczi2djPGhRBJ8JwnjsxnjSzUwyA0Gfvf8Q4%2FqlTJdKckIKGYtmWsMHsyDmZsfj99rHs5VuqTTmAS3fsieBzzviOyYuYRAmZaSuZV%2BY7M0pExXkigapBtZtoacWw%2BdbRuBFmYXEPgnFmAolX5rGv8cEUW9w6v9f9Nu45f87qe9u0LD1G2y9pElvpoY6LmQcPUoEIFLcY9Rq4ZVwTGN1RUVB5tQ4CsZvvuvs5j21c35EKEpHkpiCEsDo%2BnLmsACDLtUODNVnGOqyN3%2FRCmGDlayzCVh8hZCPG9Pgk1o6gU%2BnBgxWTdpUhZpFffHF5NsGtSzmsG88vFvhvQbBZ1GntklGkoRs2T%2B1Q%2FYxF5uAowkvKtxwY6rgIEhOy4fadehpdso0mgZ5UL6EJn20ygYyUsNFJMY8YOmQJ340XwH5FNElq4yodgzlhLGc21ChIm9u%2FRKHnVQ6J8MldMFnknwtv5Jfpkl1xUkDVBHRqyw7sWfrfInFGP%2FZlpzuBQrOLV5RRTEaGLxe8YmY4ebLggXJffrWsR7KgtqkhQaPAnRhVMf7RkcwM3fDUBXEb%2FkP5Ce%2FTSWW9VG0pNtO4om47hvEUvooPNeRCJWooSBJpbghv2g6nFcVJl0StyX2hvANEoH6dGc9kxCMjqk9qQ6fVYNGhHzIJsHiJkyqlhTqdgc0hLz4rV1l9UzmU4lkCVnUFu%2FZnx19vh58OG4DR%2FR9WJV3qOS2sdw0edhIDs11A%2FW3fF1xlI3JLYoy6cTjoGrtgaUift1xaWVA%3D%3D&X-Amz-Signature=af944d741b9ad2a664983aaf3d7d7227665391625d6b7a8cb1c64f6bc6b3b1f0&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/HetznerInvoicePayment",
            },
            {
              id: 28,
              title: "خرید دامنه از Joker",
              description: "پرداخت دامنه از Joker",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/43-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQZEKQS426%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123356Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiB4rk8P4mkF6a0b0Vr2Uq11ch7jwmF%2Ba0osWloYW1hOYQIhAJL%2B2sgbQvt7CAK5Y1YG4WOMCRhObZYxIqKCpjmW2jxmKtYCCC4QABoMMzExMzc2MTIwMjI1IgyZDoxiiok56lcZMVAqswIssYD6Zl%2BY1XpJLIgGdQuIe7%2FzbbhHWkizEjsBfYCzBYa%2FrfhhmHDSTkhf2%2BcDP2GSRHbteDn0gv4ClhbFb5eohBFZQjpIQ85qZbcXLsILZDgtBj0kjJFpbvDS1mwvDVhWHxJ%2FIr4g2qynM7gis5IsDnYzfXAdt11YQxiLwCgZZdxNPpB9pYOtyOpRh7X%2FFzOEkcKPsOadTk%2FepSxG9DuelwWDqGpINaCdzv%2FMCWGoTpuxN%2FRZ8Jlb6Snddcz1sIHjXEAiL%2FgFrxoHgL5x6b17o5tjkOrH4J82n%2BeDogZcQZ8Uo4pVeVlyLW%2BqDlFC3%2B7nBKAH6E71qfu3zd31IYqxaPsHqadkiSDRAU5V1UwLVwmbk8SOgVSms9P9PXzz9n7BZbhZp1rPymH1EzcI8oAqMjykMJLyrccGOq0C04VZqqh%2BljfTICdtsQmfk3vbkxGikpjk4Xy2ovlfXZDnzjkyv2MGFGz2pT%2BeO55oKwXKmB28kEApWhcYSIst6BzPSFINfovcH603KbAXiAPhXQGBZO6M650IK9Z3f4%2BWEgbMXhF66w9eYT%2FIQ1ApZKlL1pN2znJ%2BrLPv8YMUtUczgDMqTivt0%2FeMwbm7zyCIWfhHuTkm8R3jg%2Fty%2Bf3IeP5Dp%2FhbBlVxH4xLHqMk7AKznsYlrGap8Z9ECu21ZmASMCtKMhcVh21DuelPe7U2TIb9Cu39PBtYBpCUsabRZ51HeMY5I2d5Vm8eSEN6S0hyR%2BgHAhnYd2KDWSBcPtGGkVSPG0RdinT8xZT3exgLQHY%2B3Xl4NIX%2BqtAZ0TPMXwMDY%2BGYLa7HRXS40RpWqQ%3D%3D&X-Amz-Signature=bdf4603abbabbb9cfd547347812a01dd6e0fa2c24002b60bbe5dc38984c0f470&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/jokerPayment",
            },
          ],
        },
      ],
    },
    {
      title: "خدمات احراز هویت بین المللی",
      subcategories: [
        {
          name: "سیم کارت های فیزیکی",
          services: [
            {
              id: 29,
              title: "سیم کارت مالزی",
              description: "خرید سیم کارت فیزیکی مالزی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/42-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQROSUONHB%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123336Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiA0dl%2B7fAH3%2B50nCQCvvHxDihGs1WkIUUC3Nyd6NQZLHgIgfQzr8hQeaM3YUsOe0fglfGXyxaph28U1eagEAm36ifcq1gIILhAAGgwzMTEzNzYxMjAyMjUiDOqXPpbWxfi6qjsz2iqzAqJoGeLit%2By%2Fa%2BSGZvN86g%2BxYfUZhoQiOCx6DD7ArWd8DvhZVALXMPaAuQMyheIz3cjhl2a0SAIfk%2FL41hjXEEwfy9vi1GO7WwweU8QsAb%2BBsTVs4qy8QFL6PCsNZ%2Frw9Vsqd5ug9dXpY%2Be0%2F2z32O7vpfCz7UX3BnAZvc91u6As%2BeevLuqaRvLloJD2e3ixccxPRqFgtlX2zAy8CHOAn%2BjJOjTzhUvUrq0a6Tgi82AE%2BOb%2Fn3gUvjE%2ByLXYFMwZgiJxzd4T8QcWpXlZVoGpt6Mlb4pgZSopt7aoMcwDh7xAhN4UYiDFL4Fl%2Fp6rPoCW%2BNumyUNJK2YWJgoVPM2cIGmfgHa16EbAQIQyqYJHbVdBkbWE39Hu7MjxtOW990uFNgN0XE%2FjWXnBPeul6UsJ57FqtpIwkvKtxwY6rgLdyTL03D%2FtRHtleNMjUlYHAZlKNlb6rOjqZ9FzaXbMNvQDcIsxA9LSqkU4f9q4oW%2BNlyTv6U17LgusCpNPUbbYWuuNvTkiC8bkxsiRsQWmf7cpuljucwDjtN4xI9f6P9U7KimQepdqCdnWn3e8F00f1Or3pddOzCobvqEaiPqu%2BUje5ZYTHwg0Jk3lmcOFYtUYzfH1ZciUYO387MDaLJK0Q2OaaFXU6dvKId6qT1xYmfLEJKFqfroq4XNXp2p4TeAIvSlt%2B%2F3CM2gx4et1mIQLGOoTfg9XS7MrfM4jDXp9lrkDy23NiG%2B8dS%2BRY2p2LCj3CEBxSqcFCbkiDslTmIQ71MsyHUEzJrGaTrk%2F7obWu7xhOFowKHzL5ToPK1Oo0exOws%2BeNrZ%2FE00e%2FPqJjQ%3D%3D&X-Amz-Signature=106eeeda836cfecab25c2b823c5045d5d9828447e54c6f7ac153faab03bef8c5&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/MalaysianSimCard",
            },
            {
              id: 30,
              title: "سیم کارت انگلیس",
              description: "خرید سیم کارت فیزیکی انگلیس",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/44-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQUHLZ3O5F%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123419Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAl%2FWUqXjCmsoGfkziaw14kQoPF560ZKFLsHT2ZRJulugCIQCv13JUiFAAkUJhK0rq4dniAIEtN8HUQZuHL2Xb9z1IoCrWAgguEAAaDDMxMTM3NjEyMDIyNSIMFLE8cbFbX2GgVxhcKrMC8nFxwb3AkyqVDGMcg8uUPkaaYf03coP2ATg%2FGsSGCI84lL7vJ6sLQy6XXaOsMcpOOlTvNekKyu9HbMK0FdiuL4sSChhqJKAcwlZvf%2Fv6a9s6IuVTJZapdcvf%2F4NUc46Xh7nC168OVMV0hGAoTu7SB%2BnwSPWqyCLFCcCIVgU50UnS6u62rcaCJLvK3GLMxHV819LjaAB5WWdtoxfOr9iETTea9iwrRzvBPmlP0YCm5eOuVc1Kgh96HjBPhaa%2BUyvy6drACt0cl9UGMBImJqtmPZh7QrzRqIvZvDrRG43PFe9msmLlVDiMiCusNfNLOARoYAUVz%2BzD4FVzErQtGMvxSZKYpKhOhPR2mgH6y34kCXkV%2BG1CjkP9RjSTItlsUYy%2FOYbSNixQDgRoAkNI5EninHohXTCS8q3HBjqsAqOS0M5UJhprq3qbZQCZOCOhrm6tKD99pZc0V22e908SnVsxvZBl%2BKJzGcqMTpY%2B8XytowxXeC%2Bhr%2BZAjO3Jw2ry%2FUJylAw1dAJIZmGT48apvYLIc3yNUNcR16skpelNIXBnXax%2B1lctwlcLqvnhXmOXNSqfpBRrLwYHvpizM%2Bx5K9v%2F%2BCpgdhF4Qt8YyyICClpK7cTtLNN3kLVx2sJ3WonLTDfzWN83wwxee4T1DNME7KEm56O4jbPBHR264QJf9KrCE1I27UIyifOhNMlov4oQv6gZL2JnibvxftEnpGGoOgtVUTo10B12LA6QiwXp4Q7UQ5vCJAt9UoLxuU9rCGLUG0ifRYR0qDnnAsZK4yZ9r8qxMjA6BsyM1Vgn7kJQxv1hrWlzLPtuk2BTfA%3D%3D&X-Amz-Signature=ac3888c6aa8e931b6b0713bdae480b3df309611401d534e0333c61952f3352ab&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/EnglishSimCard",
            },
            {
              id: 31,
              title: "سیم کارت استونی",
              description: "خرید سیم کارت فیزیکی استونی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/45-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2EUMWKNU%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123437Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiANII6Wm4xqz3RzC6NQgG41fFVfRnD5c1z90MU1VCATGwIgHWo6pXRaycrik4KplQARE3fY154y39rYVz0NOkqICUkq1gIILhAAGgwzMTEzNzYxMjAyMjUiDKAWb8flbSXY4rhi7CqzAgSoNT%2FizerEx5GAk30YgAItEMS4dz%2Becpgcpot8n4hoJtoElu3d%2BpJsEOdy3a6nXMGxd81dNeJJr9ibALlA5OipODXUpJiGhXXU4pwLvYh23SrvdVI49Kc7441LohIuWVOj%2F02pQLUi2XsJHtR48iKepOt9GdKw4rhzLectvhhdHANJgAQew2tQ%2FG%2FajZwI5vrXv0yNojoKW4h8zhv1lNnTGCdOrWFw%2FfKo7OAwIYShEM9XAcp%2FLZkj86vnRx9SrHEere8E%2FnqR7But6X9iFOa3a4jMXSRRyoopiasgc%2FqF%2BbDZF8OGm5wuimJTF7Blg6zpJWDtv5lzXv2dqJsUefINCys9QfNrkXXhwrwP56eQOemcYtJaCf6MBjm%2B%2FAIJXweZmIXmJ2%2B3iAWH%2BL2z9SzOzRwwkvKtxwY6rgJZDKxrDIJlTdfPl4F%2BYCk9koltGmVAbK23nynqOZUcw%2FyEIQV2ITKi5cmkyE18gcAx9OegTBvyvrIKs%2FR%2FjMKVemY43kY0hZpAPVft%2FWM6to7C8AZzoF9cmmb1rbbXf7%2FdJ8c8ZxDtOOCGsa9YXdgLcXhJxtnTIj8WHXUf1qKuEFtca5xxNBYu1v%2BYgFPg95nyELucbmK6gEI0qCdYDSYcnxyCmXT3lkw3NbMuvMQNNZVXY92k64qCDicHVuNMaIzfSu0qecjB7dYc5SvvHdwYCLNNXXdaxs7%2Bp6l6DZgs8HZfpE%2FYaiYdGZkCVqQRxX21S8DqB5zLFuLp2sEgh6FQoAwIRyfwfg6Y6dZ5f0Mmg48%2BTmm4nQ%2FKemfJRgglvVePhNUV2tU9%2F4ER4OqfAg%3D%3D&X-Amz-Signature=e03cb0122a6a4166a7fbce0ba591a3e0deef9c238438643bc4f5d3669880eded&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/EstonianSimCard",
            },
            {
              id: 32,
              title: "سیم کارت آلمان",
              description: "خرید سیم کارت فیزیکی آلمان",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/46-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQZY6HG7U2%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123451Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA6eY5TsQC3qRzI%2F6m8bmZsGqBHugjRXSWdDS1CGe5d1oCIBC3INRlorS4oBHXXQna2%2BaVB0nMUJ59qY7phumVOJ%2FQKtYCCC4QABoMMzExMzc2MTIwMjI1IgzSmyePe3JyKTbNb2QqswKLJLPejCiMxvJWMmeHaGoZ8tjb9M0h6%2BErWFLZNUb5alMUMgeex88ooXeUaY1kwCmSr2icH%2BEg4DC8tHmd%2FZxCggHGtgueNVUuyVYMa%2F8MSFbE1lhyyfCorJ3BZ%2Fwwk9zNmgSREmtgd6KC5hGbYOSpNGYLMGiJDU2Qgc8L%2FX6yb%2Bt1G0HcoWCEd4eUjfJJG2bZs%2BZHg3yZhZYQM3nUc3JDvgw5PCD3WaD8R76zDxTM3uzMb2i9fKelusyGESWdtDBrkccaQ7OFtSLasXCCSqmLwffSBN8nEm6PT0qOoCzITCq15zWDCymQyFYLKGUxmiP7pVQNXq0Jwm07er4F1k%2Bx5hLjlBW61%2Fq0OuJI1KYPt1QJYQyKzxGyIsd92qzG4xmVMNZGO34buE%2Ft4H0Ih8kJ8swlMJLyrccGOq0C897G7JZRYyfEoMHhwpeJ1WjPphD3dxqduvz745eZecPBa7kw8Ti2JfRFJInjisKKeBYklDyfdmMTEb1%2FiFJ5YS2AonWebISsQ%2Fb9%2Fv%2BVRgbGa3Fr7h8%2BPUYTPeDqj%2BrOAP2VG09OqHvvscpr%2BP9%2FI%2BjR9JuxfHxHOIab2V3e8NeO1HXlRpH9YVfJhD4iC4sZkx%2BQnpRwtyGXsC5jfXx7EOUUImyPNuxpq%2BeCIKh61odP7%2FiUbTK00Rrq8HmPGXGxDzdgrCMZiZMMwi9yVDpF0wbwu2Nes%2BzDeMMfALpIB5OH5iYZk5LzdT5uvlUOl7o%2B7mtJgdcuQYrDiKzkhOTB7FA8CZW54vbICl4w18UDK1pK3Js4QkGUP9GTtLgMiTI8t1LCZiemviTCnFnuyw%3D%3D&X-Amz-Signature=5cf56804f16977e32cc68ae6503f754f9161082b9e89524f19b79834f448a4f4&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/GermanSimCard",
            },
            {
              id: 33,
              title: "شارژ سیم کارت بین الملل",
              description: "شارژ سیم کارت های بین المللی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/47-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQR2MUGOGQ%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123505Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA8qEu15vBXBR8JbaJiCtj3gF9BmDacLgQGnjwaiTvFeACIQCv6oGmsY6n3WNtQrzfYCfFcAvNCebvqyzvorUeE1naSSrWAgguEAAaDDMxMTM3NjEyMDIyNSIMwfNiDF9spySmxKuUKrMC8dC87QsOS3w5l2OV4wcfCZLPst%2BMaw8p%2F2QD2ojTEG%2BwYLHzp%2BukWOzDD%2FlQJYru1Kv8w7Y5LAAqBxPT7d3IqjwTBpqERWR2J6nRfZwGpckzrIVbqSgCJlRaIPAQ4EkKCGUbVR8Vyex5JsDkx1OECe7YFr5UvsPjcjXJZq5GNkes0f93o8P40f7e1u3CRC3e%2FfSJKNgw7nUNuu3ScqOyUAibYXHpY9EKNBiLTNgr6qk3ibCDwLZ584XQVDx6%2FBDmEp78x9BQgrYR6DUfWB0Fl3SavV1GZ1eK3rd1vSNhoB9N7JIgEk%2F3uWwhaZm6aTWSpwYFYWhzEH9LOWZ7Dd4i1e6NTRMyLih3XroHok0YriwiRVMaxrKH7v2KC9tPbR18He77GbdY6jKwM8SjMxEF2%2BHYAzCS8q3HBjqsAlLxq54CniLAI3qLt%2BSp%2FeoFoNAPMREO5qgvs5hxL8wzL3WrzdBbYHTHIhTO9d3eoubHbP7uvO2pLUb%2BZgje72BV57vrSJKefMgSbqCS7xa2yaGWzbGkp175lF3upqiN%2FNzS7NEuiC1lnfz%2Bov06%2BZu2gVhoaehCNz802poDloFmNclfEPBhAmlIvSa%2BVMlLke%2FPSUzhxaM9CXqHFF3Bj2%2BbcjXMsOeb2sdAwzwLgsZ5qdUWx9aqYVSimkKEEx2zhGhIrveGJGW1KXY8PYm%2BvFRmFLDRojjOwPsrfsuKVYWXObtUMT2De03st9nLsMqw9KwTxLwJSzR%2BAeW5l3ytODTOrUPAhmMO1Oo1TvrJY2LMtIOvj%2BMSGiAwF7u9UX2w%2B6RRc1bGpo8cIh%2FzMw%3D%3D&X-Amz-Signature=5a8069aaf40e6ab94bf9911eca5d9294ceff76ffaaa062eb73e05da6873acebb&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/InternationalSimRecharge",
            },
          ],
        },
        {
          name: "وریفای و ثبت نام سایت های فریلنسری",
          services: [
            {
              id: 34,
              title: "افتتاح حساب Upwork",
              description: "افتتاح حساب Upwork برای فریلنسری",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/48-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQRD5DABCH%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123521Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiBxW6iEAtfFAxAj1EFwJwKBPdJY5oRAHVv%2BxbjRMNRVyQIhAKUpeinmGn8LYLj7Xpg10LdLXpBaG8kR0QAvh3lu8ko5KtYCCC4QABoMMzExMzc2MTIwMjI1IgwvktcluFwndOw%2FFcUqswLWoYCOx%2FaoqNU5HEENhB6RppsqZzgkWgkzTYJ4ITtJpYHWEKBRU59crgaarriaMenGZKjM0n9kp4NEv4%2BpxRIDUvxfSHXFQ7HWb2k2pATgDPgqBN%2F4oIP28SRe%2FJUCCIyv7Si8dUAhqtdUdFemBWr%2BzDJQYfq%2B5datOPq0IqVtuenhuJzNlX%2FDrA%2FifREZmvFeKcdQYvGLo8iUNv93Y2LOlmNj%2Fuwp%2BKdnAj6ZUag8%2FsnLJ%2BfEHzhmTRMk7LcMyJaElWkSKMplNLvdUJZ2AVvlAJd6fkZTQbXqKD3HezzYwX5rNeZ7j0Pv9pHoh8LE3d7hpU82afvcRUVhVvw2E5TqqpLACksvS4hPPCsNXXh8pDEuKiZxuqdtsc08KcL1OzA82aABXuRtkAtmwK5HTWLHLUv9MJLyrccGOq0CSy1QXCwPFSUF6HkGdEU2gOVjKBHNCqdSh8iX4vQhcEwlvz112dWwQZghWY39USk0nEbzovGwfgWEvGYfdRR9PgdvrXKFTZDvgQICHaMrTiUCXdLrj0NCD0lYlD8ferp17VkmM4cVUn%2Bwc%2Bqgk%2BNwZSIHK5RqwGlK9uF%2FDso9Cbmtu2py64oE%2F2%2BKNsihWJMBhw5gWBQLDR2DReTz466yy4pfyA8jr39cZSre5oHwwIDEtNU3txepdLFhJo84USBD0V%2FOusiVdSX0Xd5CFiBxe7NxuxI1fbpKFiNlfVohuL%2BtYOe1oYsc6oqy4Z%2B8GQk2ZJJRh07KOas7iL4j7eGWRjWm6olUq%2FTPnSkVmj3%2FsIRgZbuMnVLAd0YynzuL2Cpw0FERPh94WlpywPcr4w%3D%3D&X-Amz-Signature=c1f8a8636820d238da7c523ca295a3ea9d1504958f35e9fbe55cbd206300e456&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/opening-a-Upwork-account",
            },
          ],
        },
        {
          name: "وریفای حساب های خارجی",
          services: [
            {
              id: 35,
              title: "مدارک تایید آدرس",
              description: "تهیه مدارک تایید آدرس بین المللی",
              image:
                "https://arziplus.s3.eu-north-1.amazonaws.com/1/49-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQTAL5JZS6%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T123540Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiAy08pAcb9advL67y6sNDGpHtLZsHDFiHumFrYnjHXMugIgQ9Ptvu14Up1X2llc5hUBrwRKVzEWBcDEHVkCzTZ3KoYq1gIILhAAGgwzMTEzNzYxMjAyMjUiDMRfhr064cM8JwK%2FaiqzAlffsmA4%2FZZXURf%2F%2B4uKEMQSSQr9Su3PCRYP51sNkbVpScm3IaQO%2FKiHVpNF37gdTxkxyGkwwhwPDK%2FqjXSEeE5ADxOCVr%2BaR63JPbz5BP%2BM1FZAWClrlVp3GZZH9xxP46gaG6V5c1oebgxm7AyVjvVXykucq2ontpq0J0XnVg%2BTe0JUi8Pak%2Bseiu3EyyQal%2FcQEi1XbrVhcaIkcXaw%2BLstPO2U2yuqH7oAmkP%2Fkn9I9zCHm8bY762mDCxol2Bn4S0U9jl4WiPtVy1L8Ded3%2Fm%2FNUCsmdkEoxqXq3jNrFAxEgQVrZ4oiRgkjbk7K3IWTXlNOOOm0Q9yICFKl%2FitRDu%2By2U%2FYDgSnxmUSrMJ6KJM%2BQ1OwNIHpISPhjD6d%2BvfIBFnvKh%2FUVg1LeUik%2F5Q3rZ0XXgwkvKtxwY6rgK2HokmdAN1N0gk%2BbruK797qboRhp2PQJVwUhYfAVHvEuXVfAFgFMqn117Y31RBRBduoD9Kd8LXA8P2k19UzgZTFB3wAc5%2BW2qWdvef8%2Fgeme3k68NBMlEfk%2B43obTdNxb2g46GVb9gZPzJgmOj2z4UEV0gDaJdfQoVDcfP%2Fc%2Bn292rcJbo9IOMvsUini%2BC9j2Qy9R0J5%2FM2dS6Kg1NYrOAonf8HQtokA%2B35jp%2B5E%2BMZMX%2FKsv1k9K6Kymgl6LcqtrkabVkSAjk1wpxc6Zf%2FwgW3s2ySuHPPSev%2BdmANiKY0IQMW87CfUNVjKsUjMEBeNA2BTuoPYgcQ1M7kg9elCPGcmqitstLZCaRmbLG7WJz%2BszTOS4jsAryXqIYF78gadEqcAHIGbg9p22F3i%2BOFw%3D%3D&X-Amz-Signature=4fa0318e4736ad798a32940949f5fc125b498e74678a81afcc5c28feabfbbfb7&X-Amz-SignedHeaders=host&response-content-disposition=inline",
              href: "/AddressVerificationDocuments",
            },
          ],
        },
      ],
    },
    // {
    //   title: "خرید از سایت های خارجی",
    //   subcategories: [
    //     {
    //       name: "خرید از سایت‌های معروف",
    //       services: [
    //         {
    //           id: 36,
    //           title: "خرید از آمازون",
    //           description: "خرید از Amazon با پرداخت آسان",
    //           image: "/assets/images/amazon.png",
    //           href: "/amazon-shopping",
    //         },
    //         {
    //           id: 37,
    //           title: "خرید از eBay",
    //           description: "خرید از eBay با بهترین قیمت",
    //           image: "/assets/images/ebay.png",
    //           href: "/ebay-shopping",
    //         },
    //         {
    //           id: 38,
    //           title: "خرید از AliExpress",
    //           description: "خرید از AliExpress با پرداخت آسان",
    //           image: "/assets/images/aliexpress.png",
    //           href: "/aliexpress-shopping",
    //         },
    //         {
    //           id: 39,
    //           title: "خرید از Etsy",
    //           description: "خرید محصولات دست ساز از Etsy",
    //           image: "/assets/images/etsy.png",
    //           href: "/etsy-shopping",
    //         },
    //         {
    //           id: 40,
    //           title: "خرید از Walmart",
    //           description: "خرید از Walmart آمریکا",
    //           image: "/assets/images/walmart.png",
    //           href: "/walmart-shopping",
    //         },
    //         {
    //           id: 41,
    //           title: "خرید از Best Buy",
    //           description: "خرید لوازم الکترونیکی از Best Buy",
    //           image: "/assets/images/bestbuy.png",
    //           href: "/electronics-shopping",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: "اشتراک نرم افزارها",
    //   subcategories: [
    //     {
    //       name: "اشتراک‌های محبوب",
    //       services: [
    //         {
    //           id: 42,
    //           title: "اشتراک Netflix",
    //           description: "پرداخت اشتراک Netflix",
    //           image: "/assets/images/netflix.png",
    //           href: "/streaming-subscription",
    //         },
    //         {
    //           id: 43,
    //           title: "اشتراک Adobe Creative",
    //           description: "پرداخت اشتراک Adobe Photoshop و Illustrator",
    //           image: "/assets/images/adobe.png",
    //           href: "/adobe-subscription",
    //         },
    //         {
    //           id: 44,
    //           title: "اشتراک Microsoft Office",
    //           description: "پرداخت اشتراک Office 365",
    //           image: "/assets/images/office.png",
    //           href: "/microsoft-subscription",
    //         },
    //         {
    //           id: 45,
    //           title: "اشتراک Canva Pro",
    //           description: "پرداخت اشتراک Canva Pro",
    //           image: "/assets/images/canva.png",
    //           href: "/design-tools-subscription",
    //         },
    //         {
    //           id: 46,
    //           title: "اشتراک Zoom Pro",
    //           description: "پرداخت اشتراک Zoom Pro",
    //           image: "/assets/images/zoom.png",
    //           href: "/video-conference-subscription",
    //         },
    //         {
    //           id: 47,
    //           title: "اشتراک Dropbox",
    //           description: "پرداخت اشتراک Dropbox",
    //           image: "/assets/images/dropbox.png",
    //           href: "/cloud-storage-subscription",
    //         },
    //         {
    //           id: 48,
    //           title: "اشتراک Figma",
    //           description: "پرداخت اشتراک Figma",
    //           image: "/assets/images/figma.png",
    //           href: "/design-software-subscription",
    //         },
    //         {
    //           id: 49,
    //           title: "اشتراک GitHub",
    //           description: "پرداخت اشتراک GitHub Pro",
    //           image: "/assets/images/github.png",
    //           href: "/developer-tools-subscription",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: "سایر خدمات",
    //   subcategories: [
    //     {
    //       name: "خدمات متنوع",
    //       services: [
    //         {
    //           id: 50,
    //           title: "خرید VPS و سرور",
    //           description: "خرید VPS و سرور مجازی",
    //           image: "/assets/images/vps.png",
    //           href: "/vps-purchase",
    //         },
    //         {
    //           id: 51,
    //           title: "خرید بازی Steam",
    //           description: "خرید بازی از Steam",
    //           image: "/assets/images/steam.png",
    //           href: "/gaming-purchase",
    //         },
    //         {
    //           id: 52,
    //           title: "خرید گیفت کارت",
    //           description: "خرید گیفت کارت آمازون و گوگل پلی",
    //           image: "/assets/images/giftcard.png",
    //           href: "/gift-card-purchase",
    //         },
    //         {
    //           id: 53,
    //           title: "پرداخت Google Ads",
    //           description: "پرداخت تبلیغات گوگل",
    //           image: "/assets/images/ads.png",
    //           href: "/ads-payment",
    //         },
    //         {
    //           id: 54,
    //           title: "خرید کتاب الکترونیکی",
    //           description: "خرید کتاب از Amazon Kindle",
    //           image: "/assets/images/ebook.png",
    //           href: "/ebook-purchase",
    //         },
    //         {
    //           id: 55,
    //           title: "خرید بلیط هواپیما",
    //           description: "خرید بلیط هواپیما بین المللی",
    //           image: "/assets/images/flight.png",
    //           href: "/flight-booking",
    //         },
    //         {
    //           id: 56,
    //           title: "پرداخت دوره های آنلاین",
    //           description: "پرداخت دوره های Coursera و Udemy",
    //           image: "/assets/images/coursera.png",
    //           href: "/online-courses-payment",
    //         },
    //         {
    //           id: 57,
    //           title: "خرید کریپتو کارنسی",
    //           description: "خرید و فروش ارزهای دیجیتال",
    //           image: "/assets/images/crypto.png",
    //           href: "/crypto-purchase",
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];

  return (
    <div className="  min-h-screen">
      {/* Hero Section */}
      <HeroSection
        heading="ارزی پلاس - پرداخت های بین المللی"
        subheading="خدمات ارزی معتبر"
        description="ارزی پلاس درگاه امن خدمات ارزی و بین‌المللی برای ایرانیان است.
با ما می‌توانید هزینه آزمون‌های بین‌المللی مانند IELTS و TOEFL را پرداخت کنید، حساب بانکی خارجی افتتاح کنید، یا شرکت خود را در کشورهای معتبر ثبت نمایید.
امن، سریع و بدون محدودیت با همین است ارزی پلاس"
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
      <section
        className="py-20 px-2 md:px-8 bg-gray-50/50 backdrop-blur-md"
        dir="rtl"
      >
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
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
            <div key={categoryIndex} className="mb-20">
              {/* Category Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#0A1D37]/10 to-[#FF7A00]/10 rounded-full border border-[#FF7A00]/20 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-3xl animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-[#0A1D37]">
                    {category.title}
                  </h3>
                </div>
              </div>

              {category.subcategories?.map((subcategory, subIndex) => (
                <div key={subIndex} className="mb-16">
                  {/* Subcategory Header */}
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#FF7A00]/30"></div>
                    <h4 className="px-6 text-xl font-semibold text-[#0A1D37] bg-white/80 rounded-full py-2">
                      {subcategory.name}
                    </h4>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#FF7A00]/30"></div>
                  </div>

                  {/* Services Grid - Mobile Horizontal Scroll */}
                  <div className="relative">
                    {/* Mobile: Horizontal Scroll */}
                    <div className="md:hidden">
                      <div
                        className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {subcategory.services.map((service) => (
                          <Link
                            key={service.id}
                            href={service.href}
                            className="group flex-shrink-0 w-48 bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white hover:border-[#FF7A00]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                          >
                            <div className="relative mb-3">
                              <Image
                                src={service.image}
                                alt={service.title}
                                width={200}
                                height={120}
                                className="w-1/2 h-1/2 object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>

                            <h5 className="text-[#0A1D37] font-bold text-center text-sm mb-2 group-hover:text-[#FF7A00] transition-colors duration-300 line-clamp-2">
                              {service.title}
                            </h5>

                            <p className="text-[#A0A0A0] text-xs text-center leading-relaxed group-hover:text-[#0A1D37]/80 transition-colors duration-300 line-clamp-3">
                              {service.description}
                            </p>

                            <div className="mt-3 flex items-center text-[#4DBFF0] text-xs font-medium group-hover:text-[#FF7A00] transition-colors duration-300">
                              <span>مشاهده</span>
                              <svg
                                className="w-3 h-3 mr-1 rotate-180 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {/* Scroll Indicator */}
                      <div className="flex justify-center mt-2">
                        <div className="flex items-center gap-1 text-[#A0A0A0] text-xs">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16l4-4m0 0l4-4m-4 4H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>برای مشاهده بیشتر کشیده کنید</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Grid Layout */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 rounded-2xl  p-5">
                      {subcategory.services.map((service) => (
                        <Link
                          key={service.id}
                          href={service.href}
                          className="group bg-white/90  shadow-xl backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white hover:border-[#FF7A00]/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="relative mb-4 overflow-hidden rounded-xl">
                            <Image
                              src={service.image}
                              alt={service.title}
                              width={300}
                              height={200}
                              className="w-1/2 h-1/2 mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          <h5 className="text-[#0A1D37] text-center font-bold text-sm mb-2 group-hover:text-[#FF7A00] transition-colors duration-300">
                            {service.title}
                          </h5>

                          <p className="text-[#A0A0A0] text-center text-[10px] leading-relaxed group-hover:text-[#0A1D37]/80 transition-colors duration-300 mb-4">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-center text-[#4DBFF0] text-center text-xs font-medium group-hover:text-[#FF7A00] transition-colors duration-300">
                            <span> فرم سفارش</span>
                            <svg
                              className="w-4 h-4 mr-2 rotate-180 group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
