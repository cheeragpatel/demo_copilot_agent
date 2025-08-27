/**
 * Simple test script to verify repository functionality
 */

import { getSuppliersRepository } from './repositories/suppliersRepo';
import { closeDatabase } from './db/sqlite';

async function testRepository(): Promise<void> {
    console.log('🧪 Testing suppliers repository...');

    try {
        const repo = await getSuppliersRepository();

        // Test findAll
        const suppliers = await repo.findAll();
        console.log(`✅ Found ${suppliers.length} suppliers`);

        // Test findById
        if (suppliers.length > 0) {
            const supplier = await repo.findById(suppliers[0].supplierId);
            console.log(`✅ Found supplier by ID: ${supplier?.name}`);
        }

        // Test findByName
        const searchResults = await repo.findByName('PurrTech');
        console.log(`✅ Search results: ${searchResults.length} suppliers`);

        console.log('🎉 Repository test completed successfully!');
    } catch (error) {
        console.error('❌ Repository test failed:', error);
        throw error;
    } finally {
        await closeDatabase();
    }
}

// Run if called directly
if (require.main === module) {
    testRepository()
        .then(() => {
            console.log('Repository test completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Repository test failed:', error);
            process.exit(1);
        });
}

export { testRepository };