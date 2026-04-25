const { toDocumentDTO } = require('../dto/ressource.dto');

/**
 * Professional Test Suite for Ressource DTO
 * This script verifies that the database records are correctly transformed 
 * into the format expected by the frontend.
 */
function testRessourceDTO() {
    console.log('=== 🚀 Professional Ressource Structure Test ===\n');

    // Mock record from database
    const mockRecord = {
        id: 153,
        titre_fr: "Rapport annuel de l'association Tifaouine",
        description_fr: "Rapport annuel présentant les activités, projets réalisés et bilan financier de l'association Tifaouine.",
        url: "/data/ressources/documents/ccn_9_bouhaddach_omar_tp1-1775661762914-876013447.pdf",
        image_couverture: "/data/ressources/images/documents/couvertures/3.png",
        file_type: "pdf",
        file_size: 711927, // ~695.2 Ko
        type: "rapport"
    };

    const lang = 'fr';
    const result = toDocumentDTO(mockRecord, lang);

    const expectations = {
        id: 153,
        title: "Rapport annuel de l'association Tifaouine",
        description: "Rapport annuel présentant les activités, projets réalisés et bilan financier de l'association Tifaouine.",
        downloadUrl: "/data/ressources/documents/ccn_9_bouhaddach_omar_tp1-1775661762914-876013447.pdf",
        imageUrl: "/data/ressources/images/documents/couvertures/3.png",
        fileType: "PDF",
        fileSize: "695.2 Ko",
        type: "rapport"
    };

    let passed = true;
    for (const [key, expectedValue] of Object.entries(expectations)) {
        const actualValue = result[key];
        if (actualValue === expectedValue) {
            console.log(`✅ [PASS] ${key}: "${actualValue}"`);
        } else {
            console.error(`❌ [FAIL] ${key}: Expected "${expectedValue}", but got "${actualValue}"`);
            passed = false;
        }
    }

    if (passed) {
        console.log('\n✨ ALL TESTS PASSED! The structure is 100% compliant with frontend requirements.');
    } else {
        console.error('\n⚠️ SOME TESTS FAILED. Please check the structure.');
        process.exit(1);
    }
}

testRessourceDTO();
