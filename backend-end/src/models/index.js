const { sequelize } = require('../config/database');

// Importer tous les modèles
const Utilisateur = require('./Utilisateur');
const admin = require('./admin');
const membre = require('./membre');
const benevole = require('./benevole');
const Domaine = require('./Domaine');
const Projet = require('./Projet');
const Evenement = require('./Evenement');
const Ressource = require('./Ressource');
const Partenariat = require('./Partenariat');
const ProjetPartenariat = require('./ProjetPartenariat');
const EvenementPartenariat = require('./EvenementPartenariat');
const MessageContact = require('./MessageContact');
const Don = require('./Don');
const DonFinancier = require('./DonFinancier');
const DonMateriel = require('./DonMateriel');
const Stat = require('./Stat');
const RefreshToken = require('./RefreshToken');
const TokenBlacklist = require('./TokenBlacklist');

// --- Associations ---

// Héritage 1:1 pour Utilisateur
Utilisateur.hasOne(admin, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
admin.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(membre, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
membre.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasOne(benevole, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
benevole.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// RefreshToken associations
Utilisateur.hasMany(RefreshToken, { foreignKey: 'utilisateur_id', onDelete: 'CASCADE' });
RefreshToken.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

// Associations Projet & Domaine
Domaine.hasMany(Projet, { foreignKey: 'domaine_id', onDelete: 'RESTRICT' });
Projet.belongsTo(Domaine, { foreignKey: 'domaine_id' });

// Associations Evenement, Projet & Domaine
Domaine.hasMany(Evenement, { foreignKey: 'domaine_id', onDelete: 'RESTRICT' });
Evenement.belongsTo(Domaine, { foreignKey: 'domaine_id' });

Projet.hasMany(Evenement, { foreignKey: 'projet_id', onDelete: 'SET NULL' });
Evenement.belongsTo(Projet, { foreignKey: 'projet_id' });

// Associations Ressources
Projet.hasMany(Ressource, { foreignKey: 'projet_id', onDelete: 'CASCADE' });
Ressource.belongsTo(Projet, { foreignKey: 'projet_id' });

Evenement.hasMany(Ressource, { foreignKey: 'evenement_id', onDelete: 'CASCADE' });
Ressource.belongsTo(Evenement, { foreignKey: 'evenement_id' });

// Associations Dons
Projet.hasMany(Don, { foreignKey: 'projet_id', onDelete: 'SET NULL' });
Don.belongsTo(Projet, { foreignKey: 'projet_id' });

Don.hasOne(DonFinancier, { foreignKey: 'don_id', onDelete: 'CASCADE' });
DonFinancier.belongsTo(Don, { foreignKey: 'don_id' });

Don.hasOne(DonMateriel, { foreignKey: 'don_id', onDelete: 'CASCADE' });
DonMateriel.belongsTo(Don, { foreignKey: 'don_id' });

// Associations Many-to-Many : Projet <-> Partenariat
Projet.belongsToMany(Partenariat, {
    through: ProjetPartenariat,
    foreignKey: 'projet_id',
    otherKey: 'partenariat_id',
    as: 'Partenariats'
});
Partenariat.belongsToMany(Projet, {
    through: ProjetPartenariat,
    foreignKey: 'partenariat_id',
    otherKey: 'projet_id',
    as: 'Projets'
});

// Associations Many-to-Many : Evenement <-> Partenariat
Evenement.belongsToMany(Partenariat, {
    through: EvenementPartenariat,
    foreignKey: 'evenement_id',
    otherKey: 'partenariat_id',
    as: 'Partenariats'
});
Partenariat.belongsToMany(Evenement, {
    through: EvenementPartenariat,
    foreignKey: 'partenariat_id',
    otherKey: 'evenement_id',
    as: 'Evenements'
});

module.exports = {
    sequelize,
    Utilisateur,
    admin,
    membre,
    benevole,
    Domaine,
    Projet,
    Evenement,
    Ressource,
    Partenariat,
    ProjetPartenariat,
    EvenementPartenariat,
    MessageContact,
    Don,
    DonFinancier,
    DonMateriel,
    Stat,
    RefreshToken,
    TokenBlacklist
};
