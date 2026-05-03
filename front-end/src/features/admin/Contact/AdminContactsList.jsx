
// import React, { useState, useMemo, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import styles from './Contact.module.css';
// import ConfirmPopup from "../../../components/popup/ConfirmPopup";
// import { fetchContacts, deleteContact, toggleContactStatus } from "./adminContactSlice";

// export default function AdminContactsList() {
//     const dispatch = useDispatch();

//     // Récupération des données depuis Redux
//     const { contacts, loading, error } = useSelector((state) => state.contacts);

//     const [filter, setFilter] = useState('tous');
//     const [search, setSearch] = useState('');
//     const [expandedId, setExpandedId] = useState(null);

//     // --- ÉTAT DU POPUP DE SUPPRESSION ---
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [msgToDelete, setMsgToDelete] = useState(null);

//     // Chargement initial des contacts
//     useEffect(() => {
//         dispatch(fetchContacts());
//     }, [dispatch]);

//     // --- HANDLERS ---
//     const triggerDeletePopup = (e, msg) => {
//         e.stopPropagation(); // Empêche l'ouverture de la carte
//         setMsgToDelete(msg);
//         setIsPopupOpen(true);
//     };

//     const handleConfirmDelete = () => {
//         dispatch(deleteContact(msgToDelete.id));
//         if (expandedId === msgToDelete.id) setExpandedId(null);
//         setIsPopupOpen(false);
//         setMsgToDelete(null);
//     };

//     const handleExpandMessage = (id) => {
//         setExpandedId(expandedId === id ? null : id);
//     };

//     const handleToggleRead = (e, msg) => {
//         e.stopPropagation(); // Empêche l'ouverture de la carte
//         // On dispatch l'action Redux pour inverser le statut "lu"
//         dispatch(toggleContactStatus({ id: msg.id, lu: msg.lu }));
//     };

//     // --- LOGIQUE DE FILTRAGE ET RECHERCHE ---
//     const filteredMessages = useMemo(() => {
//         // Gestion du format Sequelize (rows) ou tableau simple
//         const list = Array.isArray(contacts) ? contacts : (contacts?.rows || []);

//         return list.filter(m => {
//             const matchesSearch =
//                 m.nom_complet?.toLowerCase().includes(search.toLowerCase()) ||
//                 m.objet?.toLowerCase().includes(search.toLowerCase());

//             if (filter === 'non-lus') return matchesSearch && !m.lu;
//             if (filter === 'lus') return matchesSearch && m.lu;
//             return matchesSearch;
//         });
//     }, [contacts, filter, search]);

//     const unreadCount = (Array.isArray(contacts) ? contacts : (contacts?.rows || []))
//         .filter(m => !m.lu).length;

//     // --- RENDU ---
//     if (loading && (!contacts || (Array.isArray(contacts) ? contacts.length === 0 : !contacts.rows))) {
//         return <div className={styles.container}><p>Chargement des messages...</p></div>;
//     }

//     return (
//         <div className={styles.container}>
//             {/* POPUP DE CONFIRMATION */}
//             <ConfirmPopup
//                 isOpen={isPopupOpen}
//                 onClose={() => setIsPopupOpen(false)}
//                 onConfirm={handleConfirmDelete}
//                 variant="danger"
//                 title="Supprimer le message ?"
//                 description="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
//                 detailLabel="Expéditeur"
//                 detailValue={msgToDelete?.nom_complet || ""}
//                 confirmLabel="Supprimer"
//                 cancelLabel="Annuler"
//             />

//             <header className={styles.header}>
//                 <h1 className={styles.title}>GESTION DES MESSAGES</h1>
//                 <p className={styles.subtitle}>Gérez les demandes de contact et les réclamations.</p>
//             </header>

//             {/* BARRE DE RECHERCHE */}
//             <div className={styles.searchWrapper}>
//                 <span className={styles.searchIcon}>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                         <circle cx="11" cy="11" r="8"></circle>
//                         <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                     </svg>
//                 </span>
//                 <input
//                     type="text"
//                     placeholder="Rechercher un message ou un expéditeur..."
//                     className={styles.searchInput}
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//             </div>

