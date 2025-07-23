import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

type Product = {
  name: string;
  price: number;
  category: string;
};

export async function GET() {
  try {
    const response = await axios.get(
      "https://samisukofurnicraftjepara.com/shop/",
    );
    const html = response.data;
    const $ = cheerio.load(html);

    const result: Product[] = [];

    $("ul.products > li.product").each((index, element) => {
      const name = $(element)
        .find(".woocommerce-loop-product__title")
        .text()
        .trim();

      const priceText = $(element)
        .find(".price bdi")
        .first()
        .text()
        .replace(/[Rp.,\s]/g, "");
      const price = parseInt(priceText, 10) || 0;

      const category =
        $(element).find(".ast-woo-product-category").first().text().trim() ||
        "Uncategorized";

      if (name) {
        result.push({
          name,
          price,
          category,
        });
      }
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to scrape data", detail: message },
      { status: 500 },
    );
  }
}
