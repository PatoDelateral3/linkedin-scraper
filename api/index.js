const puppeteer = require("puppeteer");

module.exports = async function (req, res) {
  const { profileUrl } = req.query;
  if (!profileUrl) {
    res.status(400).send("Falta el parámetro profileUrl");
    return;
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // PEGAR TUS COOKIES DE LINKEDIN ACÁ si querés acceder a perfiles protegidos
    await page.setCookie(
      // { "name": "li_at", "value": "xxx", "domain": ".linkedin.com", ... }
    );

    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    const postData = await page.evaluate(() => {
      const texto = document.querySelector('span[dir="ltr"]')?.innerText || "No se encontró texto";
      const fecha = document.querySelector('.update-components-actor__sub-description span')?.innerText || "Fecha no encontrada";
      return { texto, fecha };
    });

    await browser.close();
    res.status(200).json

