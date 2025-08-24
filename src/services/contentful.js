import { createClient } from 'contentful';

// Initialize Contentful client
const client = createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.REACT_APP_CONTENTFUL_ENVIRONMENT || 'master'
});

// Helper function to transform Contentful image URLs
const transformImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/400';
  // Ensure the URL starts with https://
  const imageUrl = url.startsWith('//') ? `https:${url}` : url;
  // Add query parameters for optimization
  return `${imageUrl}?w=400&h=400&fit=crop`;
};

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await client.getEntries({
      content_type: 'product',
      include: 2, // Include linked assets
    });

    return response.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || 'uncategorized',
      description: item.fields.description || '',
      image: item.fields.image?.fields?.file?.url 
        ? transformImageUrl(item.fields.image.fields.file.url)
        : 'https://via.placeholder.com/400',
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ['M', 'L'],
      colors: item.fields.colors || ['Black'],
      inStock: item.fields.inStock !== false,
      featured: item.fields.featured || false,
      createdAt: item.sys.createdAt,
      updatedAt: item.sys.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const entry = await client.getEntry(id);
    
    return {
      id: entry.sys.id,
      name: entry.fields.name,
      price: entry.fields.price,
      category: entry.fields.category?.toLowerCase() || 'uncategorized',
      description: entry.fields.description || '',
      image: entry.fields.image?.fields?.file?.url 
        ? transformImageUrl(entry.fields.image.fields.file.url)
        : 'https://via.placeholder.com/400',
      rating: entry.fields.rating || 4.0,
      reviews: entry.fields.reviews || 0,
      sizes: entry.fields.sizes || ['M', 'L'],
      colors: entry.fields.colors || ['Black'],
      inStock: entry.fields.inStock !== false,
      featured: entry.fields.featured || false
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Fetch all categories
export const getCategories = async () => {
  try {
    const response = await client.getEntries({
      content_type: 'category',
      include: 2,
    });

    return response.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      description: item.fields.description || '',
      image: item.fields.image?.fields?.file?.url 
        ? transformImageUrl(item.fields.image.fields.file.url)
        : null
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch all orders
export const getOrders = async () => {
  try {
    const response = await client.getEntries({
      content_type: 'order',
      include: 3, // Include nested references
    });

    return response.items.map(item => ({
      id: item.fields.orderId || item.sys.id,
      orderId: item.fields.orderId,
      date: item.fields.date || item.sys.createdAt,
      status: item.fields.status || 'Processing',
      total: item.fields.total || 0,
      products: item.fields.products?.map(product => ({
        id: product.sys.id,
        name: product.fields.name,
        price: product.fields.price,
        quantity: 1 // You might want to add quantity field to your content model
      })) || [],
      user: item.fields.user ? {
        id: item.fields.user.sys.id,
        name: item.fields.user.fields.name,
        email: item.fields.user.fields.email
      } : null
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Fetch user by ID
export const getUserById = async (id) => {
  try {
    const entry = await client.getEntry(id);
    
    return {
      id: entry.sys.id,
      name: entry.fields.name,
      email: entry.fields.email || '',
      bio: entry.fields.bio || '',
      avatar: entry.fields.avatar?.fields?.file?.url 
        ? transformImageUrl(entry.fields.avatar.fields.file.url)
        : null
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Fetch featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await client.getEntries({
      content_type: 'product',
      'fields.featured': true,
      include: 2,
    });

    return response.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || 'uncategorized',
      description: item.fields.description || '',
      image: item.fields.image?.fields?.file?.url 
        ? transformImageUrl(item.fields.image.fields.file.url)
        : 'https://via.placeholder.com/400',
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ['M', 'L'],
      colors: item.fields.colors || ['Black'],
      inStock: item.fields.inStock !== false,
      featured: true
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Search products by query
export const searchProducts = async (query) => {
  try {
    const response = await client.getEntries({
      content_type: 'product',
      query: query,
      include: 2,
    });

    return response.items.map(item => ({
      id: item.sys.id,
      name: item.fields.name,
      price: item.fields.price,
      category: item.fields.category?.toLowerCase() || 'uncategorized',
      description: item.fields.description || '',
      image: item.fields.image?.fields?.file?.url 
        ? transformImageUrl(item.fields.image.fields.file.url)
        : 'https://via.placeholder.com/400',
      rating: item.fields.rating || 4.0,
      reviews: item.fields.reviews || 0,
      sizes: item.fields.sizes || ['M', 'L'],
      colors: item.fields.colors || ['Black'],
      inStock: item.fields.inStock !== false,
      featured: item.fields.featured || false
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};
