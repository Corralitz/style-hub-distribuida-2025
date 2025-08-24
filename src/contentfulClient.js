import { createClient } from "contentful";

const client = createClient({
    space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

export const getProductById = async (id) => {
    try {
        const entries = await client.getEntries({
            content_type: "productDetail", // your Contentful model ID
            // "sys.id": id,                  // match Contentful entry id
        });
        console.log(entries.items);
        return entries.items[0];
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

export const getAllProducts = async () => {
    try {
        const entries = await client.getEntries({
            content_type: "productDetail",
        });
        return entries.items;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProducts = async () => {
  try {
    const entries = await client.getEntries({
      content_type: "product", // matches your Product model ID
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

