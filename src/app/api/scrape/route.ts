import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// Tambahkan slug ke tipe Product
type Product = {
  name: string;
  price: number;
  category: string;
  image: string;
  slug: string;
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

      // Ambil gambar produk: prioritaskan data-src, lalu src, jangan ambil data:image
      const imgElem = $(element)
        .find(
          ".woocommerce-LoopProduct-link.woocommerce-loop-product__link img",
        )
        .first();
      let image = imgElem.attr("data-src") || imgElem.attr("src") || "";
      // Jika src/data-src mengandung 'data:image', kosongkan
      if (image.startsWith("data:image")) {
        image = "";
      }

      // Ambil slug dari href produk
      const linkElem = $(element)
        .find(".woocommerce-LoopProduct-link.woocommerce-loop-product__link")
        .first();
      let slug = "";
      const href = linkElem.attr("href") || "";
      // Ekstrak slug dari href, misal: /produk/SLUG/ atau .../produk/SLUG/
      const match = href.match(/\/produk\/([^\/]+)\/?/);
      if (match && match[1]) {
        slug = match[1];
      }

      if (name) {
        result.push({
          name,
          price,
          category,
          image,
          slug,
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
