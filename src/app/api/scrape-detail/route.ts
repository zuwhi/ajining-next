import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Fetch HTML dari URL target
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; scraping-bot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: 500 },
      );
    }
    const html = await res.text();

    const $ = cheerio.load(html);

    // Judul produk
    const title = $(".product_title.entry-title").first().text().trim();

    // Kategori
    const category = $(".single-product-category a").first().text().trim();

    // Harga
    const price = $(".price .woocommerce-Price-amount")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // Deskripsi singkat
    const shortDescription = $(
      ".woocommerce-product-details__short-description p",
    )
      .first()
      .text()
      .trim();

    // Deskripsi panjang (tab deskripsi)
    const longDescription = $("#tab-description")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // Spesifikasi (dari ul di tab deskripsi)
    const specs: Record<string, string> = {};
    $("#tab-description ul li").each((_, el) => {
      const label = $(el).find("strong").first().text().replace(":", "").trim();
      const value = $(el)
        .find("strong")
        .first()
        .parent()
        .text()
        .replace(/^.*?:\s*/, "")
        .trim();
      if (label && value) {
        specs[label] = value;
      }
    });

    // Gambar utama dan galeri
    const images: string[] = [];
    $(
      ".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image a",
    ).each((_, el) => {
      const imgUrl = $(el).attr("href");
      if (imgUrl) images.push(imgUrl);
    });
    // Fallback: jika tidak ada <a>, ambil <img>
    if (images.length === 0) {
      $(
        ".woocommerce-product-gallery__wrapper .woocommerce-product-gallery__image img",
      ).each((_, el) => {
        const imgUrl = $(el).attr("src");
        if (imgUrl) images.push(imgUrl);
      });
    }

    // Produk terkait
    const relatedProducts: Array<{
      title: string;
      url: string;
      image: string;
      price: string;
    }> = [];
    $("section.related ul.products > li").each((_, el) => {
      const prodTitle = $(el)
        .find(".woocommerce-loop-product__title")
        .text()
        .trim();
      const prodUrl =
        $(el)
          .find("a.woocommerce-loop-product__link, a.ast-loop-product__link")
          .attr("href") || "";
      const prodImg = $(el).find("img").attr("src") || "";
      const prodPrice = $(el)
        .find(".price .woocommerce-Price-amount")
        .text()
        .replace(/\s+/g, " ")
        .trim();
      if (prodTitle) {
        relatedProducts.push({
          title: prodTitle,
          url: prodUrl,
          image: prodImg,
          price: prodPrice,
        });
      }
    });

    return NextResponse.json({
      title,
      category,
      price,
      shortDescription,
      longDescription,
      specs,
      images,
      relatedProducts,
      sourceUrl: url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 },
    );
  }
}