//             {/* BARRE DE FILTRES */}
//             <div className={styles.filterBar}>
//                 <button
//                     className={`${styles.filterBtn} ${filter === 'tous' ? styles.active : ''}`}
//                     onClick={() => setFilter('tous')}
//                 >
//                     Tous
//                 </button>
//                 <button
//                     className={`${styles.filterBtn} ${filter === 'non-lus' ? styles.active : ''}`}
//                     onClick={() => setFilter('non-lus')}
//                 >
//                     Non lus ({unreadCount})
//                 </button>
//                 <button
//                     className={`${styles.filterBtn} ${filter === 'lus' ? styles.active : ''}`}
//                     onClick={() => setFilter('lus')}
//                 >
//                     Lus
//                 </button>
//             </div>

//             {/* LISTE DES MESSAGES */}
//             <div className={styles.list}>
//                 {filteredMessages.map(msg => (
//                     <div
//                         key={msg.id}
//                         className={`${styles.card} ${expandedId === msg.id ? styles.expandedCard : ''}`}
//                     >
//                         <div className={styles.cardMainRow} onClick={() => handleExpandMessage(msg.id)}>
//                             {/* AVATAR (Initiales) */}
//                             <div className={styles.avatar}>
//                                 {msg.nom_complet ? msg.nom_complet.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
//                             </div>

//                             {/* CONTENU APERÇU */}
//                             <div className={styles.content}>
//                                 <div className={styles.senderInfo}>
//                                     <span className={styles.name}>{msg.nom_complet}</span>
//                                     <span className={styles.dot}>•</span>
//                                     <span className={styles.email}>{msg.email}</span>
//                                 </div>
//                                 <p className={styles.subject}>{msg.objet}</p>
//                             </div>

//                             {/* ACTIONS (Boutons) */}
//                             <div className={styles.actions}>
//                                 <button
//                                     className={`${styles.actionBtn} ${msg.lu ? styles.readIcon : ''}`}
//                                     onClick={(e) => handleToggleRead(e, msg)}
//                                     title={msg.lu ? "Marquer comme non lu" : "Marquer comme lu"}
//                                 >
//                                     {msg.lu ?
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                             <path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                         </svg>
//                                         :
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                                             <path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                                         </svg>
//                                     }
//                                 </button>
//                                 <button
//                                     className={styles.deleteBtn}
//                                     onClick={(e) => triggerDeletePopup(e, msg)}
//                                     title="Supprimer"
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <polyline points="3 6 5 6 21 6"></polyline>
//                                         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* CORPS DU MESSAGE (Détails) */}
//                         {expandedId === msg.id && (
//                             <div className={styles.messageBody}>
//                                 <div className={styles.bodyDivider}></div>
//                                 <h4>Message détaillé</h4>
//                                 <p>{msg.message}</p>
//                                 <button className={styles.replyBtn} onClick={() => handleReplyEmail(msg)}>
//                                     Répondre par email
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 ))}

//                 {filteredMessages.length === 0 && !loading && (
//                     <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
//                         Aucun message ne correspond à votre recherche.
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// const handleReplyEmail = (msg) => {
//     const subject = encodeURIComponent(`Association Tifaouine - ${msg.objet}`);
//     const body = encodeURIComponent(`Bonjour ${msg.nom_complet},\n\n`);

//     const mailtoUrl = `mailto:${msg.email}?subject=${subject}&body=${body}`;

//     // Ouvre le client mail dans un nouvel onglet ou une nouvelle fenêtre
//     window.open(mailtoUrl, '_blank');
// };


















import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Contact.module.css';
import ConfirmPopup from "../../../components/popup/ConfirmPopup";
import { fetchContacts, deleteContact, toggleContactStatus } from "./adminContactSlice";

