const puppeteer = require("puppeteer");

module.exports = async (req, res) => {
  const { profileUrl } = req.query;
  if (!profileUrl) return res.status(400).send("Missing profileUrl");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // PEGAR TUS COOKIES AQUÍ
    await page.setCookie(
      // { "name": "li_at", "value": "xxx", "domain": ".linkedin.com", ... }
    );

    await page.goto(profileUrl, { waitUntil: "networkidle2" });

    const postData = await page.evaluate(() => {
      const texto = document.querySelector('span[dir="ltr"]')?.innerText || "Texto no encontrado";
      const fecha = document.querySelector('.update-components-actor__sub-description span')?.innerText || "Fecha no encontrada";
      return { texto, fecha };
    });

    await browser.close();
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
