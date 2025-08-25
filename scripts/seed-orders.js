const contentfulManagement = require('contentful-management');
require('dotenv').config();

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE_ID = process.env.REACT_APP_CONTENTFUL_SPACE_ID;

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN
});

// Quick orders for testing
const quickOrders = [
  {
    orderId: 'ORD-TEST-001',
    status: 'Delivered',
    total: 99.99,
    date: new Date().toISOString()
  },
  {
    orderId: 'ORD-TEST-002',
    status: 'Shipped',
    total: 149.99,
    date: new Date(Date.now() - 86400000).toISOString() // Yesterday
  },
  {
    orderId: 'ORD-TEST-003',
    status: 'Processing',
    total: 199.99,
    date: new Date().toISOString()
  }
];

async function seedQuickOrders() {
  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    console.log('Creating quick test orders...\n');
    
    // Get first available user and products
    const users = await environment.getEntries({ content_type: 'user', limit: 1 });
    const products = await environment.getEntries({ content_type: 'product', limit: 3 });
    
    if (users.items.length === 0) {
      console.log('No users found. Please create users first.');
      return;
    }
    
    const user = users.items[0];
    const productLinks = products.items.map(p => ({
      sys: { type: 'Link', linkType: 'Entry', id: p.sys.id }
    }));
    
    for (const order of quickOrders) {
      try {
        const entry = await environment.createEntry('order', {
          fields: {
            orderId: { 'en-US': order.orderId },
            status: { 'en-US': order.status },
            total: { 'en-US': order.total },
            date: { 'en-US': order.date },
            user: {
              'en-US': {
                sys: { type: 'Link', linkType: 'Entry', id: user.sys.id }
              }
            },
            products: { 'en-US': productLinks }
          }
        });
        
        await entry.publish();
        console.log(`✓ Created order: ${order.orderId}`);
      } catch (error) {
        console.error(`Error creating order ${order.orderId}:`, error.message);
      }
    }
    
    console.log('\n✅ Quick orders created!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

seedQuickOrders();
