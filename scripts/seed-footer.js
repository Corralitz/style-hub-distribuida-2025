const contentfulManagement = require('contentful-management');
require('dotenv').config();

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE_ID = process.env.REACT_APP_CONTENTFUL_SPACE_ID;

const client = contentfulManagement.createClient({
  accessToken: MANAGEMENT_TOKEN
});

const footerColumns = [
  {
    title: 'Customer Service',
    order: 1,
    links: [
      { text: 'Contact Us', url: '/contact' },
      { text: 'Size Guide', url: '/size-guide' },
      { text: 'Shipping Info', url: '/shipping' },
      { text: 'Returns & Exchanges', url: '/returns' },
      { text: 'FAQ', url: '/faq' }
    ]
  },
  {
    title: 'Company',
    order: 2,
    links: [
      { text: 'About Us', url: '/about' },
      { text: 'Careers', url: '/careers' },
      { text: 'Press', url: '/press' },
      { text: 'Privacy Policy', url: '/privacy' },
      { text: 'Terms of Service', url: '/terms' }
    ]
  },
  {
    title: 'Resources',
    order: 3,
    links: [
      { text: 'Style Guide', url: '/style-guide' },
      { text: 'Blog', url: '/blog' },
      { text: 'Newsletter', url: '/newsletter' },
      { text: 'Affiliates', url: '/affiliates' },
      { text: 'Sustainability', url: '/sustainability' }
    ]
  }
];

async function createContentType(environment) {
  console.log('📝 Creating Footer Column content type...\n');
  
  try {
    // Check if content type already exists
    const contentTypes = await environment.getContentTypes();
    const exists = contentTypes.items.find(ct => ct.sys.id === 'footerColumn');
    
    if (exists) {
      console.log('  ✓ Footer Column content type already exists\n');
      return;
    }

    // Create the content type
    const contentType = await environment.createContentTypeWithId('footerColumn', {
      name: 'Footer Column',
      displayField: 'title',
      fields: [
        {
          id: 'title',
          name: 'Title',
          type: 'Symbol',
          required: true,
          validations: [],
          localized: false
        },
        {
          id: 'order',
          name: 'Display Order',
          type: 'Number',
          required: true,
          validations: [],
          localized: false
        },
        {
          id: 'links',
          name: 'Links',
          type: 'Object',
          required: true,
          validations: [],
          localized: false
        }
      ]
    });

    await contentType.publish();
    console.log('  ✓ Footer Column content type created and published\n');
  } catch (error) {
    console.error('  ✗ Error creating content type:', error.message);
  }
}

async function seedFooterColumns(environment) {
  console.log('📦 Creating Footer Columns...\n');
  
  for (const column of footerColumns) {
    try {
      const entry = await environment.createEntry('footerColumn', {
        fields: {
          title: { 'en-US': column.title },
          order: { 'en-US': column.order },
          links: { 'en-US': column.links }
        }
      });

      await entry.publish();
      console.log(`  ✓ Created footer column: ${column.title}`);
    } catch (error) {
      console.error(`  ✗ Error creating footer column ${column.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Footer Columns Seeding Script\n');
  
  if (!MANAGEMENT_TOKEN) {
    console.error('❌ Error: CONTENTFUL_MANAGEMENT_TOKEN not found in .env');
    process.exit(1);
  }

  try {
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment('master');
    
    console.log(`✓ Connected to space\n`);

    // Create content type if it doesn't exist
    await createContentType(environment);
    
    // Seed footer columns
    await seedFooterColumns(environment);

    console.log('\n✅ Footer setup completed!');
    console.log('\n📌 Next steps:');
    console.log('1. Go to Contentful to see your footer columns');
    console.log('2. You can add, edit, or reorder columns');
    console.log('3. Changes will reflect immediately in your app');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
