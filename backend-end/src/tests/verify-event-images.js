const { sequelize, Evenement, Ressource } = require('../models');

async function verifyEventImages() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.\n');
    console.log('====================================================');
    console.log('       VÉRIFICATION DES IMAGES DES ÉVÉNEMENTS       ');
    console.log('====================================================\n');

    const events = await Evenement.findAll();
    let eventsSansImages = 0;
    let eventsAvecImages = 0;
    

    for (const ev of events) {
      console.log(`Événement : ${ev.titre_fr}`);
      console.log(`Image principale : ${ev.image_principale ? '✅ ' + ev.image_principale : '❌ NULL'}`);
      
      const photos = await Ressource.findAll({
        where: { evenement_id: ev.id, type: 'photo' }
      });
      
      console.log(`Galerie (Ressources associées) : ${photos.length} image(s)`);
      if (photos.length > 0) {
        photos.forEach(p => console.log(`  - ${p.url}`));
        eventsAvecImages++;
      } else {
        if (!ev.image_principale) {
            eventsSansImages++;
        } else {
            // A une image principale mais pas de galerie
            eventsAvecImages++; 
        }
      }
      console.log('----------------------------------------------------');
    }

    console.log('\n================ RÉSUMÉ ================');
    console.log(`Total des événements vérifiés : ${events.length}`);
    console.log(`Événements AVEC au moins une image : ${eventsAvecImages}`);
    console.log(`Événements SANS aucune image : ${eventsSansImages}`);

  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
  } finally {
    await sequelize.close();
  }
}

verifyEventImages();
