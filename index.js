const express = require("express");
const puppeteer = require("puppeteer");
const server = express();

server.listen(3000, () => {
    console.log("Rodando na porta 3000");
});

server.get("/ponto/av-pedro-lessa-2154", async (req, res) => {
    const onibus = await getOnibus();
    res.json(onibus);
});

async function getOnibus() {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto("https://m.piracicabana.com.br/_versoes/2/pg_QuantoTempoFalta.php?idPonto=9568");

        const onibus = [];

        await page.waitForSelector('.span_list_previsao');

        const onibusElements = await page.$$('.span_list_previsao');

        for (const onibusElement of onibusElements) {
            const linha = await onibusElement.$eval('.list_linha .link_linha', element => element.innerText);
            const preco = await onibusElement.$eval('.list_linha .p_tarifas', element => element.innerText);
            const nomeMotorista = await onibusElement.$eval('.list_veiculo span', element => element.innerText.trim());
            const tempo = await onibusElement.$eval('.list_previsao .minutos', element => element.innerText);

            onibus.push({ linha, preco, nomeMotorista, tempo });
        }

        await browser.close();

        return onibus;
    } catch (error) {
        console.error("Erro: " + error);
        // console.error("Erro: ", error);
        return ["Erro"];
    }
}