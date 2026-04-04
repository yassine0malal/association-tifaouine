const domaineRepository = require('../repositories/domaine.repository');

class DomaineService {
    
    // creer un nouveau domaine
    async createDomaine(data) {
        // petites verifications de base 
        if (!data.nom_fr || !data.nom_ar || !data.nom_en) {
            throw new Error("les noms du domaine en fr, ar et en sont obligatoires");
        }
        
        // verifier si le meme domaine existe deja 
        const exsist = await domaineRepository.findByName(data.nom_fr);
        if (exsist) {
            throw new Error("ce domaine existe deja dans la base de donnees");
        }

        // pas de transaction ici car on manipule une seule table
        const nvDomaine = await domaineRepository.create(data);
        return nvDomaine;
    }

    // recuperation de toutes les donnees 
    async getAllDomaines() {
        return await domaineRepository.findAll();
    }

    // recuperer avec un identifiant 
    async getDomaineById(id) {
        const d = await domaineRepository.findById(id);
        if (!d) throw new Error("ce domaine n'existe pas");
        return d;
    }

    // mise a jour du domaine 
    async updateDomaine(id, updateData) {
        const d = await domaineRepository.findById(id);
        if (!d) throw new Error("domaine introuvable pour la mise a jour");

        const misAjour = await domaineRepository.update(id, updateData);
        return misAjour;
    }

    // suppression 
    async deleteDomaine(id) {
        const rslt = await domaineRepository.delete(id);
        if (!rslt) throw new Error("suppression impossible, ce domaine n'existe pas");
        return true;
    }
}

module.exports = new DomaineService();