export default function AdminContactsList() {
    const dispatch = useDispatch();
    const { contacts, loading, error } = useSelector((state) => state.contacts);

    const [filter, setFilter] = useState('tous');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [msgToDelete, setMsgToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    // --- HANDLERS ---
    const handleReplyEmail = (msg) => {
        const subject = encodeURIComponent(`Association Tifaouine - ${msg.objet}`);
        const body = encodeURIComponent(`Bonjour ${msg.nom_complet},\n\n`);
        const mailtoUrl = `mailto:${msg.email}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl, '_blank');
    };

    const triggerDeletePopup = (e, msg) => {
        e.stopPropagation();
        setMsgToDelete(msg);
        setIsPopupOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteContact(msgToDelete.id));
        if (expandedId === msgToDelete.id) setExpandedId(null);
        setIsPopupOpen(false);
        setMsgToDelete(null);
    };

    const handleExpandMessage = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleToggleRead = (e, msg) => {
        e.stopPropagation();
        dispatch(toggleContactStatus({ id: msg.id, lu: msg.lu }));
    };

    // --- FILTRAGE ---
    const filteredMessages = useMemo(() => {
        const list = Array.isArray(contacts) ? contacts : (contacts?.rows || []);
        return list.filter(m => {
            const matchesSearch =
                m.nom_complet?.toLowerCase().includes(search.toLowerCase()) ||
                m.objet?.toLowerCase().includes(search.toLowerCase());

            if (filter === 'non-lus') return matchesSearch && !m.lu;
            if (filter === 'lus') return matchesSearch && m.lu;
            return matchesSearch;
        });
    }, [contacts, filter, search]);

    const unreadCount = (Array.isArray(contacts) ? contacts : (contacts?.rows || []))
        .filter(m => !m.lu).length;

    if (loading && (!contacts || (Array.isArray(contacts) ? contacts.length === 0 : !contacts.rows))) {
        return <div className={styles.container}><p>Chargement des messages...</p></div>;
    }

    return (
        <div className={styles.container}>
            <ConfirmPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="danger"
                title="Supprimer le message ?"
                description="Êtes-vous sûr de vouloir supprimer ce message ?"
                detailLabel="Expéditeur"
                detailValue={msgToDelete?.nom_complet || ""}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
            />

            <header className={styles.header}>
                <h1 className={styles.title}>GESTION DES MESSAGES</h1>
                <p className={styles.subtitle}>Gérez les demandes de contact.</p>
            </header>

            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className={styles.searchInput}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className={styles.filterBar}>
                <button className={`${styles.filterBtn} ${filter === 'tous' ? styles.active : ''}`} onClick={() => setFilter('tous')}>Tous</button>
                <button className={`${styles.filterBtn} ${filter === 'non-lus' ? styles.active : ''}`} onClick={() => setFilter('non-lus')}>Non lus ({unreadCount})</button>
                <button className={`${styles.filterBtn} ${filter === 'lus' ? styles.active : ''}`} onClick={() => setFilter('lus')}>Lus</button>
            </div>

            <div className={styles.list}>
                {filteredMessages.map(msg => (
                    <div key={msg.id} className={`${styles.card} ${expandedId === msg.id ? styles.expandedCard : ''}`}>
                        <div className={styles.cardMainRow} onClick={() => handleExpandMessage(msg.id)}>
                            <div className={styles.avatar}>
                                {msg.nom_complet ? msg.nom_complet[0].toUpperCase() : '?'}
                            </div>

                            <div className={styles.content}>
                                <div className={styles.senderInfo}>
                                    <span className={styles.name}>{msg.nom_complet}</span>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.email}>{msg.email}</span>
                                </div>
                                <p className={styles.subject}>{msg.objet}</p>
                            </div>

                            <div className={styles.actions}>
                                <button className={`${styles.actionBtn} ${msg.lu ? styles.readIcon : ''}`} onClick={(e) => handleToggleRead(e, msg)}>
                                    {msg.lu ? 
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        : 
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 12L11.9497 16.9497L22.5572 6.34326M2.0498 12.0503L6.99955 17M17.606 6.39355L12.3027 11.6969" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    }
                                </button>
                                <button className={styles.deleteBtn} onClick={(e) => triggerDeletePopup(e, msg)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>

                        {expandedId === msg.id && (
                            <div className={styles.messageBody}>
                                <div className={styles.bodyDivider}></div>
                                <h4>Message détaillé</h4>
                                <p>{msg.message}</p>
                                <button className={styles.replyBtn} onClick={() => handleReplyEmail(msg)}>
                                    Répondre par email
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}