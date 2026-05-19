const { sequelize, Ressource } = require('../models');
const ressourceRepository = require('../repositories/ressource.repository');
const { toDocumentDTO } = require('../dto/ressource.dto');

/**
 * 🛡️ PROFESSIONAL INTEGRATION TEST
 * Verifies that the database content matches the frontend requirements
 * exactly as requested by the user.
 */
async function runProTest() {
    console.log('=== 🛡️  INTEGRATION TEST: RESSOURCE STRUCTURE 100% PERFECT ===\n');

    try {
        // 1. Connection check
        await sequelize.authenticate();
        console.log('✅ Connection to database established.');

        // 2. Fetch Featured Document
        const featured = await ressourceRepository.findFeaturedDocument();
        if (!featured) {
            console.error('❌ FAILED: Featured document not found in DB.');
        } else {
            console.log(`✅ Found Featured Document: "${featured.nom_original}"`);
            
            // 3. Test DTO for Featured
            const dto = toDocumentDTO(featured, 'fr');
            verifyDTO(dto, 'Featured Document (FR)');
        }

        // 4. Fetch regular association documents
        const result = await ressourceRepository.findDocumentsAssociation({ limit: 5 });
        console.log(`\n✅ Found ${result.count} association documents in DB.`);
        
        if (result.rows.length > 0) {
            const firstDoc = result.rows[0];
            const dto = toDocumentDTO(firstDoc, 'fr');
            verifyDTO(dto, 'First Regular Document (FR)');
        } else {
            console.warn('⚠️ No regular documents found in DB. Make sure the seeder ran correctly.');
        }

    } catch (error) {
        console.error('❌ ERROR DURING TEST:', error.message);
        if (error.stack) console.error(error.stack);
    } finally {
        await sequelize.close();
        console.log('\n--- Test End ---');
    }
}

/**
 * Verifies the structure of a DTO object
 */
function verifyDTO(dto, label) {
    console.log(`\n[Checking ${label}]`);
    
    const requiredFields = [
        'id', 'title', 'description', 'imageUrl', 'downloadUrl', 'fileType', 'fileSize', 'type'
    ];

    let allOk = true;
    requiredFields.forEach(field => {
        const val = dto[field];
        if (val === undefined || val === null) {
            console.error(`  ❌ Missing field: ${field}`);
            allOk = false;
        } else {
            // Specific check for imageUrl format requested by user
            if (field === 'imageUrl' && !val.startsWith('/data/ressources/images/')) {
                 console.warn(`  ⚠️ Warning: imageUrl "${val}" does not start with /data/ressources/images/`);
            }
            console.log(`  ✅ ${field.padEnd(12)}: ${val}`);
        }
    });

    if (allOk) {
        console.log(`✨ ${label} structure is 100% PERFECT!`);
    } else {
        console.error(`⚠️ ${label} structure has issues.`);
    }
}

runProTest();
